import React, { useCallback, useMemo, useState } from 'react';
import { Button, Form } from 'antd';
import { Option } from '~/components/atoms/Select';
import { SortAccount } from '~/utils/constant';

import Svg from '~/components/atoms/Svg';
import loadable from '~/utils/loadable';
import iconPlus from '~/assets/images/iconPlus.svg';

import styles from './styles.module.scss';

const Select = loadable(() => import('~/components/atoms/Select'));
const AccountModal = loadable(() => import('~/components/molecules/SystemSetting/ModalAccount'));

interface Props {
  afterSuccess?: () => void;
  onChange: (value: any) => void;
}

const Filter = (props: Props) => {
  const {afterSuccess, onChange} = props;
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const sortOption = useMemo(() => Object.entries(SortAccount)
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
      <div className={styles.memberHead}>
        <div className={styles.contentWrapper}
        >
          <div className={styles.optionsWrapper}>
            <Form
              form={form}
              onValuesChange={handleValuesChange}
            >
              <div className={styles.filterWrapper}>
                <Form.Item name='sort'>
                  <Select
                    className={styles.selectProject}
                    placeholder='Sort account'
                  >
                    {sortOption?.map((item: any) =>
                      <Option key={item.id} value={item.value}>{item.name}</Option>
                    )}
                  </Select>
                </Form.Item>
              </div>
            </Form>
              <Button className={styles.btnAdd} type="primary" onClick={showAddModal}>
                <Svg className={styles.iconPlus} src={iconPlus} alt="iconPlus" />
              </Button>
          </div>
        </div>
      </div>
      <AccountModal
        visible={isModalVisible}
        setVisible={setIsModalVisible}
        afterSuccess={afterSuccess}
      />
    </>
  );
};

export default Filter;
