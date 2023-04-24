import React, { useState } from "react";
import {
  Avatar,
  Button,
  Divider,
  Tabs,
  TabsProps,
  Tooltip,
  Typography,
  Upload,
  message,
} from "antd";
import { useUser } from "~/hooks/useUser";
import { SUCCESS } from "~/utils/constant";
import { UserOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { setAvatar } from "~/api/user";

import loadable from "~/utils/loadable";
import styles from "./styles.module.scss";
import { getCookie } from "~/utils/cookie";
import Post from "../Profile/Post";
import Infomations from "../Profile/Infomations";
import Friends from "../Profile/Friends";
import { ref, getDownloadURL, uploadBytesResumable, getMetadata } from "firebase/storage";
import storage from '~/utils/firebase';

const ProfileModal = loadable(
  () => import("~/components/molecules/ViewProfile/ModalEditProfile")
);
const Spin = loadable(() => import("~/components/atoms/Spin"));

const ViewProfile = () => {
  const userId = getCookie("userId");
  const { data, isLoading, isFetching, refetch } = useUser(userId);
  const userData = data?.data;
  const [isModalVisible, setIsModalVisible] = useState(false);

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
  // const handleImageUpload = async (file: any) => {
  //   try {
  //     if (!(file?.file instanceof Blob)) {
  //       throw new Error("Invalid file type");
  //     }
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file.file);
  //     reader.onload = async () => {
  //       const base64String = reader.result;
  //       const response = await setAvatar(userData?._id, { img: base64String });
  //       if (response.message === SUCCESS) {
  //         refetch();
  //       }
  //     };
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const uploadFileToFirebase = async (doc: any) => {
    const file = doc?.file;
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    try {
      // Wait for the upload to finish
      const snapshot = await uploadTask;
      
      // Get the metadata using getMetadata() method
      const metadata = await getMetadata(storageRef);
  
      // Create the result object with metadata and download URL
      const result = {
        name: metadata.name,
        contentType: metadata.contentType,
        url: await getDownloadURL(snapshot.ref)
      };
      // Set the result in the state
      // setMetaData(result);
      const res = await setAvatar(result);
      if (res.message === SUCCESS) {
        refetch();
      } else {
        message.error("Upload image failed");
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <Spin spinning={isLoading || isFetching}>
      <div className={styles.profileContainer}>
        <div className={styles.avatarContainer}>
          <Upload
            name="avatar"
            listType="picture-circle"
            showUploadList={false}
            accept="image/*"
            beforeUpload={beforeUpload}
            customRequest={(file: any) => uploadFileToFirebase(file)}
          >
            {userData?.avatar?.url ? (
              <Avatar size={120} src={userData?.avatar?.url} />
            ) : (
              <Avatar size={120} icon={<UserOutlined />} />
            )}
          </Upload>

          <div className={styles.infoGroup}>
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              {userData?.firstName} {userData?.lastName}
            </Typography.Title>

            <p>{userData?.role}</p>

            <Avatar.Group>
              {userData?.following?.map((item: any) => (
                <Tooltip
                  key={item.user._id}
                  title={`${item.user.firstName} ${item.user.lastName}`}
                  placement="bottom"
                >
                  <Avatar src="https://joesch.moe/api/v1/random?key=1" />
                </Tooltip>
              ))}
            </Avatar.Group>
          </div>
        </div>

        <div className={styles.btnGroup}>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Edit infomation
          </Button>
        </div>
      </div>

      <Divider />

      <Tabs defaultActiveKey="1" items={items} />

      <Divider />

      <ProfileModal
        visible={isModalVisible}
        userData={userData}
        setVisible={setIsModalVisible}
        afterSuccess={refetch}
      />
    </Spin>
  );
};

export default ViewProfile;
