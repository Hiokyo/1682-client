import React from 'react';
import { useAppSelector } from '~/store';
import { UserRole } from '~/utils/constant';

interface Props {
  roles?: Array<string>;
  children?: React.ReactNode | React.ReactNode[];
}

export const Authorization = (props: Props) => {
  const { roles, children } = props;
  const userData = useAppSelector((state) => state.userInfo.userData);
  const userRole = userData?.role;
  if (!userRole) return null;
  if (userRole && Array.isArray(roles) && roles?.includes(userRole)) {
    return <>{children}</>;
  }
  return null;
};

