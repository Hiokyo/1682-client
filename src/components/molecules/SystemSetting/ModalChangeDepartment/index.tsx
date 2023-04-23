import React from 'react';
import { Button, Form, Modal, message } from 'antd';
import { Option } from '~/components/atoms/Select';
import { changeDepartment } from '~/api/user';
import { useDepartment } from '~/hooks/useDepartment';
import { PARAMS_GET_ALL, SUCCESS } from '~/utils/constant';

import iconWarning from '~/assets/images/warning.svg';
import Svg from '~/components/atoms/Svg';
import loadable from '~/utils/loadable';

import styles from './styles.module.scss'

const Select = loadable(() => import('~/components/atoms/Select'));

interface Props {
  visible: boolean;
  setVisible: (value: boolean) =>void;
  refetch: () => void;
  user: any;
  setRecord: (value: any) => void;
}

const ModalChangeDepartment = (props: Props) => {
  const {visible, setVisible, refetch, user, setRecord} = props;
  const [form] = Form.useForm();
  // const {data, isLoading, isFetching} = useDepartment(PARAMS_GET_ALL);
  const dataDepartment: any = [];
  const handleCancel = () => {
    setVisible(false)
    setRecord({})
    form.resetFields()
  }
 
  const handleChangeDepartment = async (formValues: any) => {
    let res: any = null;
    if (user && formValues) {
      res = await changeDepartment(user._id, formValues)
      if (res.message === SUCCESS) {
        message.success('Change user Department success')
        setVisible(false)
        refetch()
      } else {
        message.error(res.message)
      }
    } 
  }
  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      footer={false}
      maskClosable={false}
      centered
    >
      <div className={styles.headerConfirm}>
        <Svg className={styles.iconWarning} src={iconWarning} alt="icon warning" />
        <span className={styles.title}>{user.firstName} {user.lastName}</span>
      </div>
      <Form
        className={styles.formContainer}
        form={form}
        onFinish={handleChangeDepartment}
        layout='vertical'
      >
        <Form.Item
          label='Department'
          name='departmentId'
          rules={[
            {
              required: true,
              message: ''
            }
          ]}
        >
          <Select
            placeholder='Select Department'
            // loading={isLoading || isFetching}
          >
            {dataDepartment?.map((item: any) =>
              <Option key={item._id} value={item._value}>{item.name}</Option>
            )}
          </Select>
        </Form.Item>
        <div className={styles.btnGroup}>
          <Button
            className={styles.btnClose}
            onClick={handleCancel}
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

export default ModalChangeDepartment