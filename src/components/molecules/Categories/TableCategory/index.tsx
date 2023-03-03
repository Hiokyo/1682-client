import React, { useState } from 'react';
import type { ColumnsType, TablePaginationConfig, TableProps } from 'antd/es/table';
import iconEdit from '~/assets/images/iconEdit.svg';
import iconDelete from '~/assets/images/iconDelete.svg';
import iconWarning from '~/assets/images/warning.svg';

import styles from './styles.module.scss';
import Svg from '~/components/atoms/Svg';
import CategoryModal from '../CategoryModal';
import Spin from '~/components/atoms/Spin';
import Table from '~/components/atoms/Table';
import { format } from 'date-fns';
import { DATE, SUCCESS } from '~/utils/constant';
import { Tag, message } from 'antd';
import { inactiveCategory } from '~/api/categories';
import ModalConfirm from '~/components/atoms/ModalConfirm';
import { SorterResult } from 'antd/es/table/interface';

interface Props {
  categories?: any;
  refetch: () => void;
  isFetching?: boolean;
  isLoading?: boolean;
  setParams?: (value: any) => void;
}
interface DataType {
  name: string;
  createdAt: Date;
  status: string;

}

const CategoryTable = (props: Props) => {
  const { categories, refetch, isFetching, isLoading, setParams } = props;
  const [ isModalVisible, setIsModalVisible ] = useState(false);
  const [ visibleModalInactive, setVisibleModalInactive ] = useState(false);
  const [ idInactive, setIdInactive ] = useState();
  const [ category, setCategory ] = useState({});
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 5,
    total: 10
  });
  
  const handleEdit = (record: any) => {
    setCategory(record)
    setIsModalVisible(true)
  }

  const modalConfirmDelete = (record: any) => {
    //Code here
  }

  const showModalInactive = (record: any) => {
    setVisibleModalInactive(true)
    setIdInactive(record)
  }

  const handleInactive = async () => {
    if (idInactive) {
      const res = await inactiveCategory(idInactive);
      if (res.message === SUCCESS) {
        message.success('Inactive Category success')
        refetch();
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
      sort: 'NAME_ASC',
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
      width: '15%',
      defaultSortOrder: 'descend',
      sorter: true
    },
    {
      title: 'Create date',
      dataIndex: 'createdAt',
      width: '15%',
      sorter: true,
      render: (date: any) => 
      <div>
        {date && format(new Date(date), DATE)}
      </div>
     
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '25%',
      render: (status: string, record: any) =>
      (status === 'ACTIVE') ?
        <Tag className='cursor-pointer' onClick={() => showModalInactive(record?._id)} color="blue">{status}</Tag> 
        :
        <Tag color="red">{status}</Tag> 
      
    },
    {
      title: '',
      dataIndex: 'optional',
      width: '4%',
      render: (_: any, record: any) => (
        <>
          <div className={styles.groupSave}>
            <a onClick={() => handleEdit(record)}>
              <Svg src={iconEdit} alt="icon Edit" />
            </a>
            <a onClick={() => modalConfirmDelete(record)}>
              <Svg src={iconDelete} alt="icon Delete" />
            </a>
          </div>
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
            scroll={{ y: '60vh' }}
            columns={columns}
            rowKey={(record: any) => record._id}
            dataSource={categories}
            onChange={handleTableChange}
            pagination={pagination}
          />
        </Spin>
      </div>
      <CategoryModal
        visible={isModalVisible}
        setVisible={setIsModalVisible}
        refetch={refetch}
        category={category}
        setCategory={setCategory}
      />
      <ModalConfirm
        visible={visibleModalInactive}
        onCancel={() => setVisibleModalInactive(false)}
        onOk={handleInactive}
        title='Are you sure to Inactive this category'
        centered={true}
      />
    </>  
  )
}

export default CategoryTable