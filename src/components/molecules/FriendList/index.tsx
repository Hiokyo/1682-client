import { List, Avatar, Drawer } from 'antd';
import React, { useState } from 'react'
import styles from './styles.module.scss'
import { PARAMS_GET_ALL } from '~/utils/constant';
import { useFriends } from '~/hooks/useFriends';
import { useAppSelector } from '~/store';
import Spin from '~/components/atoms/Spin';

const FriendList = () => {
  const userData = useAppSelector((state) => state.userInfo.userData);

  const [open, setOpen] = useState(false);
  const {data, isLoading, isFetching} = useFriends({
    page: 1,
    limit: 999,
    userId: userData?._id
  })

  const friends = data?.data?.following;
  const onClose = () => {
    setOpen(false);
  };

  const messages = [
    { id: 1, user: {id: 1, name: 'Quan'}, content: 'Hello' },
    { id: 2, user: {id: 2, name: 'Hieu'}, content: 'How are you?' },
    { id: 3, user: {id: 1, name: 'Quan'}, content: 'I am fine' },
  ];
  return (
    <Spin spinning={isLoading || isFetching}>
      <List
        className={styles.listContainer}
        dataSource={friends}
        renderItem={(item: any) => (
          <List.Item 
            key={item.user._id}
            className={styles.friendItem}
            onClick={() => setOpen(true)}
          >
            <List.Item.Meta
              avatar={<Avatar size={40} src={item.user.avatar} />}
              title={
                <div>
                  {item.user.firstName} {item.user.lastName}
                </div>
              }
              description={item.isOnline ? 'Online' : 'Offline'}
            />
          </List.Item>
        )}
      />
      <Drawer
        title='Chat'
        placement="right"
        onClose={onClose}
        className={styles.modalChat}
        open={open}
        // style={{width: '200px'}}
        // extra={
        //   <Space>
        //     <Button onClick={onClose}>Cancel</Button>
        //     <Button type="primary" onClick={onClose}>
        //       OK
        //     </Button>
        //   </Space>
        // }
      >
        <List
          dataSource={messages}
          className={styles.listChat}
          renderItem={(item) => (
            <List.Item
              className={item.user.id === 1 ? styles.sender : styles.receiver}
              key={item.id}
            >
              {item.content}
            </List.Item>
          )}
        />
      </Drawer>
    </Spin>
  );
}

export default FriendList