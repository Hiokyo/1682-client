import React, { useState } from 'react';
import { Avatar, Button, Descriptions, Divider, Upload, message } from 'antd';
import { useUser } from '~/hooks/useUser';
import { format } from 'date-fns';
import { DATE, SUCCESS, Status, UserStatus, userIcon } from '~/utils/constant';
import {
  UserOutlined
} from '@ant-design/icons'
import { RcFile } from 'antd/es/upload';
import { setAvatar } from '~/api/user';

import iconEdit from '~/assets/images/iconEdit.svg';
import Svg from '~/components/atoms/Svg';
import loadable from '~/utils/loadable';
import styles from './styles.module.scss';
import { getCookie } from '~/utils/cookie';

const ProfileModal = loadable(() => import('~/components/molecules/ViewProfile/ModalEditProfile'));
const Spin = loadable(() => import('~/components/atoms/Spin'));

const ViewProfile = () => {
  const userId = getCookie('userId')
  const { data, isLoading, isFetching, refetch } = useUser(userId)
  const userData = data?.data;
  const [ isModalVisible, setIsModalVisible ] = useState(false);
  const status: Status['value'] = userData?.status;

  const beforeUpload = (file: RcFile): boolean => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  const handleImageUpload = async (file: any) => {
    try {
      if (!(file?.file instanceof Blob)) {
        throw new Error('Invalid file type');
      }
      const reader = new FileReader();
      reader.readAsDataURL(file.file);
      reader.onload = async () => {
        const base64String = reader.result;
        const response = await setAvatar(userData?._id, { img: base64String });
        if (response.message === SUCCESS) {
          refetch()
        }
      };
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div>
      <div className={styles.mainContainer}>
        <Spin spinning={isLoading || isFetching}>
        <div className={styles.profile}>
          <div className={styles.editInfo}>
            <Button
              onClick={() => setIsModalVisible(true)}
            >
              <Svg src={iconEdit}/>
            </Button>
          </div>
          <div className={styles.avatarContainer}>
            <Upload
              name="avatar"
              listType="picture-circle"
              className="avatar-uploader"
              showUploadList={false}
              accept="image/*"
              beforeUpload={beforeUpload}
              customRequest={(file: any ) => handleImageUpload(file)}
            >
              {userData?.avatar ? (
                <Avatar 
                  size={100}
                  src={userData?.avatar}
                  
                />
              ) : (
                <Avatar 
                  size={100}
                  icon={<UserOutlined />}
                />
              )}
            </Upload>
            <div className='mt-2 text-center'>
              {userData?.firstName} &nbsp; {userData?.lastName}
            </div>
          </div>
          <Divider/>
          <Descriptions
            className={styles.info}
            column={{xl: 3, sm: 2,  xs: 1}}
          >
            <Descriptions.Item label="Role">{userData?.role}</Descriptions.Item>
            <Descriptions.Item label="Telephone">{userData?.phoneNumber}</Descriptions.Item>
            <Descriptions.Item label="Email">{userData?.email}</Descriptions.Item>
            <Descriptions.Item label="Gender">{userData?.gender}</Descriptions.Item>
            <Descriptions.Item label="Birthday">
              {userData?.dob && format(new Date(userData.dob), DATE)}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {userData?.address || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {userData?.status}
              <Svg
                className='ml-2'
                src={userIcon[UserStatus[status] ?? -1]}
                alt="status"
              />
            </Descriptions.Item>
          </Descriptions>
        </div>
        </Spin>
      </div>
      <ProfileModal
        visible={isModalVisible}
        userData={userData}
        setVisible={setIsModalVisible}
        afterSuccess={refetch}
      />
    </div>
  )
}

export default ViewProfile