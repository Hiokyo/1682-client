import React, { useMemo, useState } from 'react';
import { Button, Checkbox, Form, Switch, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { ref, getDownloadURL, uploadBytesResumable, getMetadata } from "firebase/storage";
import { Option } from '~/components/atoms/Select';
import { KEY_MESSAGE, SUCCESS, termAndCondition } from '~/utils/constant';
import { createBook } from '~/api/book';
import { useCategories } from '~/hooks/useCategory';
import { useThread } from '~/hooks/useThread';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

import storage from '~/utils/firebase';
import loadable from '~/utils/loadable';
import styles from './styles.module.scss'

const Select = loadable(() => import('~/components/atoms/Select'));
const Input = loadable(() => import('~/components/atoms/Input'));
const Modal = loadable(() => import('~/components/atoms/Modal'));


interface Props {
  visible?: boolean;
  setVisible: React.Dispatch<boolean>;
  afterSuccess?: () => void;
}

const ModalIdeas = (props: Props) => {
  const [form] = Form.useForm();
  const {
    visible,
    setVisible,
    afterSuccess,
  } = props;

  const [metaData, setMetaData] = useState({});
  const rules = [{ required: true, message: '' }];
  const [showModalTerms, setShowModalTerms] = useState(false)
  const [agreeTerm, setAgreeTerm] = useState(false)

  const handleClose = () => {
    if (setVisible) {
      setVisible(false);
    }
  };

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
      setMetaData(result);
  
    } catch (error: any) {
      message.error({
        content: error,
        key: KEY_MESSAGE
      });
    }
  };

  const onCheckBoxChange = (e: CheckboxChangeEvent) => {
    setAgreeTerm(e.target.checked)
  };

  const handleSave = async (formValues: any) => {
    if (Object.keys(metaData).length === 0) {
      return message.error('Please upload your document')
    }
    if (!agreeTerm) {
      return message.warning(`You haven't agreed to the terms and conditions yet`)
    }
    try {
      let res: any = null;
      const {document, isAnonymous, ...rest} = formValues;
      const fmData = {
        isAnonymous: isAnonymous ? isAnonymous : false,
        ...rest,
        documents: [metaData]
      }
      res = await createBook(fmData)
      if (res.message === SUCCESS) {
        message.success('Upload idea success')
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
      className={styles.modalContainer}
    >
    <div>
      <h3>Add new book</h3>
    </div>
    <Form
      form={form}
      layout='vertical'
      onFinish={handleSave}
      autoComplete="off"
      className={styles.formContainer}
    >
      <Form.Item 
        label='Title'
        name='title'
        rules={rules}
      >
        <Input
          maxLength={50}
          placeholder='Title'
        />
      </Form.Item>
      <Form.Item 
        label='Description'
        name='description'
        rules={rules}
      >
        <Input
          maxLength={50}
          placeholder='Description'
        />
      </Form.Item>
      <div className={styles.uploadBtn}>
        <Upload
          onChange={(info) => info.file.status = 'done'}
          customRequest={(file: any ) => uploadFileToFirebase(file)}
        >
          <Button icon={<UploadOutlined />}>Upload Ideas</Button>
        </Upload>
      </div>
      <Form.Item
        label='Categoty'
        name='category'
        rules={rules}
      >
        <Select
          mode='multiple'
          placeholder={'Select category'}
          // loading={loadingCategories || fetchingCategories}
        >
          {/* {categoryOption?.map((item: any) =>
            <Option key={item.id} value={item.id}>{item.name}</Option>
          )} */}
        </Select>
      </Form.Item>
      <Form.Item
        label='Campaign'
        name='thread'
        rules={rules}
      >
        <Select
          placeholder={'Select campaign'}
          // loading={loadingThread || fetchingThread}
        >
          {/* {threadOption?.map((item: any) =>
            <Option key={item.id} value={item.id}>{item.name}</Option>
          )} */}
        </Select>
      </Form.Item>

      <Form.Item
        name='isAnonymous'
        label='Anonymous'
        valuePropName='checked'
      >
        <Switch
        />
      </Form.Item>

      <div className={styles.checkbox}>
        <Checkbox
          onChange={onCheckBoxChange}
        >
          Agree terms and conditions
        </Checkbox>
        <a
          onClick={() => setShowModalTerms(true)}
        >
          Read here
        </a>
      </div>
      <div className={styles.btnGroup}>
        <Button
          className={styles.btnClose}
          onClick={handleClose}
        >
          Close
        </Button>
        <Button
          type={'primary'}
          htmlType='submit'
        >
          Save
        </Button>                
      </div>
    </Form>
    <Modal
      open={showModalTerms}
      centered
      footer={false}
      closable
      onCancel={() => setShowModalTerms(false)}
      className={styles.modalTerm}
    >
      <div>
        <p className='m-0'>{termAndCondition}</p>
      </div>
    </Modal>
    </Modal>
  )
}

export default ModalIdeas