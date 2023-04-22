import { Avatar, Button, Col, Divider, Row, Tabs, TabsProps, Tooltip, Typography, message } from 'antd';
import React, { useState } from 'react'
import { useUser } from '~/hooks/useUser';
import { UserOutlined } from '@ant-design/icons';
import Spin from '~/components/atoms/Spin';
import styles from './styles.module.scss'
import { addFriend } from '~/api/friend';
import { SUCCESS } from '~/utils/constant';
import {UserDeleteOutlined} from '@ant-design/icons'
import { RootState, useAppDispatch, useAppSelector } from '~/store';
import Infomations from './Infomations';
import Friends from './Friends';
import ChatModal from '~/components/atoms/ChatModal';
import Post from './Post';
import { setMessages, setReceiver } from '~/store/chatMessages';
import { getMessages } from '~/api/user';
interface Props{
  userId: any;
}

const Profile = (props: Props) => {
  const {userId} = props;
  
  const {data: receiver} = useUser(userId);
  const receiverName = receiver?.data?.firstName + " " + receiver?.data?.lastName;

  const { data, isLoading, isFetching } = useUser(userId);
  const userData = data?.data;
  const [adding, setAdding] = useState(false);
  const me = useAppSelector((state) => state.userInfo.userData);
  const [openChat, setOpenChat] = useState(false);

  const handleAddFriend = async () => {
    setAdding(true)
    const res = await addFriend(userId);
    if (res.message === SUCCESS) {
      message.success('Add friend success')
    } else {
      message.error(res.message)
    }
    setAdding(false);
  }

  const onCloseChat = () => {
    setOpenChat(false);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `Post`,
      children: <Post data={userData}/>,
    },
    {
      key: '2',
      label: `Infomation`,
      children: <Infomations data={userData}/>,
    },
    {
      key: '3',
      label: `Friend`,
      children: <Friends data={userData}/>,
    }
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
  return (
    <Spin spinning={isLoading || isFetching}>
      <div className={styles.profileContainer}>
        <div className={styles.avatarContainer}>
          <Avatar size={120} src={userData?.avatar} icon={<UserOutlined />} />
          <div className={styles.infoGroup}>
            <Typography.Title 
              level={3}
              style={{marginBottom: 0}}
            >
              {userData?.firstName} {userData?.lastName}
            </Typography.Title>
            <p>{userData?.role}</p>
            <Avatar.Group>
              { 
                userData?.followers?.map((item: any) => (
                  <Tooltip 
                    key={item.user._id}
                    title={`${item.user.firstName} ${item.user.lastName}`} 
                    placement="bottom"
                  >
                    <Avatar src="https://joesch.moe/api/v1/random?key=1" />
                  </Tooltip>
                ))
              }
            </Avatar.Group>
          </div>
        </div>
        <div className={styles.btnGroup}>
          { me && me?.following?.find((item: any) => (item.user._id === userId)) ? 
            <Button icon={<UserDeleteOutlined />}>Friend</Button>
            : me?._id !== userId &&
            <Button disabled={adding} type="primary" onClick={handleAddFriend}>Add Friend</Button>
          }
          { me && me?._id !== userId &&
            <Button 
              type='primary' 
              className='ml-2' 
              onClick={() => handleClick(userId)}
            >
              Chat now
            </Button>
          }
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
    </Spin>

  );
}

export default Profile