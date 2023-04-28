import React, { useMemo, useState } from 'react'
import { NAME_ASC, PARAMS_FILTER } from '~/utils/constant';
import PaymentAdminTable from './PaymentAdminTable';

import { Button, Form, Select } from 'antd';
import { Option } from '~/components/atoms/Select';

import styles from './styles.module.scss'
import { PaymentSort } from '~/utils/constant';
import Input from '~/components/atoms/Input';
import { usePaymentAdmin } from '~/hooks/usePaymentAdmin';

const PaymentsAdmin = () => {
  const [filterValue, setFilterValue] = useState({
    ...PARAMS_FILTER,
    sort: 'DATE_CREATED_DESC'
  })
  
  const { data, isLoading, isFetching, refetch } = usePaymentAdmin(filterValue);
  const [form] = Form.useForm();
  
  const sortOption = useMemo(() => Object.entries(PaymentSort)
  // render options sort by
  .map((item: any, index) => (
    { id: index, name: item[1], value: item[0] }
  )), []);

  const handleFilter = (value: any) => {
    setFilterValue({
      sort: 'DATE_CREATED_DESC',
      ...PARAMS_FILTER,
      ...value
    })
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.optionsWrapper}>
              <Form
                form={form}
                onValuesChange={handleFilter}
                initialValues={{
                  sort: sortOption[2].value
                }}
              >
                <div className={styles.filterWrapper}>
                  <Form.Item name='sort'>
                    <Select
                      className={styles.selectSort}
                      placeholder="Sort payment"
                    >
                    {sortOption?.map((item: any) =>
                      <Option key={item.id} value={item.value}>{item.name}</Option>
                    )}
                    </Select>
                  </Form.Item>
                  {/* <Form.Item name='type'>
                    <Select
                      className={styles.selectSort}
                      placeholder="Type"
                      mode="multiple"
                    >
                      {categoryOptions?.map((item: any) => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item> */}
                  <Form.Item name='keyword'>
                    <Input
                      className={styles.keyword}
                      autoComplete='off'
                      placeholder="Search"
                    />
                  </Form.Item>
                </div>
            </Form>
          </div>
        </div>
      </div>
      <PaymentAdminTable  
        payments={data?.data}
        refetch={refetch}  
        isLoading={isLoading}
        isFetching={isFetching}
      />
    </>
  )
}

export default PaymentsAdmin