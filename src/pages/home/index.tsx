import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '~/routes';
import { getCookie } from '~/utils/cookie';
import loadable from '~/utils/loadable';

const Spin = loadable(() => import('~/components/atoms/Spin'));

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getCookie('token')) {
     navigate(ROUTES.Login) 
    } else {
      navigate(ROUTES.Posts);
    }
  }, [navigate, getCookie]);

  return (
    <div className='d-flex justify-content-center align-items-center w-100 h-100'>
      <Spin spinning />
    </div>
  );
}