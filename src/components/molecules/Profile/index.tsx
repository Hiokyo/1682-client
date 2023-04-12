import { Avatar, Button, Col, Divider, Row, Tooltip, Typography, message } from 'antd';
import React, { useState } from 'react'
import { useUser } from '~/hooks/useUser';
import { UserOutlined } from '@ant-design/icons';
import Spin from '~/components/atoms/Spin';
import styles from './styles.module.scss'
import { addFriend } from '~/api/friend';
import { SUCCESS } from '~/utils/constant';
interface Props{
  userId: any;
}

const Profile = (props: Props) => {
  const {userId} = props;
  const {data, isLoading, isFetching} = useUser(userId);
  const userData = data?.data;
  const [adding, setAdding] = useState(false)

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
          <Button disabled={adding} type="primary" onClick={handleAddFriend}>Add Friend</Button>
          <Button className='ml-2' >Chat now</Button>
        </div>
      </div>
      <Divider />
      <Row gutter={[16, 16]}>
        <Col>
          <Typography.Text strong>Address:</Typography.Text>
          <Typography.Text>{userData?.address}</Typography.Text>
        </Col>
        <Col>
          <Typography.Text strong>Date of Birth:</Typography.Text>
          <Typography.Text>{userData?.dob}</Typography.Text>
        </Col>
        <Col>
          <Typography.Text strong>Gender:</Typography.Text>
          <Typography.Text>{userData?.gender}</Typography.Text>
        </Col>
      </Row>
    </Spin>

  );
}

export default Profile