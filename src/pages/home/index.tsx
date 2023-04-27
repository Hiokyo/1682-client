import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '~/routes';
import { useAppSelector } from '~/store';
import { UserRole } from '~/utils/constant';
import { getCookie } from '~/utils/cookie';
import loadable from '~/utils/loadable';

const Spin = loadable(() => import('~/components/atoms/Spin'));

export default function Home() {
  const navigate = useNavigate();
  const userData = useAppSelector((state) => state.userInfo.userData);

  useEffect(() => {
    if (!getCookie('token')) {
     navigate(ROUTES.Login) 
    }
    if (userData){
      if (userData.role && ((userData.role === UserRole.Admin))) {
        navigate(ROUTES.DashBoard);
      } else if (userData.role && ((userData.role === UserRole.Author))) {
        navigate(ROUTES.Books);
      } else {
        navigate(ROUTES.Posts);
      }
    }
  }, [navigate, getCookie, userData]);

  return (
    <div className='d-flex justify-content-center align-items-center w-100 h-100'>
      <Spin spinning />
    </div>
  );
}