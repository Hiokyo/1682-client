import React, { useCallback, useMemo } from 'react';
import Select from '~/components/atoms/Select';
import { useCategories } from '~/hooks/useCategory';
import { PARAMS_GET_ALL_NAME } from '~/utils/constant';
import { Option } from '~/components/atoms/Select';
import styles from './styles.module.scss';
import { Button, Form, Input } from 'antd';


interface Props {
  afterSuccess?: () => void;
  onChange: (value: any) => void;
}

const FormBook = (props: Props) => {
  const {afterSuccess, onChange} = props;
  const [form] = Form.useForm();
  
  const { data } = useCategories(PARAMS_GET_ALL_NAME);

  const dataCategories = data?.data?.topics;
  const categoryOptions = useMemo(
    () =>
      // render options campaign
      dataCategories?.map((item: any) => ({
        id: item._id,
        name: item.name,
      })),
    [dataCategories]
  );


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
          >
            <div className={styles.filterWrapper}>
              <Form.Item name='title'>
                <Input
                  placeholder='Book title'
                />
              </Form.Item>
              <Form.Item name='topics'>
                <Select
                  maxTagCount='responsive'
                  className={styles.selectSort}
                  placeholder="Category"
                  mode="multiple"
                >
                  {categoryOptions?.map((item: any) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default FormBook