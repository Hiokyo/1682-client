import React, { useCallback, useMemo, useState } from "react";
import { Button, Form } from "antd";
import {
  DownloadOutlined,
  ShoppingCartOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import loadable from "~/utils/loadable";
import styles from "./styles.module.scss";
import { Link } from "react-router-dom";
import { getCookie } from "~/utils/cookie";
import { formatter } from "~/utils/helper";

interface Props {
  bookId: string;
  price: {
    amount: Number;
    currency: string;
  };
  purchaser: Array<{ user: any; createdAt: Date }>;
}
const Filter = (props: Props) => {
  const { bookId, price, purchaser } = props;
  const userId = getCookie("userId");
  const showAddModal = () => {
    // setIsModalVisible(true);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          {purchaser.map((item) => item.user).includes(userId) ? (
            <Button disabled style={{ marginRight: 5 }}>
              Book already purchased <CheckOutlined />
            </Button>
          ) : (
            <Link to={`/payment/${bookId}`}>
              <Button type="primary" className={styles.btnBuyBook}>
                <ShoppingCartOutlined />
                Buy book - {formatter(+price?.amount) || 0}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Filter;
