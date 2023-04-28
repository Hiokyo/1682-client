import React, { useEffect, useState } from 'react';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';

import styles from './styles.module.scss';
import Spin from '~/components/atoms/Spin';
import Table from '~/components/atoms/Table';
import { DATE, PARAMS_GET_ALL, SUCCESS } from '~/utils/constant';
import { Tag, message } from 'antd';
import { inactiveCategory } from '~/api/categories';
import { SorterResult } from 'antd/es/table/interface';
import { format } from 'date-fns';
import { useBooks } from '~/hooks/useBooks';

interface Props {
  payments?: any;
  refetch?: () => void;
  isLoading?: boolean;
  isFetching?: boolean;
  total?: number;
  setParams: (value: any) => void;
}
interface DataType {
  name: string;
  createdAt: Date;
  status: string;
}
const PaymentTable = (props: Props) => {
  const { payments, refetch, isLoading, isFetching, setParams, total } = props;
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: total && total
  });

  useEffect(() => {
    setPagination({...pagination, total: total})
  }, [total])
  

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    sorter: SorterResult<any>
  ) => {
    setPagination(newPagination);

    const paramsfilters = {
      sort: 'DATE_CREATED_DESC',
      oder: sorter.order,
      page: newPagination.current,
      limit: newPagination.pageSize
    }; 
    if (setParams) {
      setParams(paramsfilters)
    }
  };

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
            pagination={pagination}
            columns={columns}
            size='small'
            onChange={handleTableChange}
            rowKey={(record: any) => record._id}
            dataSource={payments}
          />
        </Spin>
      </div>
    </>  
  )
}

export default PaymentTable