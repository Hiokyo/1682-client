import React, { useMemo, useState } from 'react';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import iconEdit from '~/assets/images/iconEdit.svg';
import iconWarning from '~/assets/images/warning.svg';

import {format} from 'date-fns'
import { DATE, SUCCESS } from '~/utils/constant';
import { Tag, message } from 'antd';
import { SorterResult } from 'antd/es/table/interface';
import { inactiveAcount } from '~/api/account';

import Svg from '~/components/atoms/Svg';
import loadable from '~/utils/loadable';
import styles from './styles.module.scss';

const Modal = loadable(() => import('~/components/atoms/Modal'));
const Table = loadable(() => import('~/components/atoms/Table'));
const Spin = loadable(() => import('~/components/atoms/Spin'));
const AccountModal = loadable(() => import('~/components/molecules/SystemSetting/ModalAccount'));
const ModalChangeDepartment = loadable(() => import('~/components/molecules/SystemSetting/ModalChangeDepartment'));

interface Props {
  dataAccount?: any;
  isLoading?: boolean;
  isFetching?: boolean;
  setParams?: (value: any) => void;
  refetch: () => void;
}

const TableAccount = (props: Props) => {
  const { dataAccount, isFetching, isLoading, setParams, refetch } = props;
  const dataUser = dataAccount?.users;
  const [ isModalVisible, setIsModalVisible ] = useState(false);
  const [ visibleModalConfirm, setVisibleModalConfirm ] = useState(false);
  const [ visibleModalChangeDepartment, setVisibleModalChangeDepartment ] = useState(false);
  const [ userData, setUserData ] = useState({});
  const [ recordChange, setRecordChange ] = useState<any>({});
  const [ idInactive, setIdInactive ] = useState();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 5,
    total: 7
  });
  
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
  const handleEdit = (record: any) => {
    setUserData(record)
    setIsModalVisible(true)
  }

  const handleShowModal = (record: any) => {
    setVisibleModalConfirm(true)
    setIdInactive(record)
  }
  const handleInactive = async () => {
    if (idInactive) {
      const res = await inactiveAcount(idInactive)
      if (res.message === SUCCESS) {
        message.success('Inactive account success')
        if (refetch) {
          refetch()
        }
        setVisibleModalConfirm(false)
      } else {
        message.error(res.message)
      }
    }
  }

  const handleOpenModal = (record: any) => {
    setRecordChange(record);
    setVisibleModalChangeDepartment(true)
  }

  const columns: ColumnsType<any> = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '20%',
      sorter: true,
      render: (_: string, record: any) => (
        <div className='d-flex'>
          <p>{record.firstName}</p>
            &nbsp;
          <p>{record.lastName}</p>
        </div>
      )
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      width: '20%',
      sorter: true,
      render: (createdAt: string) => (
        <div>
          {
            createdAt && format(new Date(createdAt), DATE)
          }
        </div>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: true,
      width: '20%',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      width: '10%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '10%',
      render: (status: string, record: any) => 
        (status === 'ACTIVE') ?
        <Tag className='cursor-pointer' onClick={() => handleShowModal(record?._id)} color="blue">{status}</Tag>
        :
        <Tag color="red">{status}</Tag> 
    },
    {
      title: '',
      dataIndex: 'optional',
      width: '10%',
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
            scroll={{ x: '110vh' }}
            columns={columns}
            rowKey={(record: any) => record._id}
            dataSource={dataUser}
            size='small'
            pagination={pagination}
            onChange={handleTableChange}
          />
        </Spin>
      </div>
      <AccountModal
        visible={isModalVisible}
        setVisible={setIsModalVisible}
        userData={userData}
      />
      <Modal
        open={visibleModalConfirm}
        centered
        onCancel={() => setVisibleModalConfirm(false)}
        onOk={handleInactive}
      >
      <div className={styles.headerConfirm}>
          <Svg className={styles.iconWarning} src={iconWarning} alt="icon warning" />
          <span className={styles.title}>Are you sure to INACTIVE this account?</span>
      </div>
      </Modal>
      <ModalChangeDepartment
        visible={visibleModalChangeDepartment}
        setVisible={setVisibleModalChangeDepartment}
        user={recordChange}
        refetch={refetch}
        setRecord={setRecordChange}
      />
    </>  
  )
}

export default TableAccount