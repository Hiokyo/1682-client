import { List, Avatar, Drawer } from 'antd';
import React, { useState } from 'react'
import styles from './styles.module.scss'
import { PARAMS_GET_ALL } from '~/utils/constant';
import { useFriends } from '~/hooks/useFriends';
import { useAppSelector } from '~/store';
import Spin from '~/components/atoms/Spin';
import { TextArea } from '~/components/atoms/Input';
import ChatModal from '~/components/atoms/ChatModal';

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

  return (
    <Spin spinning={isLoading || isFetching}>
      <List
        className={styles.listContainer}
        dataSource={friends}
        renderItem={(item: any) => (
          <>
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
            <ChatModal
              open={open}
              onClose={onClose}
              userId={item.user._id}
            />
          </>
        )}
      />
    </Spin>
  );
}

export default FriendList