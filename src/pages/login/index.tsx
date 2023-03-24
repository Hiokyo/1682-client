import React, { useEffect, useState } from 'react';
import { Button, Divider, Form, Input, message } from 'antd';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '~/routes';
import { setLogin } from '~/api/login';
import { handleLogin } from '~/utils/helper';
import { getCookie } from '~/utils/cookie';
import { SUCCESS } from '~/utils/constant';
import loadable from '~/utils/loadable';
import Svg from '~/components/atoms/Svg';
import styles from './styles.module.scss';
import ModalRegister from '~/components/molecules/ModalRegister';

const Spin = loadable(() => import('~/components/atoms/Spin'));
const Modal = loadable(() => import('~/components/atoms/Modal'));

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [visibleModalRegister, setVisibleModalRegister] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';

  const handleGetCookie = async (formValues: any) => {
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
            const token = res?.data?.token;
            const userId = res?.data?._id
            handleLogin({
              accessToken: token,
              userId: userId
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
        <div className={styles.loginContainer}>
          <div className={styles.formContainer}>
          <h1>Login</h1>
            <Form
              form={form}
              layout='vertical'
              onFinish={handleGetCookie}
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
              <p>Forgot password?</p> &nbsp; <Link to={ROUTES.ResetPasswordCode}>Get reset password code here!</Link>
            </div>
            <Divider/>
            <div
            >
              If you don't have an account click <a onClick={() => setVisibleModalRegister(true)}>Here</a>
            </div>

          </div>
        </div>
        <ModalRegister
          visible={visibleModalRegister}
          setVisible={setVisibleModalRegister}
        />
      </Spin> 
    </>
  )
}

export default Login