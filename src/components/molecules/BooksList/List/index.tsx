import React, { useEffect, useState } from 'react'
import { Avatar, Card, Dropdown, Form, List, MenuProps, Popover, Statistic, Tag, message } from 'antd'
import {
  LikeOutlined,
  MessageOutlined,
  DislikeOutlined,
  MoreOutlined,
  LikeTwoTone,
  DislikeTwoTone} from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import loadable from '~/utils/loadable';

import { compareAsc, format } from 'date-fns';
import { DATE, SUCCESS } from '~/utils/constant';
import { setComment, updateAction } from '~/api/book';
import { useAppSelector } from '~/store';
import Input, { TextArea } from '~/components/atoms/Input';
import styles from './styles.module.scss'
import { Link } from 'react-router-dom';
import TopicTag from '~/components/atoms/TopicTag';
import Modal from '~/components/atoms/Modal';
import { createReport } from '~/api/report';

const Spin = loadable(() => import('~/components/atoms/Spin'));
interface Prop {
  dataBooks?: any;
  isLoading?: boolean;
  isFetching?: boolean;
  refetch: () => void;
}

const BookList = (props: Prop) => {
  const {dataBooks, isFetching, isLoading, refetch} = props;
  const userData = useAppSelector((state) => state.userInfo.userData);
  const [form] = Form.useForm();
  const [formReport] = Form.useForm();

  const [showCommentMap, setShowCommentMap] = useState<any>({});
  const [bookId, setBookId] = useState('');
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const [dataSource, setDataSource] = useState<any>([]);
  const [visibleModalReport, setVisibleModalReport] = useState(false);
  const [idBookReported, setIdBookReported] = useState('');

  useEffect(() => {
    if (dataBooks){
      setDataSource(dataBooks)
    }
  }, [dataBooks])
  
  const handleShowComment = (itemId: string) => {
    setShowCommentMap({
      // ...showCommentMap,
      [itemId]: !showCommentMap[itemId]
    })
    form.resetFields()
    setIsLoadingComment(true)

    setTimeout(() => {
      setIsLoadingComment(false)
    }, 1000)
  }

  const handleLike_Dislike = async (itemId: string, action: string) => {
    const postIndex = dataSource.findIndex((item: any) => item._id === itemId);
    if (postIndex === -1) return;
    const post = dataSource[postIndex];
    let newLike = post.likeCount;
    let newDislike = post.dislikeCount;
    let updatedLike = post.like ? [...post.like] : [];
    let updatedDislike = post.dislike ? [...post.dislike] : [];

    const userLiked = updatedLike.find(
      (item: any) => item.user?._id === userData?._id
    );
    const userDisliked = updatedDislike.find(
      (item: any) => item.user?._id === userData?._id
    );

    if (action === "like") {
      if (!userLiked && !userDisliked) {
        newLike += 1;
        updatedLike.push({ user: { _id: userData?._id } });
      } else if (userLiked) {
        newLike -= 1;
        const userIndex = updatedLike.findIndex(
          (item: any) => item.user?._id === userData?._id
        );
        updatedLike.splice(userIndex, 1);
      } else if (!userLiked && userDisliked) {
        newLike += 1;
        newDislike -= 1;
        const userIndex = updatedDislike.findIndex(
          (item: any) => item.user?._id === userData?._id
        );
        updatedDislike.splice(userIndex, 1);
        updatedLike.push({ user: { _id: userData?._id } });
      }
    } else {
      if (!userLiked && !userDisliked) {
        newDislike += 1;
        updatedDislike.push({ user: { _id: userData?._id } });
      } else if (userDisliked) {
        newDislike -= 1;
        const userIndex = updatedDislike.findIndex(
          (item: any) => item.user?._id === userData?._id
        );
        updatedDislike.splice(userIndex, 1);
      } else if (userLiked && !userDisliked) {
        newLike -= 1;
        newDislike += 1;
        const userIndex = updatedLike.findIndex(
          (item: any) => item.user?._id === userData?._id
        );
        updatedLike.splice(userIndex, 1);
        updatedDislike.push({ user: { _id: userData?._id } });
      }
    }

    const updatedPost = {
      ...post,
      likeCount: newLike,
      dislikeCount: newDislike,
      like: updatedLike.length > 0 ? updatedLike : undefined,
      dislike: updatedDislike.length > 0 ? updatedDislike : undefined,
    };

    const newDataSourse = [...dataSource];
    newDataSourse[postIndex] = updatedPost;
    setDataSource(newDataSourse);

    const res = await updateAction(itemId, action)
    if (res.message === SUCCESS) {
      const updatedData = [...dataSource];
      updatedData[postIndex] = res?.data;
      setDataSource(updatedData)
    }
  };
  
  // // console.log(dataSource)
  // const handleLike_Dislike = async (itemId: string, action: string) => {
  //   const res = await updateAction(itemId, action)
  //   if (res.message === SUCCESS) {
  //     refetch()
  //   }
  // }

  const handleKeyPress = (event: any, bookId: string) => {
    setBookId(bookId)
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

  const handleShowModalReportBook = (bookId: string) => {
    setVisibleModalReport(true)
    setIdBookReported(bookId)
  }
  
  const handleReportBook = async (value: any) => {
    if ((value.trim().length === 0)){
      return message.warning('Please enter reason!')
    }
    if(idBookReported) {
      const fmData = {
        title: 'Report',
        type: 'REPORT',
        schema: 'books',
        schemaId: idBookReported,
        content: value
      }
      const res = await createReport(fmData)
      if (res.message === SUCCESS) {
        message.success('Report novel success')
        setVisibleModalReport(false)
      } else {
        message.error(res.message)
      }
    }
  }
  
  return (
    <Spin spinning={isLoading || isFetching}>
      <List
        className={styles.listContainer}
        itemLayout="vertical"
        size="small"
        style={{ maxHeight: '60vh', overflowY: 'scroll' }}
        dataSource={dataSource}
        renderItem={(item: any) => (
          <div key={item._id}>
            <Card
              className='mt-2'
              headStyle={{border: 'none'}}
              actions={[
                <Statistic 
                  value={item?.likeCount}
                  prefix={
                    item.like?.find((e: any) => e.user?._id === userData?._id) ?
                    <Popover
                      trigger={'hover'}
                      content={(
                        item.like?.map((userLike: any) => 
                          <div key={userLike.user._id}>
                            {userLike.user.firstName} {userLike.user.lastName}
                          </div>
                        )
                      )}
                    >
                      <LikeTwoTone
                        onClick={() => handleLike_Dislike(item._id, 'like')}
                      />
                    </Popover>
                    :
                    <Popover
                      trigger={'hover'}
                      content={(
                        item.like?.map((userLike: any) => 
                          <div key={userLike.user._id}>
                            {userLike.user.firstName} {userLike.user.lastName}
                          </div>
                        )
                      )}
                    >
                      <LikeOutlined
                        onClick={() => handleLike_Dislike(item._id, 'like')}
                      />
                    </Popover>
                  }
                  valueStyle={{fontSize: '16px'}}
                />,
                <Statistic
                  value={item.dislikeCount}
                  prefix={
                    item.dislike?.find((e: any) => e.user?._id === userData?._id) ?
                    <Popover
                      trigger={'hover'}
                      content={(
                        item.dislike?.map((userDislike: any) => 
                          <div key={userDislike.user._id}>
                            {userDislike.user.firstName} {userDislike.user.lastName}
                          </div>
                        )
                      )}
                    >
                      <DislikeTwoTone
                        onClick={() => handleLike_Dislike(item._id, 'dislike')}
                      />
                    </Popover>
                    :
                    <Popover
                      trigger={'hover'}
                      content={(
                        item.dislike?.map((userDislike: any) => 
                          <div key={userDislike.user._id}>
                            {userDislike.user.firstName} {userDislike.user.lastName}
                          </div>
                        )
                      )}
                    >
                      <DislikeOutlined 
                        onClick={() => handleLike_Dislike(item._id, 'dislike')}
                      />
                    </Popover>
                  }
                  valueStyle={{fontSize: '16px'}}
                />,
                <Statistic
                  value={item.commentCount}
                  valueStyle={{fontSize: '16px'}}
                  prefix={
                    <MessageOutlined 
                      onClick={() => handleShowComment(item._id)}
                    />
                  } 
                />,
              ]}
              extra={
                <div className='d-flex'>
                  <div className='mr-2'>
                    {format(new Date(item.createdAt), DATE)}
                  </div>
                  <Dropdown
                    className={styles.dropDown}
                    menu={
                      { 
                        items: [
                          {
                            label: <div onClick={() => handleShowModalReportBook(item._id)}>Report novel</div>,
                            key: '0',
                          },
                          {
                            label: <a href="https://www.aliyun.com">2nd menu item</a>,
                            key: '1',
                          },
                        ]  
                      }
                    } 
                    trigger={['click']}
                  >
                    <MoreOutlined style={{fontSize: 16}} />
                  </Dropdown>
                </div>
              }
            >
              <Meta
                avatar={<Avatar size={42} src={'https://joesch.moe/api/v1/random'}/>}
                title={
                  // <a href={item.href}>{item.title}</a>
                  <Link
                    to={`/books/lists/${item._id}`}
                  >
                    {item.title} {`(${item.chapterCount} Chapter)`}
                  </Link>
                }
                description={(
                  <>
                    <div className={styles.userIdea}>{item.updatedBy?.firstName} {item.updatedBy?.lastName}</div>
                    <div>{item.description}</div>
                  </>
                )}
              />
              <div className={styles.topic}>
                {
                  item.topics?.map((topic: any) => (
                    <TopicTag key={topic._id} topic={topic}/>
                  ))
                }
              </div>

            </Card>
            
            { showCommentMap[item._id] &&
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
                </div>
              </Spin>
            }
          </div>
        )}
      />
      <Modal
        width={460}
        centered
        open={visibleModalReport}
        footer={false}
        closable={false}
        maskClosable
        onCancel={() => setVisibleModalReport(false)}
        className={styles.modalContainer}
      >
        <div>
          <h3>Report Novel</h3>
        </div>
        <Form
          form={formReport}
          layout='vertical'
        >
          <Form.Item
            name='content'
            label='Reason'
            rules={[
              {
                required: true,
                message: ''
              }
            ]}
          >
            <Input
              placeholder='Reason'
              onPressEnter={(e: any) => handleReportBook(e.target?.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Spin>
  )
}

export default BookList