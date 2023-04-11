import { Avatar, Button, Form, Upload, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { TextArea } from '~/components/atoms/Input'
import Modal from '~/components/atoms/Modal'
import styles from './styles.module.scss'
import { InboxOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta'
import { useAppSelector } from '~/store'
import { setPost, updatePost } from '~/api/post'
import { KEY_MESSAGE, SUCCESS } from '~/utils/constant'
import { Option } from '~/components/atoms/Select';
import { ref, getDownloadURL, uploadBytesResumable, getMetadata } from "firebase/storage";
import storage from '~/utils/firebase';

import Select from '~/components/atoms/Select'
import { RcFile, UploadFile } from 'antd/es/upload'

interface Props {
  postData?: any;
  visible?: boolean;
  setVisible: React.Dispatch<boolean>;
  afterSuccess?: () => void;
}

const ModalPost = (props: Props) => {
  const [form] = Form.useForm();
  const { Dragger } = Upload;
  const {visible, setVisible, afterSuccess, postData} = props;
  const userData = useAppSelector((state) => state.userInfo.userData);
  const rules = [{ required: true, message: '' }];
  
  const [metadataList, setMetadataList] = useState<any>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<any>();

  const uploadFileToFirebase = async (file: any, onSuccess: any, onError: any, onProgress: any) => {
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress({ percent: progress.toFixed(2) });
      },
      (error) => {
        onError(error);
      },
      async () => {
        const snapshot = await uploadTask;
        const metadata = await getMetadata(storageRef);
        const result = {
          name: metadata.name,
          contentType: metadata.contentType,
          url: await getDownloadURL(snapshot.ref)
        };
        setMetadataList((prevState: any) => [...prevState, result]);
        onSuccess(result);
      }
    );
  };

  const handleSave = async (formValues: any) => {
    try {
      let res: any = null;
      const {document, ...rest} = formValues;
      const fmData = {
        ...rest,
        isAnonymous: isAnonymous,
        images: metadataList
      }
      if (postData) {
        res = await updatePost(postData._id, fmData)
      } else {
        res = await setPost(fmData)
      }
      if (res.message === SUCCESS) {
        message.success({
          content: postData ? 'Update post success' : 'Add post success'
        })
        if (afterSuccess) {
          afterSuccess()
        }
        form.resetFields();
        setVisible(false)
      } else {
        message.error(res.error)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = (value: any) => {
    if (value === 'Anonymous') {
      setIsAnonymous(true);
    } else {
      setIsAnonymous(false);
    }
  }

  const handleClose = () => {
    setVisible(false);
    if (!postData) {
      form.resetFields()
    }
  }
  const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleCancel = () => setPreviewOpen(false);
  useEffect(() => {
    if (postData) {
      form.setFieldsValue({
        content: postData.content
      })
      setFileList(postData.images)
    }
  }, [postData])
  
  return (
    <Modal
      width={560}
      centered
      open={visible}
      footer={false}
      closable={false}
      onCancel={handleClose}
      maskClosable
      className={styles.modalContainer}
    >
    <div>
      <h3>Create your post</h3>
    </div>
    <Meta
      className={styles.metaUser}
      avatar={<Avatar size={54} src={'https://joesch.moe/api/v1/random'}/>}
      title={
        <div className={styles.titleGroup}>
          <strong>{userData?.firstName} {userData?.lastName}</strong>
          <Select
            defaultValue={'Public'}
            size='small'
            onChange={handleChange}
          >
            <Option key={'1'} value={'Public'}>Public</Option>
            <Option key={'2'} value={'Anonymous'}>Anonymous</Option>
          </Select>
        </div>
        
      }
    />
    <Form
      form={form}
      layout='vertical'
      onFinish={handleSave}
      autoComplete="off"
      className={styles.formContainer}
    >
      <Form.Item 
        name='content'
        rules={rules}
      >
        <TextArea
          maxLength={300}
          placeholder={`What's on your mind?`}
        />
      </Form.Item>
      <div className={styles.uploadBtn}>
        <Dragger
          multiple={true}
          customRequest={({ file, onSuccess, onError, onProgress }) => uploadFileToFirebase(file, onSuccess, onError, onProgress)}
          listType="picture-card"
          onPreview={handlePreview}
          fileList={fileList}
          onChange={(info) => {
            const { status } = info.file;
            // if (status !== "uploading") {
            //   console.log(info.fileList);
            // }
            if (status === "done") {
              message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === "error") {
              message.error(`${info.file.name} file upload failed.`);
            } else if (status === "removed") {
              const result = info.fileList?.map((item: any) => (
                {
                  name: item.name,
                  contentType: item.contentType,
                  url: item.url
                }
              ))
              setMetadataList(result);;
            }
            // Save file list in state
            const fileList = [...info.fileList];
            setFileList(fileList);
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to image</p>
        </Dragger>
      </div>
      <div className={styles.btnGroup}>
        <Button
          className={styles.btnPost}
          type={'primary'}
          htmlType='submit'
        >
          Post
        </Button>                
      </div>
    </Form>
    <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
      <img alt="preview" style={{ width: '100%' }} src={previewImage} />
    </Modal>
    </Modal>
  )
}

export default ModalPost