import React, { useLayoutEffect } from 'react';
import { Button, Form, Modal, message } from 'antd';
import Input, { TextArea } from '~/components/atoms/Input';
import { createCategory, updateCategory } from '~/api/categories';
import { SUCCESS } from '~/utils/constant';

import styles from './styles.module.scss'
interface Props {
  visible?: boolean;
  setVisible: React.Dispatch<boolean>;
  category?: any;
  refetch: () => void;
  setCategory?: React.Dispatch<any>;
}

const CategoryModal = (props: Props) => {
  const [form] = Form.useForm();
  const {
    visible,
    setVisible,
    category,
    refetch,
    setCategory
  } = props;

  const handleClose = () => {
    if (setVisible) {
      setVisible(false);
      if (!category) {
        form.resetFields();
      }
      if (setCategory) {
        setCategory({})
      }
    }
  };

  useLayoutEffect(() => {
    if (category) {
      form?.setFieldsValue({
        name: category.name,
        note: category.note
      });
    }
  }, [category]);

  const handleSave = async (formValues: any) => {
    try {
      let res: any = null;
      if (category) {
        res = await updateCategory(category._id,formValues)
      } else {
        res = await createCategory(formValues)
      }
      if (res.message === SUCCESS) {
        message.success(!category ? 'Add category success' : 'Update category success')
        setVisible(false);
        form.resetFields()
        refetch()
      } else {
        message.error(res.message)
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
      <h3>{category ? 'Edit category' : 'Add category'}</h3>
    </div>
    <Form
      form={form}
      layout='vertical'
      onFinish={handleSave}
      // onValuesChange={() => checkIsEdit()}
      autoComplete="off"
      className={styles.formContainer}
    >
      <Form.Item label='Name' name='name'>
        <Input
          maxLength={50}
          placeholder='Name'
        />
      </Form.Item>
      <Form.Item label='Note' name='note'>
        <TextArea
          maxLength={300}
          placeholder='Note'
        />
      </Form.Item>
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
    </Modal>
  )
}

export default CategoryModal