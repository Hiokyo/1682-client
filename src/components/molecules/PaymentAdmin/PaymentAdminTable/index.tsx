import React, { useEffect, useState } from 'react';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';

import styles from './styles.module.scss';
import Spin from '~/components/atoms/Spin';
import Table from '~/components/atoms/Table';
import { DATE } from '~/utils/constant';
import { Tag, message } from 'antd';
import { SorterResult } from 'antd/es/table/interface';
import { format } from 'date-fns';

interface Props {
  payments?: any;
  refetch?: () => void;
  isLoading?: boolean;
  isFetching?: boolean;
}

const PaymentAdminTable = (props: Props) => {
  const { payments, refetch, isLoading, isFetching } = props;
  const dataPayments = payments?.payments;

  const columns: ColumnsType<any> = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '20%',
      render: (item: any, record: any) =>
      ( record.paymentFor?.bookId ?
          <div>
            {(record.paymentFor?.bookId?.title)}
          </div> : 
          '-'
      )
    },
    {
      title: 'Type',
      dataIndex: 'paymentFor',
      width: '20%',
      render: (item: any) => 
        <div>
          {item?.paymentType}
        </div>
    },
    {
      title: 'Created by',
      dataIndex: 'createdBy',
      width: '15%',
      render: (item: any, record: any) => 
      <div>
        {item?.firstName} {item?.lastName}
      </div>
    },
    {
      title: 'Date create',
      dataIndex: 'createdAt',
      width: '15%',
      render: (date: string, record: any) =>
      <div>
        {date ? format(new Date(date), DATE) : '-'}
      </div>
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      width: '15%',
      render: (item: any, record) => 
      <div>
        {record.amount} {record.currency}
      </div>
    },
    {
      title: 'Payment gate',
      dataIndex: 'method',
      width: '15%',
      render: (item: any, record) => 
      <div>
        {item.name}
      </div>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '15%',
      render: (status: string, record: any) =>
      (status === 'PENDING') ?
        <Tag color='orange' >{status}</Tag> 
        :
        <Tag color="green">{status}</Tag>
    },
    // {
    //   title: '',
    //   dataIndex: 'optional',
    //   width: '15%',
    //   render: (_: any, record: any) => (
    //     <>
    //       {/* <div className={styles.groupSave}>
    //         <a onClick={() => handleEdit(record)}>
    //           <Svg src={iconEdit} alt="icon Edit" />
    //         </a>
    //       </div> */}
    //     </>
    //   )
    // },
  ];

  return (
    <>
      <div
        className={styles.container}
        >
        <Spin spinning={isLoading || isFetching}>
          <Table
            className={styles.tableContainer}
            columns={columns}
            pagination={false}
            size='small'
            scroll={{y : '58vh'}}
            rowKey={(record: any) => record._id}
            dataSource={dataPayments}
          />
        </Spin>
      </div>
    </>  
  )
}

export default PaymentAdminTable