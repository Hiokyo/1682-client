import {
  Avatar,
  Button,
  Col,
  Divider,
  Row,
  Tabs,
  TabsProps,
  Tooltip,
  Typography,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useUser } from "~/hooks/useUser";
import { UserOutlined, WarningOutlined } from "@ant-design/icons";
import Spin from "~/components/atoms/Spin";
import styles from "./styles.module.scss";
import { addFriend } from "~/api/friend";
import { SUCCESS, UserRole } from "~/utils/constant";
import { UserDeleteOutlined } from "@ant-design/icons";
import { RootState, useAppDispatch, useAppSelector } from "~/store";
import Infomations from "./Infomations";
import Friends from "./Friends";
import ChatModal from "~/components/atoms/ChatModal";
import Post from "./Post";
import { setMessages, setReceiver } from "~/store/chatMessages";
import { getMessages, warningUser } from "~/api/user";
import ModalConfirm from "~/components/atoms/ModalConfirm";
import Input from "~/components/atoms/Input";
import { Authorization } from "~/wrapper/Authorization";
import { useNavigate } from "react-router-dom";
interface Props {
  userId: any;
}

const Profile = (props: Props) => {
  const navigate = useNavigate();
  const { userId } = props;

  const { data: receiver } = useUser(userId);
  const receiverName =
    receiver?.data?.firstName + " " + receiver?.data?.lastName;

  const { data, isLoading, isFetching } = useUser(userId);
  const userData = data?.data;
  const [adding, setAdding] = useState(false);
  const me = useAppSelector((state) => state.userInfo.userData);
  const [openChat, setOpenChat] = useState(false);
  const [visibleModalConfirm, setVisibleModalConfirm] = useState(false);
  const [messageWarn, setMessagesWarn] = useState("");
  const handleAddFriend = async () => {
    setAdding(true);
    const res = await addFriend(userId);
    if (res.message === SUCCESS) {
      message.success("Add friend success");
    } else {
      message.error(res.message);
    }
    setAdding(false);
  };

  const onCloseChat = () => {
    setOpenChat(false);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Post`,
      children: <Post data={userData} />,
    },
    {
      key: "2",
      label: `Infomation`,
      children: <Infomations data={userData} />,
    },
    {
      key: "3",
      label: `Friend`,
      children: <Friends data={userData} />,
    },
  ];

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
        setOpenChat(true);
      } else {
        dispatch(setMessages([]));
        dispatch(setReceiver(""));
        message.error(res.message);
      }
    } catch (error) {
      message.error(String(error));
    }
  };

  const handleWarning = async () => {
    if (!messageWarn) return message.error("Please enter message");
    const res = await warningUser(userId, { message: messageWarn });
    if (res.message === SUCCESS) {
      message.success("Warning success");
      setVisibleModalConfirm(false);
    } else {
      message.error(res.message);
    }
  };

  useEffect(() => {
    if (!userData) {
      message.error("User not existed");
      navigate("/");
    }
  }, [userData]);

  return (
    <Spin spinning={isLoading || isFetching}>
      <div className={styles.profileContainer}>
        <div className={styles.avatarContainer}>
          <Avatar
            size={120}
            src={userData?.avatar?.url}
            icon={<UserOutlined />}
          />
          <div className={styles.infoGroup}>
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              {userData?.firstName} {userData?.lastName}
              <Authorization roles={[UserRole.Admin]}>
                <WarningOutlined
                  style={{ fontSize: 24, marginLeft: 5, color: "red" }}
                  onClick={() => setVisibleModalConfirm(true)}
                />
              </Authorization>
            </Typography.Title>
            <p>{userData?.role}</p>
            <Avatar.Group>
              {userData?.followers?.map((item: any) => (
                <Tooltip
                  key={item.user._id}
                  title={`${item.user.firstName} ${item.user.lastName}`}
                  placement="bottom"
                >
                  <Avatar src={item.user?.avatar?.url} />
                </Tooltip>
              ))}
            </Avatar.Group>
          </div>
        </div>
        <div className={styles.btnGroup}>
          {me &&
          me?.following?.find((item: any) => item.user._id === userId) ? (
            <Button icon={<UserDeleteOutlined />}>Friend</Button>
          ) : (
            me?._id !== userId && (
              <Button
                disabled={adding}
                type="primary"
                onClick={handleAddFriend}
              >
                Add Friend
              </Button>
            )
          )}
          {me && me?._id !== userId && (
            <Button
              type="primary"
              className="ml-2"
              onClick={() => handleClick(userId)}
            >
              Chat now
            </Button>
          )}
        </div>
      </div>
      <Divider />
      <Tabs defaultActiveKey="1" items={items} />
      <Divider />

      <ChatModal
        open={openChat}
        onClose={onCloseChat}
        userId={userId}
        receiverName={receiverName}
      />

      <ModalConfirm
        visible={visibleModalConfirm}
        title="Are you sure to warning this user?"
        onCancel={() => setVisibleModalConfirm(false)}
        onOk={handleWarning}
      >
        <Input
          onChange={(e: any) => setMessagesWarn(e.target.value)}
          onPressEnter={handleWarning}
        />
      </ModalConfirm>
    </Spin>
  );
};

export default Profile;
