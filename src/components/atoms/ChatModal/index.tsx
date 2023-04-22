import React, { useEffect, useRef, useState } from "react";
import { Button, Drawer, Input, List, message } from "antd";
import styles from "./styles.module.scss";
import { RootState, useAppDispatch, useAppSelector } from "~/store";
import { SendOutlined } from "@ant-design/icons";
import { sendMessage } from "~/api/user";
import { setMessages } from "~/store/chatMessages";
import { socket } from "~/socket";
import ScrollIntoView from "react-scroll-into-view";
// import ScrollTo from "react-scroll-into-view";

interface Props {
  userId: string;
  open: boolean;
  onClose: () => void;
  receiverName: string;
}
const ChatModal = (props: Props) => {
  const { userId, open, onClose, receiverName } = props;
  const lastItemRef = useRef<any>(null);
  const messages = useAppSelector(
    (state: RootState) => state.chatMessages.messages
  );

  const receiver = useAppSelector(
    (state: RootState) => state.chatMessages.receiver
  );

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (lastItemRef.current) {
      lastItemRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  const [value, setValue] = useState<string>("");

  const handleSend = async () => {
    try {
      const res = await sendMessage(receiver, value);

      if (res && !res.errorCode && !res.errors.length) {
        const { messages } = res.data;

        setValue(() => "");
        dispatch(setMessages(messages));
      }
    } catch (error) {
      message.error(String(error));
    }
  };

  useEffect(() => {
    if (open) {
      socket.connect();

      socket.on(userId, (value) => {
        const { messages } = value;

        dispatch(setMessages(messages.messages));
      });
    } else {
      socket.disconnect();
    }

    return () => {
      socket.disconnect();
    };
  }, [open]);

  return (
    <Drawer
      title={receiverName}
      placement="right"
      onClose={onClose}
      className={styles.modalChat}
      open={open}
      footer={
        <div className={styles.inputChat}>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
          />

          <Button onClick={handleSend}>
            <SendOutlined />
          </Button>
        </div>
      }
    >
      <List
        dataSource={messages}
        className={styles.listChat}
        renderItem={(item, index) => (
          <div className={styles.chatBorder}>
            <List.Item
              className={item.from === userId ? styles.sender : styles.receiver}
              key={item._id}
              id={index === messages.length - 1 ? "last-item" : ""}
              ref={index === messages.length - 1 ? lastItemRef : null}
            >
              {item.content}
            </List.Item>
          </div>
        )}
      />
    </Drawer>
  );
};

export default ChatModal;
