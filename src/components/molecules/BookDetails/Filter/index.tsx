import React, { useCallback, useMemo, useState } from 'react';
import { Button, Form } from 'antd';
import { DownloadOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import loadable from '~/utils/loadable';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';

const Select = loadable(() => import('~/components/atoms/Select'));

interface Props {
  bookId: string;
}
const Filter = (props: Props) => {
  const { bookId } = props;
  const showAddModal = () => {
    // setIsModalVisible(true);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.contentWrapper}
        >
          <Link 
            to={`/payment/${bookId}`}
          >
            <Button type='primary' className={styles.btnBuyBook}>
              <ShoppingCartOutlined />
              Buy book
            </Button>
          </Link>
          <Button className={styles.btnAdd} onClick={showAddModal}>
            <DownloadOutlined />
            <p className={styles.btnText}>Download file</p>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Filter;
