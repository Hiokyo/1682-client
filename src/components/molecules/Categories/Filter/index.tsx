import React, { useCallback, useState } from 'react'
import { Button, Form, Input } from 'antd'

import Svg from '~/components/atoms/Svg'
import iconPlus from '~/assets/images/iconPlus.svg'

import styles from './styles.module.scss'
import CategoryModal from '../CategoryModal'

interface Props {
  refetch: () => void;
  onChange: (value: any) => void;
}

const Filter = (props: Props) => {
  const {refetch, onChange} = props;
  const [ isModalVisible, setIsModalVisible ] = useState(false);
  const [form] = Form.useForm();

  const handleValuesChange = useCallback((_: any, formValues: any) => {
    onChange(formValues);
  }, [onChange]);
  
  return (
    <div className={styles.filterContainer}>
        {/* <div className={styles.titleHead}>Category</div> */}
        <Form
          form={form}
          onValuesChange={handleValuesChange}
          style={{height: 32}}
        >
          <div className={styles.filterWrapper}>
            <Form.Item name='keyword'>
              <Input
                autoComplete='off'
                placeholder="Search"
              />
            </Form.Item>
          </div>
        </Form>
        <div>
          <Button
            className={styles.btnAdd}
            type="primary"
            onClick={() => setIsModalVisible(true)}
          >
            <Svg className={styles.icon} src={iconPlus} />
            Add category
          </Button>
        </div>
      <CategoryModal
        refetch={refetch}
        visible={isModalVisible}
        setVisible={setIsModalVisible}
      />
    </div>
  )
}

export default Filter