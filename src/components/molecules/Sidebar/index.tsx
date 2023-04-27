import React, { useEffect, useState } from 'react';
import history from '~/utils/history';
import { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useLocation } from 'react-router-dom';

export default function SideNav(props: { menus: any[] }) {
  const { menus } = props;
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKey, setSelectedKey] = useState('1');
  const { pathname } = useLocation();

  const handleClick: MenuProps['onClick'] = ({ key, keyPath }) => {
    history.push(key);
  };
  const menusKey = menus.map((item: any) => item?.key)
  useEffect(() => {
    menus.forEach((route) => {
      if (pathname.startsWith(route?.url || '###')) {
        setSelectedKey(route.key);
      }
      if (route?.children) {
        for (let i = 0; i < route?.children?.length; i += 1) {
          const childRoute = route?.children[i];
          if (window.location.pathname.startsWith(childRoute.url || '###')) {
            setSelectedKey(childRoute.key);
            break;
          }
        }
      }
      if (!(menusKey.includes(pathname))){
        setSelectedKey('')
      }
    });
  }, [pathname, menus]);
  return (
    <Menu
      onClick={handleClick}
      selectedKeys={[selectedKey]}
      openKeys={openKeys}
      onOpenChange={(keys) => setOpenKeys(keys)}
      mode="inline" 
      style={{ height: '100%' }}
      items={menus}
    />
  );
}
