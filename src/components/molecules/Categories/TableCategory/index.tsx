import React, { useEffect, useState } from 'react';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { format } from 'date-fns';
import { DATE, SUCCESS } from '~/utils/constant';
import { Tag, message } from 'antd';
import { inactiveCategory } from '~/api/categories';
import { SorterResult } from 'antd/es/table/interface';

import iconEdit from '~/assets/images/iconEdit.svg';
import iconWarning from '~/assets/images/warning.svg';

import Svg from '~/components/atoms/Svg';
import loadable from '~/utils/loadable';
import styles from './styles.module.scss';

const Table = loadable(() => import('~/components/atoms/Table'));
const ModalConfirm = loadable(() => import('~/components/atoms/ModalConfirm'));
const Spin = loadable(() => import('~/components/atoms/Spin'));
const CategoryModal = loadable(() => import('~/components/molecules/Categories/CategoryModal'));

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
  const dataCetogories = categories?.topics
  const [ isModalVisible, setIsModalVisible ] = useState(false);
  const [ visibleModalInactive, setVisibleModalInactive ] = useState(false);
  const [ idInactive, setIdInactive ] = useState();
  const [ category, setCategory ] = useState({});
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: categories && categories?.total
  });

  useEffect(() => {
    setPagination({...pagination, total: categories?.total})
  
  }, [categories])
  
  const handleEdit = (record: any) => {
    setCategory(record)
    setIsModalVisible(true)
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
        setVisibleModalInactive(false)
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
      width: '30%',
      sorter: true
    },
    {
      title: 'Create date',
      dataIndex: 'createdAt',
      width: '30%',
      sorter: true,
      render: (date: any) => 
      <div>
        {date && format(new Date(date), DATE)}
      </div>
     
    },
    {
      title: 'Note',
      dataIndex: 'Note',
      width: '30%',
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
            scroll={{ x: '60vh' }}
            columns={columns}
            rowKey={(record: any) => record._id}
            dataSource={dataCetogories}
            onChange={handleTableChange}
            pagination={pagination}
            size="small"
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

// mobile 10 10 10 6
// tablet

export default CategoryTable