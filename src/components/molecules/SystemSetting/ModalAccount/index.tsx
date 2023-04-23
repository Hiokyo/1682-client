import React, { useLayoutEffect, useMemo } from 'react';
import { Button, Form, Modal, message } from 'antd';
import loadable from '~/utils/loadable';

import { DATE, Gender, PARAMS_GET_ALL, Role, SUCCESS } from '~/utils/constant';
import { Option } from '~/components/atoms/Select';
import { updateUserInfo } from '~/api/user';
import {format} from 'date-fns'
import { createAccount } from '~/api/account';
import { useDepartment } from '~/hooks/useFavoriteBook';

import styles from './styles.module.scss'

const Input = loadable(() => import('~/components/atoms/Input'));
const InputNumber = loadable(() => import('~/components/atoms/InputNumber'));
const Select = loadable(() => import('~/components/atoms/Select'));
const DatePicker = loadable(() => import('~/components/atoms/DatePicker'));


interface Props {
  visible?: boolean;
  setVisible: React.Dispatch<boolean>;
  userData?: any;
  afterSuccess?: () => void;
}

const AccountModal = (props: Props) => {
  const [form] = Form.useForm();
  const {
    visible,
    setVisible,
    userData,
    afterSuccess,
  } = props;

  // const {data, isLoading, isFetching} = useDepartment(PARAMS_GET_ALL);
  const dataDepartment: any = [];
  
  const genderOption = useMemo(() => Object.entries(Gender)
  // render options gender
  .map((item: any, index) => (
    { id: index, name: item[1], value: item[0] }
  )), []);

  const roleOption = useMemo(() => Object.entries(Role)
  // render options gender
  .map((item: any, index) => (
    { id: index, name: item[1], value: item[0] }
  )), []);

  const handleClose = () => {
    if (setVisible) {
      setVisible(false);
      form.resetFields()
    }
  };

  const handleSave = async (formValues: any) => {
    try {
      let res: any = null;
      const { dob, phoneNumber, ...rest} = formValues
      const fmData = {
        ...rest,
        dob: format(new Date(formValues?.dob), DATE),
        phoneNumber : String(formValues?.phoneNumber),
        avatar: ''
      }
      if (!userData) {
        res = await createAccount(fmData)
      } else {
        res = await updateUserInfo( userData?._id, fmData);
      }
      if (res?.message === SUCCESS) {
        message.success(!userData ? 'Create Account success' : 'Update account success')
        if (afterSuccess){
          afterSuccess()
        }
        handleClose()
      } else {
        message.error(res.message)
      }
    } catch (error: any) {
      message.error(error?.message)
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
      <h3>{userData ? 'Edit account' : 'Create account'}</h3>
    </div>
    <Form
      form={form}
      layout='vertical'
      onFinish={handleSave}
      autoComplete="off"
      className={styles.formContainer}
      initialValues={ userData ?
        { 
          firstName: userData.firstName,
          lastName: userData.lastName,
          dob: new Date(userData.dob),
          phoneNumber: userData.phoneNumber,
          address: userData.address,
          role: userData.role,
          gender: userData.gender,
          department: userData.department?._id
        }
        : {}
      }
    >
      <Form.Item label='First Name' name='firstName' required>
        <Input
          maxLength={50}
          placeholder='Enter first name'
        />
      </Form.Item>
      <Form.Item label='Last Name' name='lastName' required>
        <Input
          maxLength={50}
          placeholder='Enter last name'
        />
      </Form.Item>
      { !userData ?
        <Form.Item 
          label='Email' 
          name='email' 
          rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                message: 'Email field is required!',
                required: true,
              },
        ]}>  
          <Input
            maxLength={50}
            placeholder='Enter email'
          />
        </Form.Item> : null
      }
      <Form.Item label='Birth day' name='dob' required>
        <DatePicker/>
      </Form.Item>
      <Form.Item label='Phone' name='phoneNumber' required>
        <InputNumber
          placeholder='Enter phone number'
        />
      </Form.Item>
      <Form.Item label='Address' name='address' required>
        <Input
          maxLength={255}
          placeholder='Enter address'
        />
      </Form.Item>
      <Form.Item label='Role' name='role' required>
        <Select
          placeholder='Select role'
        >
          {roleOption?.map((item: any) =>
            <Option key={item.id} value={item.value}>{item.name}</Option>
          )}
        </Select>
      </Form.Item>

      <Form.Item label='Gender' name='gender' required>
        <Select
          placeholder='Select gender'
        >
          {genderOption?.map((item: any) =>
            <Option key={item.id} value={item.value}>{item.name}</Option>
          )}
        </Select>
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

export default AccountModal