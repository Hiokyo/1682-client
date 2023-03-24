import React, { useCallback, useMemo, useState } from 'react';
import { Button, Form } from 'antd';
import { DownloadOutlined } from '@ant-design/icons'
import Svg from '~/components/atoms/Svg';
import loadable from '~/utils/loadable';

import styles from './styles.module.scss';

const Select = loadable(() => import('~/components/atoms/Select'));

const Filter = () => {

  const showAddModal = () => {
    // setIsModalVisible(true);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.contentWrapper}
        >
          <Button className={styles.btnAdd} onClick={showAddModal}>
            <DownloadOutlined />
            Download file
          </Button>
        </div>
      </div>
    </>
  );
};

export default Filter;
