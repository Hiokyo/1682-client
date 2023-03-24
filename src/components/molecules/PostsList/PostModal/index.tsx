import { Avatar, Button, Form, Upload, message } from 'antd'
import React from 'react'
import { TextArea } from '~/components/atoms/Input'
import Modal from '~/components/atoms/Modal'
import styles from './styles.module.scss'
import { InboxOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta'
import { useAppSelector } from '~/store'
import { setPost } from '~/api/post'
import { SUCCESS } from '~/utils/constant'

interface Props {
  visible?: boolean;
  setVisible: React.Dispatch<boolean>;
  afterSuccess?: () => void;
}

const ModalPost = (props: Props) => {
  const [form] = Form.useForm();
  const { Dragger } = Upload;
  const {visible, setVisible, afterSuccess} = props;
  const userData = useAppSelector((state) => state.userInfo.userData);
  const rules = [{ required: true, message: '' }];


  const handleSave = async (formValues: any) => {
    try {
      let res: any = null;
      const {document, ...rest} = formValues;
      const fmData = {
        ...rest,
        images: []
      }
      res = await setPost(fmData)
      if (res.message === SUCCESS) {
        message.success('Create post success')
        if (afterSuccess) {
          afterSuccess()
        }
        setVisible(false)
      } else {
        message.error(res.error)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Modal
      width={460}
      centered
      open={visible}
      footer={false}
      closable={false}
      onCancel={() => setVisible(false)}
      maskClosable
      className={styles.modalContainer}
    >
    <div>
      <h3>Create your post</h3>
    </div>
    <Meta
      className={styles.metaUser}
      avatar={<Avatar size={42} src={'https://joesch.moe/api/v1/random'}/>}
      title={
        <div className='ml-2'>
          <strong>{userData?.firstName} {userData?.lastName}</strong>
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
        name='title'
        rules={rules}
      >
        <TextArea
          maxLength={300}
          placeholder={`What's on your mind?`}
        />
      </Form.Item>
      <div className={styles.uploadBtn}>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from uploading company data or other
          banned files.
        </p>
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
    </Modal>
  )
}

export default ModalPost