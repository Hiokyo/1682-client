import React, { useMemo } from 'react';

import { Link, useLocation } from 'react-router-dom';

import {  Layout, MenuProps, theme } from 'antd';

import { ROUTES } from '~/routes';

import styles from './styles.module.scss';
import {
  UnorderedListOutlined,
  TagsOutlined,
  DashboardOutlined,
  BookOutlined } from '@ant-design/icons'
import { Content, Footer } from 'antd/es/layout/layout';
import Header from '~/components/molecules/Header';
import Sider from 'antd/es/layout/Sider';
import history from '~/utils/history';
import SideNav from '~/components/molecules/Sidebar';


type MenuItem = Required<MenuProps>['items'][number];
interface Props {
  children?: React.ReactNode | React.ReactNode[];
}

function Auth(props: Props) {
  const { children = null } = props;
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { pathname } = useLocation();
  const convertPathName = pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2);

  const menuLeft: MenuItem[] = useMemo(() => [
    {
      key: ROUTES.Posts,
      label: <Link to={ROUTES.Posts}>Posts</Link>,
      icon: <UnorderedListOutlined style={{fontSize: '18px'}}/>,
      url: ROUTES.Posts,
      content: 'Posts'
    },
    {
      key: ROUTES.Books,
      label: <Link to={ROUTES.Books}>Books</Link>,
      icon: <BookOutlined style={{fontSize: '18px'}}/>,
      url: ROUTES.Books,
      content: 'Books'
    },
    // {
    //   key: ROUTES.Campaign,
    //   label: <Link to={ROUTES.Campaign}>Campaign</Link>,
    //   icon: <BookOutlined style={{fontSize: '18px'}}/>,
    //   url: ROUTES.Campaign,
    // },
    {
      key: ROUTES.Category,
      label: <Link to={ROUTES.Category}>Category</Link>,
      icon: <TagsOutlined style={{fontSize: '18px'}}/>,
      url: ROUTES.Category,
      content: 'Category'
    },
    {
      key: ROUTES.DashBoard,
      label: <Link to={ROUTES.DashBoard}>DashBoard</Link>,
      icon: <DashboardOutlined style={{fontSize: '18px'}}/>,
      url: ROUTES.DashBoard,
      content: 'DashBoard'
    },
  ], []);

  return (
    <Layout className={styles.layoutContainer}>
      <div className="header">
        <Header/>
      </div>
      <Content className={styles.contentMain}>
        {/* <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>{convertPathName}</Breadcrumb.Item>
        </Breadcrumb> */}
        <Layout className={styles.contentNav} style={{ padding: '24px 0', background: colorBgContainer }}>
          <Sider className={styles.contentSider} style={{ background: colorBgContainer }}>
            <SideNav menus={menuLeft}/>
          </Sider>
          <Content className={styles.contentList}>{children}</Content>
        </Layout>
      </Content>
      <Footer className={styles.footer} style={{ textAlign: 'center' }}>1640 ©2023 Created by Group 3</Footer>
    </Layout>
  );
}

export default Auth;
