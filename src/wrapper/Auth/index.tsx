import React, { useMemo, useState } from "react";

import { Link, useLocation } from "react-router-dom";

import { Layout, MenuProps, theme } from "antd";

import { ROUTES } from "~/routes";

import styles from "./styles.module.scss";
import {
  UnorderedListOutlined,
  TagsOutlined,
  DashboardOutlined,
  FileExclamationOutlined,
  MoneyCollectOutlined,
  UserAddOutlined,
  AccountBookOutlined,
  DollarCircleOutlined,
  HeartOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { Content, Footer } from "antd/es/layout/layout";
import Header from "~/components/molecules/Header";
import Sider from "antd/es/layout/Sider";
import history from "~/utils/history";
import SideNav from "~/components/molecules/Sidebar";
import FriendList from "~/components/molecules/FriendList";
import { RootState, useAppSelector } from "~/store";
import { UserRole } from "~/utils/constant";

type MenuItem = Required<MenuProps>["items"][number];
interface Props {
  children?: React.ReactNode | React.ReactNode[];
}

function Auth(props: Props) {
  const { children = null } = props;
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { pathname } = useLocation();
  const userData = useAppSelector(
    (state: RootState) => state.userInfo.userData
  );
  const menuLeft: MenuItem[] = useMemo(
    () => [
      {
        key: ROUTES.Posts,
        label: <Link to={ROUTES.Posts}>Posts</Link>,
        icon: <UnorderedListOutlined style={{ fontSize: "18px" }} />,
        url: ROUTES.Posts,
        content: "Posts",
      },
      {
        key: ROUTES.Books,
        label: <Link to={ROUTES.Books}>Books</Link>,
        icon: <BookOutlined style={{ fontSize: "18px" }} />,
        url: ROUTES.Books,
        content: "Books",
      },
      // (userData && (userData.role && userData.role === UserRole.User)) &&
      userData &&
        userData.role &&
        userData.role === UserRole.User &&
        !userData.subscriptionPlan?.isSubscribed && {
          key: ROUTES.Membership,
          label: <Link to={ROUTES.Membership}>Membership</Link>,
          icon: <UserAddOutlined style={{ fontSize: "18px" }} />,
          url: ROUTES.Membership,
        },

      userData &&
        userData.role &&
        userData.role !== UserRole.Admin && {
          key: ROUTES.Favorites,
          label: <Link to={ROUTES.Favorites}>Favorites</Link>,
          icon: <HeartOutlined style={{ fontSize: "18px" }} />,
          url: ROUTES.Favorites,
        },

      userData &&
        userData.role &&
        userData.role === UserRole.Admin && {
          key: ROUTES.PaymentAdmin,
          label: <Link to={ROUTES.PaymentAdmin}>Payments</Link>,
          icon: <MoneyCollectOutlined style={{ fontSize: "18px" }} />,
          url: ROUTES.PaymentAdmin,
        },
      userData &&
        userData.role &&
        userData.role === UserRole.Admin && {
          key: ROUTES.Reports,
          label: <Link to={ROUTES.Reports}>Reports</Link>,
          icon: <FileExclamationOutlined style={{ fontSize: "18px" }} />,
          url: ROUTES.Reports,
        },
      userData &&
        userData.role &&
        userData.role === UserRole.Admin && {
          key: ROUTES.Category,
          label: <Link to={ROUTES.Category}>Category</Link>,
          icon: <TagsOutlined style={{ fontSize: "18px" }} />,
          url: ROUTES.Category,
          content: "Category",
        },
      userData &&
        userData.role &&
        userData.role === UserRole.Admin && {
          key: ROUTES.DashBoard,
          label: <Link to={ROUTES.DashBoard}>DashBoard</Link>,
          icon: <DashboardOutlined style={{ fontSize: "18px" }} />,
          url: ROUTES.DashBoard,
          content: "DashBoard",
        },
    ],
    [userData]
  );

  return (
    <Layout className={styles.layoutContainer}>
      <div className="header">
        <Header />
      </div>
      <Content className={styles.contentMain}>
        {/* <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>{convertPathName}</Breadcrumb.Item>
        </Breadcrumb> */}
        <Layout
          className={styles.contentNav}
          style={{ padding: "24px 0", background: colorBgContainer }}
        >
          <Sider
            className={styles.contentSider}
            style={{ background: colorBgContainer }}
          >
            <SideNav menus={menuLeft} />
          </Sider>
          <Content className={styles.contentList}>{children}</Content>
          <div className={styles.friendListContainer}>
            <FriendList />
          </div>
        </Layout>
      </Content>
      <Footer className={styles.footer} style={{ textAlign: "center" }}>
        1682 ©2023 Created by Quan - Hieu
      </Footer>
    </Layout>
  );
}

export default Auth;
