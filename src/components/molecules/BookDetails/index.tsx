import React, { useEffect, useMemo, useRef, useState } from 'react'
import Filter from './Filter';
import {
  Avatar,
  Card,
  Form,
  List,
  Spin,
  Statistic,
  Typography,
  message } from 'antd';
import { format } from 'date-fns';
import { DATE, SUCCESS } from '~/utils/constant';
import { MessageOutlined, EyeOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import styles from './styles.module.scss';
import { setComment, viewBook } from '~/api/book';
import { useBookDetail } from '~/hooks/useBooks';
import { TextArea } from '~/components/atoms/Input';
const { Title } = Typography;
interface Props {
  bookId: any;
}

const BookDetails = (props: Props) => {
  const { bookId } = props;
  const {data, isFetching, isLoading, refetch} = useBookDetail({bookId});
  const dataBook = data?.data;
  const [showComment, setShowComment] = useState(false);
  const [pageContent, setPageContent] = useState([])
  const [form] = Form.useForm();

  const handleShowComment = () => {
    setShowComment(!showComment)
    form.resetFields()
  }

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      form.submit();
    }
  }
  
  const handleComment = async (formValues: any) => {
    const res = await setComment(bookId, formValues);
    if (res.message === SUCCESS) {
      message.success('Comment success')
      refetch()
      form.resetFields()
    } else {
      message.error(res.message)
    }
  }

  const contentChapter = (chapterId: string) => {
    if (dataBook && chapterId) {
      return (dataBook.chapters?.find((item: any) => item._id === chapterId))?.content
    }
  }

  const handleGetContentpage  =  (chapterId: string) => {
    const regex = /(\S+\s*){1,30}/g;
    const substrings =  contentChapter(chapterId)?.match(regex);
    setPageContent(substrings)
  }
  // Api count view

  // useEffect(() => {
  //   if (bookId) {
  //     viewBook(bookId)
  //   }
  // }, [bookId])

  return (
    <>
      <Spin spinning={isLoading || isFetching}>
        <Filter
        />
        <div
          className={styles.container}
        >
          <div className={styles.contentWrapper}>
            <div className={styles.infoContainer}>
            <div>
              <Card
                className='mt-2'
                headStyle={{border: 'none'}}
                actions={[ 
                  <Statistic
                    value={dataBook?.commentsCount}
                    valueStyle={{fontSize: '16px'}}
                    prefix={
                      <MessageOutlined 
                        onClick={() => handleShowComment()}
                      />
                    } 
                  />,
                ]}
                extra={
                  <div className={styles.extraGroup}>
                    <EyeOutlined /> {dataBook?.viewCount}
                  </div>

                }
              >
                <Meta
                  avatar={<Avatar size={42} src={'https://joesch.moe/api/v1/random'}/>}
                  title={dataBook?.title}
                  description={(
                    <div 
                      className={styles.userIdea}
                    >
                      {dataBook?.updatedBy?.firstName} {dataBook?.updatedBy?.lastName} 
                      &nbsp;-&nbsp;
                      {dataBook ? format(new Date(dataBook?.createdAt), DATE) : '-'}
                    </div>
                  )}
                />
                <List
                  className={styles.listChapter}
                  grid={{ gutter: 16, column: 5 }}
                  dataSource={dataBook?.chapters}
                  renderItem={(item: any) => (
                    <List.Item>
                      <Card
                        onClick={() => handleGetContentpage(item._id)}
                        hoverable
                        cover={
                          <img
                            alt="example"
                            src="https://picsum.photos/300/200"
                          />
                        }
                      >
                        <Title level={4}>{item.name}</Title>
                        <p>{format(new Date(item?.createdAt), DATE)}</p>
                      </Card>
                    </List.Item>
                  )}
                />
              </Card>
              
              { showComment &&
                <div className={styles.commentContainer}>
                {dataBook?.comments?.map((comment: any) =>
                  <Meta
                    key={comment._id}
                    className={styles.comment}
                    avatar={<><Avatar src={'https://joesch.moe/api/v1/random'}/> <strong>{comment.createdBy?.firstName} {comment.createdBy?.lastName}</strong></>}
                    description={<p className={styles.commentContent}>{comment.content}</p>}
                  />
                  ) 
                }
                  <div className={styles.commentArea}>
                  <Form
                    form={form}
                    layout='vertical'
                    onFinish={handleComment}
                  >
                    <Form.Item
                      name='content'
                    >
                      <TextArea
                        className='mt-2'
                        placeholder='Enter your comment'
                        onKeyPress={(e: any) => handleKeyPress(e)}
                      />
                    </Form.Item>
                  </Form>
                  </div>
                </div>
              }
            </div> 
            </div>
          </div>
          <Card
          >
          </Card>
        </div>
        
      </Spin>
    </>
  )
}

export default BookDetails