import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '~/routes';
import { resetPassword } from '~/api/resetPassword';
import { SUCCESS } from '~/utils/constant';
import Spin from '~/components/atoms/Spin';
import styles from './styles.module.scss';

const ResetPassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      setLoading(true)
      let res: any = null;
      if (form){
        const code = form.getFieldValue('code')
        const email = form.getFieldValue('email')
        const fmData = form.getFieldsValue([
          'email',
          'newPassword',
          'confirmPassword',
        ])
        res = await resetPassword(code ,email, fmData)
        if (res.message === SUCCESS) {
          message.success('Reset password success')
          setTimeout(
            () => {
              setLoading(false)
              navigate(ROUTES.Login) 
            }
          ,1500)
        } else {
          setLoading(false)
          message.error(res.message)
        }
      }
    } catch (error: any) {
      message.error(error)
    }
  }

  const hanldeCheckConfirmPassword = () => {
    if (form) {
      const newPassword = form.getFieldValue('newPassword');
      const confirmPassword = form.getFieldValue('confirmPassword')
      if (newPassword === confirmPassword) {
        handleResetPassword()
      } else {
        message.error('Your password and confirmation password do not match!')
      }
    }
  }

  return (
    <Spin spinning={loading}>
      <div className={styles.registerContainer}>
        <div className={styles.formContainer}>
        <h1>ResetPassword</h1>
          <Form
            form={form}
            autoComplete="off"
            layout='vertical'
            onFinish={hanldeCheckConfirmPassword}
          >
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
                maxLength={50}
              />
            </Form.Item>

            <Form.Item 
              name='newPassword'
              label='New password'
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                maxLength={12}
              />
            </Form.Item>

            <Form.Item 
              name='confirmPassword'
              label='Confirm password'
              rules={[{ required: true, message: 'Please input your confirm password!' }]}
            >
              <Input.Password
                maxLength={12}
              />
            </Form.Item>

            <Form.Item 
              name='code'
              label='Code'
              rules={[
                { required: true, message: 'Please input code!' }, 
              ]}
            >
              <Input
                minLength={6}
                maxLength={6}
              />
            </Form.Item>

            <Form.Item>
            <Button 
              className={styles.btnLogin}
              type="primary"
              htmlType="submit"
            >
              Reset password
            </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Spin>
  )
}

export default ResetPassword