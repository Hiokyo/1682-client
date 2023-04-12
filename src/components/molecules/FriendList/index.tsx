import { List, Avatar } from 'antd';
import React from 'react'
import styles from './styles.module.scss'
import { PARAMS_GET_ALL } from '~/utils/constant';
import { useFriends } from '~/hooks/useFriends';
import { useAppSelector } from '~/store';
import Spin from '~/components/atoms/Spin';

const FriendList = () => {
  const userData = useAppSelector((state) => state.userInfo.userData);

  const {data, isLoading, isFetching} = useFriends({
    page: 1,
    limit: 999,
    userId: userData?._id
  })

  const friends = data?.data?.following;
  return (
    <Spin spinning={isLoading || isFetching}>
      <List
        className={styles.listContainer}
        dataSource={friends}
        renderItem={(item: any) => (
          <List.Item key={item.user._id}>
            <List.Item.Meta
              avatar={<Avatar size={36} src={item.user.avatar} />}
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
    </Spin>
  );
}

export default FriendList