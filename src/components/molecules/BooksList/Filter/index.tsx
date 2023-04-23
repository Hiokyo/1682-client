import React, { useCallback, useMemo, useState } from 'react';
import { Button, Form } from 'antd';
import { Option } from '~/components/atoms/Select';
import { PARAMS_GET_ALL_NAME, SortBooks } from '~/utils/constant';

import Svg from '~/components/atoms/Svg';
import loadable from '~/utils/loadable';
import iconPlus from '~/assets/images/iconPlus.svg';

import styles from './styles.module.scss';
import { useCategories } from '~/hooks/useCategory';
import Input from '~/components/atoms/Input';

const Select = loadable(() => import('~/components/atoms/Select'));
const ModalBooks = loadable(() => import('~/components/molecules/BooksList/ModalBooks'));

interface Props {
  afterSuccess?: () => void;
  onChange: (value: any) => void;
}

const Filter = (props: Props) => {
  const {afterSuccess, onChange} = props;

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  
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

  const sortOption = useMemo(() => Object.entries(SortBooks)
  // render options sort by
  .map((item: any, index) => (
    { id: index, name: item[1], value: item[0] }
  )), []);
  
  const showAddModal = () => {
    setIsModalVisible(true);
  };

  const handleValuesChange = useCallback((_: any, formValues: any) => {
    onChange(formValues);
  }, [onChange]);
  

  return (
    <>
      <div className={styles.container}>
        <div className={styles.contentWrapper}
        >
          <div className={styles.optionsWrapper}>
            <Form
              form={form}
              onValuesChange={handleValuesChange}
              initialValues={{
                sort: sortOption[6].value
              }}
            >
              <div className={styles.filterWrapper}>
                <Form.Item name='sort'>
                  <Select
                    className={styles.selectSort}
                    placeholder="Sort books"
                  >
                  {sortOption?.map((item: any) =>
                    <Option key={item.id} value={item.value}>{item.name}</Option>
                  )}
                  </Select>
                </Form.Item>
                <Form.Item name='topics'>
                  <Select
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
                <Form.Item name='keyword'>
                  <Input
                    autoComplete='off'
                    placeholder="Search"
                  />
                </Form.Item>
              </div>
            </Form>
            <Button className={styles.btnAdd} type="primary" onClick={showAddModal}>
              <Svg className={styles.iconPlus} src={iconPlus} alt="iconPlus" />
            </Button>
          </div>
        </div>
      </div>
      <ModalBooks
        visible={isModalVisible}
        setVisible={setIsModalVisible}
        afterSuccess={afterSuccess}
      />
    </>
  );
};

export default Filter;
