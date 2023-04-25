import { List, Avatar, message, Menu } from "antd";
import React, { useMemo, useState } from "react";
import styles from "./styles.module.scss";
import { useFriends } from "~/hooks/useFriends";
import { RootState, useAppDispatch, useAppSelector } from "~/store";
import Spin from "~/components/atoms/Spin";
import ChatModal from "~/components/atoms/ChatModal";
import { setMessages, setReceiver } from "~/store/chatMessages";
import { getMessages } from "~/api/user";
import type { MenuProps } from 'antd';
import { getCookie } from "~/utils/cookie";


// type MenuItem = Required<MenuProps>['items'][number];
const FriendList = () => {
  const userData = useAppSelector((state) => state.userInfo.userData);
  const userId = getCookie('userId')
  const [open, setOpen] = useState<boolean>(false);
  const [receiverName, setReceiverName] = useState<string>("");
  const { data, isLoading, isFetching } = useFriends({
    page: 1,
    limit: 999,
    userId: userId,
  });

  const friends = data?.data?.following;
  const onClose = () => {
    setOpen(false);
  };

  const dispatch = useAppDispatch();

  const userMessages = useAppSelector(
    (state: RootState) => state.userInfo.messages
  );

  const handleClick = async (receiver: string) => {
    dispatch(setReceiver(receiver));
    try {
      const res = await getMessages(receiver);

      if (res && res.errorCode === 0 && !res.errors.length) {
        const { messages } = res.data;

        dispatch(setMessages(messages));
        setOpen(true);
      } else {
        dispatch(setMessages([]));
        dispatch(setReceiver(""));
        message.error(res.message);
      }
    } catch (error) {
      message.error(String(error));
    }
  };

  const getLastMessage = (receiverId: string): string => {
    const matchedUserMessage = userMessages.filter(
      (message) => message.receiver._id === receiverId
    );

    if (!matchedUserMessage.length) {
      return "";
    }

    const { messages } = matchedUserMessage[0];

    if (!messages.length) {
      return "";
    }

    return messages[messages.length - 1].content;
  };

  return (
    <Spin spinning={isLoading || isFetching}>
      <List
        className={styles.listContainer}
        dataSource={friends}
        renderItem={(item: any) => (
          <List.Item
            key={item.user._id}
            className={styles.friendItem}
            onClick={() => {
              setReceiverName(
                () => item.user.firstName + " " + item.user.lastName
              );
              handleClick(item.user._id);
            }}
          >
            {/* Show only the avatar when screen size is small */}
            <div className={styles.avatarContainer}>
              <List.Item.Meta
                avatar={<Avatar size={30} src={item.user.avatar?.url} />}
              />
            </div>

            {/* Show the name and last message when screen size is large */}
            <div className={styles.detailsContainer}>
              <List.Item.Meta
                avatar={<Avatar size={40} src={item.user.avatar?.url} />}
                title={item.user.firstName + " " + item.user.lastName}
                description={getLastMessage(item.user._id)}
              />
            </div>
          </List.Item>
        )}
      />

      <ChatModal
        open={open}
        onClose={onClose}
        userId={userData?._id}
        receiverName={receiverName}
      />
    </Spin>
  );
};

export default FriendList;
