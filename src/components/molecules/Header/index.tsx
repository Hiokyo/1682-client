import React from "react";
import { Badge, Dropdown, Layout, MenuProps, message } from "antd";
import { removeCookie } from "~/utils/cookie";
import { ROUTES } from "~/routes";

import history from "~/utils/history";
import loadable from "~/utils/loadable";
import iconNotification from "~/assets/images/iconNotification.svg";
import iconAvatar from "~/assets/images/iconAvatar.svg";
import logo from "~/assets/images/one more page-logos_white.png";

import { RootState, useAppDispatch, useAppSelector } from "~/store";
import { setUserInfo } from "~/store/userInfo";
import { Authorization } from "~/wrapper/Authorization";
import { UserRole } from "~/utils/constant";
import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import { NotificationSchema, setAllNotifications } from "~/store/notification";
import { getSelfNotification, markAsRead } from "~/api/notification";

import { CrownTwoTone } from "@ant-design/icons";

const Svg = loadable(() => import("~/components/atoms/Svg"));
const { Header: LayoutHeader } = Layout;

export default function Header() {
  const me = useAppSelector((state: RootState) => state.userInfo.userData);
  const dispatch = useAppDispatch();

  const allNotifications = useAppSelector(
    (state: RootState) => state.notification.allNotifications
  );

  const navigate = useNavigate();

  const logout = () => {
    removeCookie("token");
    dispatch(setUserInfo({}));
    history.push(ROUTES.Login);
  };

  const handleClickLogo = () => {
    history.push("/");
  };

  const showProfile = () => {
    history.push(ROUTES.Profile);
  };

  const handleSetting = () => {
    history.push(ROUTES.Setting);
  };

  const handleShowTransaction = () => {
    history.push(ROUTES.PaymentsAuthor);
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <div onClick={showProfile}>Profile</div>,
    },
    me &&
      me.role &&
      me.role === UserRole.Admin && {
        key: "2",
        label: <div onClick={handleSetting}>Setting</div>,
      },
    me &&
      me.role &&
      me.role === UserRole.Author && {
        key: "3",
        label: <div onClick={handleShowTransaction}>Payments</div>,
      },
    {
      type: "divider",
    },
    {
      key: "4",
      label: <div onClick={logout}>Logout</div>,
    },
  ];

  const handleClickNotification = async (
    schema: string,
    schemaId: string,
    read: boolean,
    notificationId: string
  ) => {
    if (!read) {
      const res = await markAsRead(notificationId);
      if (res && !res.errorCode && !res.errors.length) {
        const { data } = res;
        dispatch(setAllNotifications(data));
      } else {
        message.error("Fail to load notifications");
      }
    }

    const url = `/schema/id`;

    navigate(
      url
        .replace(
          "schema",
          schema === NotificationSchema.BOOK
            ? "books/lists"
            : schema === NotificationSchema.USER
            ? "userProfile"
            : "post"
        )
        .replace("id", schemaId)
    );
  };

  return (
    <Layout className={styles.header}>
      <LayoutHeader className={styles.coverHeader}>
        <div
          onClick={handleClickLogo}
          className={`${styles.title} cursor-pointer`}
          tabIndex={0}
        >
          <Svg className={styles.logo} src={logo} />

          <h3>One more page</h3>
        </div>

        <div className={styles.info}>
          <Dropdown
            overlayStyle={{
              maxHeight: "40vh",
              overflowX: "hidden",
              overflowY: "scroll",
            }}
            menu={{
              items: allNotifications.map((item) => ({
                ...item,
                key: item._id,
                label: (
                  <div
                    onClick={() =>
                      handleClickNotification(
                        item.schema,
                        item.schemaId,
                        item.read,
                        item._id
                      )
                    }
                    style={{ color: item.read ? "" : "blue" }}
                    key={item._id}
                  >
                    {item.content}
                  </div>
                ),
              })),
            }}
          >
            <Badge
              count={allNotifications.filter((item) => !item.read).length}
              size="small"
            >
              <Svg
                src={iconNotification}
                alt="icon notification"
                className={styles.iconNotification}
              />
            </Badge>
          </Dropdown>

          <Dropdown menu={{ items }}>
            <div className={styles.coverInfo}>
              <div className={styles.avatar}>
                <Svg
                  src={iconAvatar}
                  alt="icon avatar"
                  className={styles.iconAvatar}
                />
                {me &&
                  me.subscriptionPlan &&
                  me.subscriptionPlan.isSubscribed && (
                    <CrownTwoTone
                      twoToneColor="yellow"
                      style={{ position: "absolute", left: 2, top: 7 }}
                    />
                  )}
              </div>

              <div className={styles.name}>
                {me?.firstName} {me?.lastName}
              </div>
            </div>
          </Dropdown>
        </div>
      </LayoutHeader>
    </Layout>
  );
}
