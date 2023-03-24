import React, { useEffect, useState } from 'react'
import Filter from './Filter';
import { Avatar, Button, Card, Descriptions, Form, List, Popover, Spin, Statistic } from 'antd';
import { compareAsc, format } from 'date-fns';
import { DATE } from '~/utils/constant';
import { MessageOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import styles from './styles.module.scss';
import { DownloadOutlined } from '@ant-design/icons'
import { viewBook } from '~/api/book';

interface Props {
  bookId: any;
}

const BookDetails = (props: Props) => {
  const { bookId } = props;

  // Api count view

  // useEffect(() => {
  //   if (bookId) {
  //     viewBook(bookId)
  //   }
  // }, [bookId])
  
  const [files, setFiles] = useState([
    {
      name: 'test',
      url: 'https://firebasestorage.googleapis.com/v0/b/project-1300899936117119693.appspot.com/o/files%2FJD_Frontend-Developer_ORAICHAIN.pdf?alt=media&token=67c3571b-75e7-424d-b4c8-371a1d0c2c18'
    },
    {
      name: 'test2',
      url: 'https://firebasestorage.googleapis.com/v0/b/project-1300899936117119693.appspot.com/o/files%2FJD_Frontend-Developer_ORAICHAIN.pdf?alt=media&token=67c3571b-75e7-424d-b4c8-371a1d0c2c18'
    },
    {
      name: 'test3',
      url: 'https://firebasestorage.googleapis.com/v0/b/project-1300899936117119693.appspot.com/o/files%2FJD_Frontend-Developer_ORAICHAIN.pdf?alt=media&token=67c3571b-75e7-424d-b4c8-371a1d0c2c18'
    },
    {
      name: 'test4',
      url: 'https://firebasestorage.googleapis.com/v0/b/project-1300899936117119693.appspot.com/o/files%2FJD_Frontend-Developer_ORAICHAIN.pdf?alt=media&token=67c3571b-75e7-424d-b4c8-371a1d0c2c18'
    }
  ]);

  return (
    <>
      <Filter/>
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
                  value={0}
                  valueStyle={{fontSize: '16px'}}
                  prefix={
                    <MessageOutlined 
                      // onClick={() => handleShowComment(item._id)}
                    />
                  } 
                />,
              ]}
              // extra={format(new Date(item.createdAt), DATE)}
            >
              <Meta
                avatar={<Avatar size={42} src={'https://joesch.moe/api/v1/random'}/>}
                title={
                  // <a href={item.href}>{item.title}</a>
                 ' ABC'
                }
                description={(
                  <>
                    <div className={styles.userIdea}>{'Hieu tran'}</div>
                    <div>{'item.description'}</div>
                  </>
                )}
              />
              {'item.content'}
            </Card>
            
            {/* { showCommentMap[item._id] &&
              <Spin spinning={isLoadingComment}>
                <div className={styles.commentContainer}>
                {item?.comments?.map((comment: any) =>
                  <Meta
                    key={comment._id}
                    className={styles.comment}
                    avatar={<><Avatar src={'https://joesch.moe/api/v1/random'}/> <strong>{comment.createdBy?.firstName} {comment.createdBy?.lastName}</strong></>}
                    description={<p className={styles.commentContent}>{comment.content}</p>}
                  />
                  ) 
                }
                { (compareAsc(new Date(item?.thread?.finalClosureDate), new Date()) >= 0 ) ?
                  <div className={styles.commentArea}>
                  <Form
                    form={form}
                    layout='vertical'
                    onFinish={handleComment}
                    key={item._id}
                  >
                    <Form.Item
                      name='content'
                    >
                      <TextArea
                        className='mt-2'
                        placeholder='Enter your comment'
                        onKeyPress={(e: any) => handleKeyPress(e, item._id)}
                      />
                    </Form.Item>
                  </Form>
                  </div>
                  : null
                }
                </div>
              </Spin>
            } */}
          </div> 
          </div>
            {/* Idea{props?.ideaId} */}
        </div>
          <Card className={styles.listFile}>
          <Button className={styles.btnAdd}>
            <DownloadOutlined />
            Download file
          </Button>
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={files}
            renderItem={(item) => (
              <List.Item>
                <Card 
                  title={item.name}
                >
                  Card content
                </Card>
              </List.Item>
            )}
          />
          </Card>
      </div>
    </>
  )
}

export default BookDetails