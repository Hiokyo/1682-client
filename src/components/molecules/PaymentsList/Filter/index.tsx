import React, { useCallback, useMemo, useState } from 'react'

import { Button, Form, Select } from 'antd';
import { Option } from '~/components/atoms/Select';

import styles from './styles.module.scss'
import { PaymentSort, SortBooks, SortReports } from '~/utils/constant';
import Input from '~/components/atoms/Input';

interface Props {
  refetch: () => void;
  onChange: (value: any) => void;
}

const Filter = (props: Props) => {
  const {refetch, onChange} = props;
  const [form] = Form.useForm();
  
  const sortOption = useMemo(() => Object.entries(PaymentSort)
  // render options sort by
  .map((item: any, index) => (
    { id: index, name: item[1], value: item[0] }
  )), []);

  const handleValuesChange = useCallback((_: any, formValues: any) => {
    onChange(formValues);
  }, [onChange]);
  
  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.optionsWrapper}>
            <Form
              form={form}
              onValuesChange={handleValuesChange}
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
  )
}

export default Filter