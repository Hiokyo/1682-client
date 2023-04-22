import { Avatar, Card, List } from 'antd';
import React from 'react'
import Svg from '~/components/atoms/Svg';
import styles from './styles.module.scss'

interface Props{
  data: any;
}

const Friends = (props: Props) => {
  const {data} = props;
  const friendData = data?.following
  return (
    <List
      grid={{ gutter: 16, column: 3 }}
      dataSource={friendData}
      renderItem={(friend: any) => (
        <List.Item
          key={friend.user?._id}
        >
          <Card className={styles.friend}>
            <Avatar 
              src={`https://joesch.moe/api/v1/random`}
              shape="square"
              size={46}
            />
            <Card.Meta 
              title={
                <div>
                  {friend.user?.firstName} {friend.user?.lastName}
                </div>
              } 
            />
          </Card>
        </List.Item>
      )}
    />
  )
}

export default Friends