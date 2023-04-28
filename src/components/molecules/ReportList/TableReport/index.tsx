import React, { useEffect, useState } from 'react';
import type { ColumnsType, TablePaginationConfig, TableProps } from 'antd/es/table';
import iconEdit from '~/assets/images/iconEdit.svg';
import iconDelete from '~/assets/images/iconDelete.svg';
import iconWarning from '~/assets/images/warning.svg';

import styles from './styles.module.scss';
import Svg from '~/components/atoms/Svg';
import Spin from '~/components/atoms/Spin';
import Table from '~/components/atoms/Table';
import { format } from 'date-fns';
import { DATE, SUCCESS } from '~/utils/constant';
import { Tag, message } from 'antd';
import { inactiveCategory } from '~/api/categories';
import { SorterResult } from 'antd/es/table/interface';

interface Props {
  reports?: any;
  refetch?: () => void;
  isLoading?: boolean;
  isFetching?: boolean;
  total?: number;
  setParams?: (value: any) => void;
}
interface DataType {
  name: string;
  createdAt: Date;
  status: string;
}

const ReportTable = (props: Props) => {
  const { reports, refetch, isLoading, isFetching, setParams, total } = props;
  const [ isModalVisible, setIsModalVisible ] = useState(false);
  const [ idInactive, setIdInactive ] = useState();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: total && total
  });

  useEffect(() => {
    setPagination({...pagination, total: total})
  
  }, [total])
  
  const modalConfirmDelete = (record: any) => {
    //Code here
  }

  const handleInactive = async () => {
    if (idInactive) {
      const res = await inactiveCategory(idInactive);
      if (res.message === SUCCESS) {
        message.success('Inactive Category success')
        // refetch();
      } else {
        message.error(res.message)
      }
    }
  }

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    sorter: SorterResult<any>
  ) => {
    setPagination(newPagination);

    const paramsfilters = {
      sort: 'TITLE_ASC',
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
      title: 'Title',
      dataIndex: 'title',
      width: '20%',
    },
    {
      title: 'Reported by',
      dataIndex: 'createdBy',
      width: '15%',
      render: (item: any) => 
      <div>
        {item.firstName} {item.lastName}
      </div>
    },
    {
      title: 'Type',
      dataIndex: 'schema',
      width: '15%',
      render: (_: string, record: any) =>
      <div>
        {record.type} - {record.schema}
      </div>
    },
    {
      title: 'Schema name',
      dataIndex: 'schemaId',
      width: '15%',
      render: (item: any) => 
      <div>
        {item.title}
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
        <Tag color="red">{status}</Tag> 
    },
    {
      title: 'Content',
      dataIndex: 'content',
      width: '20%',
    },
    {
      title: '',
      dataIndex: 'optional',
      width: '15%',
      render: (_: any, record: any) => (
        <>
          {/* <div className={styles.groupSave}>
            <a onClick={() => handleEdit(record)}>
              <Svg src={iconEdit} alt="icon Edit" />
            </a>
          </div> */}
        </>
      )
    },
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
            onChange={handleTableChange}
            rowKey={(record: any) => record._id}
            dataSource={reports}
          />
        </Spin>
      </div>
    </>  
  )
}

export default ReportTable