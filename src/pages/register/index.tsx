import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '~/routes';
import { setActive, setLogin } from '~/api/login';
import { handleLogin } from '~/utils/helper';
import { getCookie } from '~/utils/cookie';
import { SUCCESS } from '~/utils/constant';

import loadable from '~/utils/loadable';
import styles from './styles.module.scss';

const Spin = loadable(() => import('~/components/atoms/Spin'));
const Modal = loadable(() => import('~/components/atoms/Modal'));

const Register = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';


  const handleRegister = async (formValues: any) => {
    setLoading(true)
    try {
      if (form) {
        const fmData = {
          email: formValues.userName,
          password: formValues.password
        }
        const res = await setLogin(fmData)
        if (res) {
          if (res.message === SUCCESS) {
            const token = res?.data?.token
            handleLogin({
              accessToken: token,
            })
            setLoading(false)
          }
          else {
            message.error(res.message)
            setLoading(false)
          }
        }
      }
    } catch (error: any) {
      message.error(error)
    }
  }

  useEffect(() => {
    const token = getCookie('token');
    if (token) {
      navigate(callbackUrl);
      return;
    } 
  }, [navigate, callbackUrl]);
  
  return (
    <>
      <Spin spinning={loading}>
        <div className={styles.registerContainer}>
          <div className={styles.formContainer}>
          <h1>Login</h1>
            <Form
              form={form}
              layout='vertical'
              onFinish={handleRegister}
            >
              <Form.Item 
                name='userName'
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
                <Input/>
              </Form.Item>
              <Form.Item 
                name='password'
                label='Password'
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password/>
              </Form.Item>
              <Form.Item>
              <Button 
                className={styles.btnLogin}
                type="primary"
                htmlType="submit"
              >
                Login
              </Button>
              </Form.Item>
            </Form>
            <div className={styles.forgotPassword}>
              <p>Allready have account?</p> &nbsp; <Link to={ROUTES.Login}>Login now!</Link>
            </div>
          </div>
        </div>
      </Spin> 
    </>
  )
}

export default Register