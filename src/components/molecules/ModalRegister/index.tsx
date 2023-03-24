import React, { useMemo } from 'react';
import Modal from '~/components/atoms/Modal';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Option } from '~/components/atoms/Select';


import styles from './styles.module.scss';
import { setRegister } from '~/api/register';
import { Gender, SUCCESS } from '~/utils/constant';
import { ROUTES } from '~/routes';
import DatePicker from '~/components/atoms/DatePicker';
import Select from '~/components/atoms/Select';
import InputNumber from '~/components/atoms/InputNumber';

interface Props{
  visible: boolean;
  setVisible: (value: boolean) => void;
}

const ModalRegister = (props: Props) => {
  const {visible, setVisible} = props;
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const rules = [{ required: true, message: '' }];
  const genderOption = useMemo(() => Object.entries(Gender)
  // render options gender
  .map((item: any, index) => (
    { id: index, name: item[1], value: item[0] }
  )), []);

  const handleRegister = async (formValues: any) => {
    try {
      if (form) {
        const fmData = {
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          phoneNumber: String(formValues.phoneNumber),
          address: '',
          dob: formValues.dob,
          gender: formValues.gender,
          confirmPassword: formValues.confirmPassword,
          email: formValues.email,
          password: formValues.password
        }
        const res = await setRegister(fmData)
        if (res) {
          if (res.message === SUCCESS) {
            message.success('Register account success')
            setVisible(false)
          }
          else {
            message.error(res.message)
          }
        }
      }
    } catch (error: any) {
      message.error(error)
    }
  }

  const hanldeCheckConfirmPassword = (formValues: any) => {
    if (form) {
      const password = formValues.password;
      const confirmPassword = formValues.confirmPassword
      if (password === confirmPassword) {
        handleRegister(formValues)
      } else {
        message.error('Your password and confirmation password do not match!')
      }
    }
  }

  return (
    <Modal
      open={visible}
      width={420}
      footer={false}
      centered
    >
      <div className={styles.formContainer}>
      <h1>Register</h1>
        <Form
          form={form}
          layout='vertical'
          onFinish={hanldeCheckConfirmPassword}
        >
          <div className={styles.formGroup}>
            <Form.Item 
              className={styles.firstItem}
              name='firstName'
              label='First name'
              rules={rules}
            >
              <Input
                placeholder='First name'
              />
            </Form.Item>
            <Form.Item 
              className={styles.secondItem}
              name='lastName'
              label='Last name'
              rules={rules}
            >
              <Input
                placeholder='Last name'
              />
            </Form.Item>
          </div>

          <div className={styles.formGroup}>
            <Form.Item 
              className={styles.firstItem}
              name='phoneNumber'
              label='Phone number'
              rules={rules}
            >
              <InputNumber
                style={{width: '100%'}}
                placeholder='Phone number'
              />
            </Form.Item>
            <Form.Item 
              className={styles.datePicker}
              name='dob'
              label='Birth day'
              rules={rules}
            >
              <DatePicker 
                style={{width: 178}}
              />
            </Form.Item>
          </div>

          <Form.Item 
            name='email'
            label='Email'
            rules={[
              { required: true, message: 'Please input your email!' },
              {
                required: true,
                type: "email",
                message: "The input is not valid E-mail!",
              }, 
            ]}
          >
            <Input
              placeholder='Email'
            />
          </Form.Item>
          <Form.Item
            label='Gender'
            name='gender'
            rules={rules}
          >
            <Select
              placeholder='Select gender'
            >
              {genderOption?.map((item: any) =>
                <Option key={item.id} value={item.value}>{item.name}</Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item 
            name='password'
            label='Password'
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              placeholder='Password'
            />
          </Form.Item>

          <Form.Item 
            name='confirmPassword'
            label='Confirm password'
            rules={[{ required: true, message: 'Please input your confirm password!' }]}
          >
            <Input.Password
              placeholder='Confirm password'
            />
          </Form.Item>
          <div className={styles.btnGroup}>
            <Button
              className={styles.btnClose}
              onClick={() => setVisible(false)}
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
      </div>
    </Modal>
  )
}

export default ModalRegister