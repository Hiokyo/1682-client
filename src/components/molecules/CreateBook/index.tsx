import React, { useState } from 'react';

import { Button, Form, Input, message } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TextEditor from '~/components/atoms/TextEditor';
import styles from './styles.module.scss'
import Svg from '~/components/atoms/Svg';
import iconPlus from '~/assets/images/iconPlus.svg';
import { DeleteOutlined } from '@ant-design/icons';
import FormBook from './Filter';
import { createBook } from '~/api/book';
import { SUCCESS } from '~/utils/constant';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '~/routes';
import { registerForAuthor } from '~/api/registerAuthor';

const CreateBooks = () => {
const [form] = Form.useForm();
const [bookInfo, setBookInfo] = useState<any>(null);
const navigate = useNavigate();

const handleSave = async (formValues: any) => {
  let res: any = null;
  if (formValues && bookInfo.message) {
    const fmData = {
      ...bookInfo,
      chapters: formValues.chapters,
      message: bookInfo.message,
    }
    console.log(fmData)
    res = registerForAuthor(fmData);
  } else if (formValues && bookInfo) {
    const fmData = {
      ...bookInfo,
      chapters: formValues.chapters,
    }
    res = await createBook(fmData);
  }
  if (res.message === SUCCESS) {
    message.success({
      content: !bookInfo.message ? 'Create book successfully' : 'Create book successfully, please wait for admin to approve',
    });
    form.resetFields();
    navigate(ROUTES.Books) 
  } else {
    message.error('Create book failed');
  }
}

const handleGetBookInfo = (value: any) => {
  setBookInfo(value)
};

return (
  <div className={styles.container}>
    <FormBook
      onChange={handleGetBookInfo}
    />
    <Form
      form={form}
      layout='vertical'
      onFinish={handleSave}
    >
      <div className={styles.listChapter}>
        <Form.List
          name='chapters'
        >
          {(fields, { add, remove }) => (
            <>
              {fields?.map((value, index) => (
                <div key={value.key}>
                  <div className={styles.titleWrapper}>
                    <div className={styles.titleSituation}>{`Chapter ${index + 1}`}</div>
                    <div>
                      {(fields.length > 1) ?
                        <a className='cursor-pointer' onClick={() => remove(value.name)} ><DeleteOutlined style={{fontSize: 20}} /></a>
                        :
                        <a className='cursor-not-allowed'  ><DeleteOutlined style={{fontSize: 20}} /></a>
                      }
                    </div>
                  </div>
                  <Form.Item
                    name={[value.name, 'name']}
                    rules={[
                      { required: true, message: '' },
                    ]}
                  >
                    <Input
                      placeholder='Chapter name'
                    />
                  </Form.Item>
                  <Form.Item
                    name={[value.name, 'content']}
                    className={styles.multiEditor}
                  >
                    <TextEditor className={index} />
                  </Form.Item>
                </div>
              ))}
              <div className={styles.btnAddContainer}>
                  <Button
                    onClick={() => add()}
                    className={styles.btnAdd}
                    type='primary'
                  >
                    <Svg src={iconPlus} alt='union' className={styles.union} />
                    {'Add chapter'}
                  </Button>
              </div>
            </>
          )}
        </Form.List>
      </div>
      <div className={styles.btnGroup}>
        <Button
          htmlType='submit'
        >
          {'Create'}
        </Button>
      </div>
    </Form>
  </div>
);
}

export default CreateBooks