import React, { useEffect, useState } from 'react'
import { Avatar, Card, Dropdown, Form, List, Popover, Statistic, Tag, message } from 'antd'
import {
  LikeOutlined,
  MessageOutlined,
  DislikeOutlined,
  CheckOutlined,
  CloseOutlined,
  EllipsisOutlined,
  LikeTwoTone,
  DislikeTwoTone
} from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import loadable from '~/utils/loadable';

import { compareAsc, format } from 'date-fns';
import { DATE, SUCCESS } from '~/utils/constant';
import { useAppSelector } from '~/store';
import { TextArea } from '~/components/atoms/Input';
import styles from './styles.module.scss'
import { Link } from 'react-router-dom';

import ModalEditComment from '~/components/atoms/ModalEditComment';
import { usePostByUser } from '~/hooks/useUser';
import ImageList from '../../PostsList/ImageList';
import ModalPost from '../../PostsList/PostModal';
import { deletePostComment, setCommentPost, updateActionPost } from '~/api/post';

const Spin = loadable(() => import('~/components/atoms/Spin'));

interface Props {
  data?: any;
}

const Post = (props: Props) => {
  const { data } = props;
  const userId = data?._id;
  const { data: dataPosts, isFetching, isLoading, refetch } = usePostByUser({ userId: userId })
  const [showCommentMap, setShowCommentMap] = useState<any>({})
  const [postId, setPostId] = useState('')
  const [isLoadingComment, setIsLoadingComment] = useState(false)
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<any>([]);
  const [itemEditComment, setItemEditComment] = useState<any>({});
  const [visibleModalEditComment, setVisibleModalEditComment] = useState(false);

  const [visibleModalEditPost, setVisibleModalEditPost] = useState(false);
  const [postEditing, setPostEditing] = useState({});

  const userData = useAppSelector((state) => state.userInfo.userData);

  useEffect(() => {
    if (dataPosts?.data) {
      setDataSource(dataPosts.data)
    }
  }, [dataPosts])

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
      (item: any) => item.user?._id === userId
    );
    const userDisliked = updatedDislike.find(
      (item: any) => item.user?._id === userId
    );

    if (action === "like") {
      if (!userLiked && !userDisliked) {
        newLike += 1;
        updatedLike.push({ user: { _id: userId } });
      } else if (userLiked) {
        newLike -= 1;
        const userIndex = updatedLike.findIndex(
          (item: any) => item.user?._id === userId
        );
        updatedLike.splice(userIndex, 1);
      } else if (!userLiked && userDisliked) {
        newLike += 1;
        newDislike -= 1;
        const userIndex = updatedDislike.findIndex(
          (item: any) => item.user?._id === userId
        );
        updatedDislike.splice(userIndex, 1);
        updatedLike.push({ user: { _id: userId } });
      }
    } else {
      if (!userLiked && !userDisliked) {
        newDislike += 1;
        updatedDislike.push({ user: { _id: userId } });
      } else if (userDisliked) {
        newDislike -= 1;
        const userIndex = updatedDislike.findIndex(
          (item: any) => item.user?._id === userId
        );
        updatedDislike.splice(userIndex, 1);
      } else if (userLiked && !userDisliked) {
        newLike -= 1;
        newDislike += 1;
        const userIndex = updatedLike.findIndex(
          (item: any) => item.user?._id === userId
        );
        updatedLike.splice(userIndex, 1);
        updatedDislike.push({ user: { _id: userId } });
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

    const res = await updateActionPost(itemId, action)
    if (res.message === SUCCESS) {
      const updatedData = [...dataSource];
      updatedData[postIndex] = res?.data;
      setDataSource(updatedData)
    }
  };

  const handleKeyPress = (event: any, postId: string) => {
    setPostId(postId)
    if (event.key === "Enter") {
      form.submit();
    }
  }

  const handleComment = async (formValues: any) => {
    const res = await setCommentPost(postId, formValues);
    if (res.message === SUCCESS) {
      message.success('Comment success')
      refetch()
      form.resetFields()
    } else {
      message.error(res.message)
    }
  }

  const handleEditComment = (postId: string, commentId: string) => {
    setItemEditComment({
      postId,
      commentId
    })
    setVisibleModalEditComment(true)
  }

  const handleDeleteComment = async (postId: string, commentId: string) => {
    const res = await deletePostComment(postId, commentId);
    if (res.message === SUCCESS) {
      message.success('Delete comment succes')
      refetch();
    } else {
      message.error(res.message)
    }
  }
  const handleEditPost = (post: any) => {
    setVisibleModalEditPost(true)
    setPostEditing(post)
  }
  console.log(dataSource)
  return (
    <Spin spinning={isLoading || isFetching}>
      <List
        className={styles.listContainer}
        itemLayout="vertical"
        size="small"
        style={{ maxHeight: '49vh', overflowY: 'scroll' }}
        dataSource={dataSource}
        renderItem={(item: any) => (
          <div key={item._id}>
            <Card
              className='mt-2'
              headStyle={{ border: 'none' }}
              actions={[
                <Statistic
                  value={item?.likeCount}
                  prefix={
                    item.like?.find((e: any) => e.user?._id === userId) ?
                      <Popover
                        trigger={'hover'}
                        content={(
                          item.like?.map((userLike: any) =>
                            <div key={userLike.user?._id}>
                              {userLike.user?.firstName} {userLike.user?.lastName}
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
                            <div key={userLike.user?._id}>
                              {userLike?.user?.firstName} {userLike?.user?.lastName}
                            </div>
                          )
                        )}
                      >
                        <LikeOutlined
                          onClick={() => handleLike_Dislike(item._id, 'like')}
                        />
                      </Popover>
                  }
                  valueStyle={{ fontSize: '16px' }}
                />,
                <Statistic
                  value={item.dislikeCount}
                  prefix={
                    item.dislike?.find((e: any) => e.user?._id === userId) ?
                      <Popover
                        trigger={'hover'}
                        content={(
                          item.dislike?.map((userDislike: any) =>
                            <div key={userDislike.user?._id}>
                              {userDislike.user?.firstName} {userDislike.user?.lastName}
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
                            <div key={userDislike.user?._id}>
                              {userDislike.user?.firstName} {userDislike.user?.lastName}
                            </div>
                          )
                        )}
                      >
                        <DislikeOutlined
                          onClick={() => handleLike_Dislike(item._id, 'dislike')}
                        />
                      </Popover>
                  }
                  valueStyle={{ fontSize: '16px' }}
                />,
                <Statistic
                  value={item.commentCount}
                  valueStyle={{ fontSize: '16px' }}
                  prefix={
                    <MessageOutlined
                      onClick={() => handleShowComment(item._id)}
                    />
                  }
                />,
              ]}
              extra={ userData?._id === userId ? <div onClick={() => handleEditPost(item)}>Edit</div> : null}
            >
              <Meta
                avatar={<Avatar size={42} src={item?.updatedBy?.avatar?.url || item?.createdBy?.avatar?.url} />}
                title={
                  // <a href={item.href}>{item.title}</a>
                  <Link
                    to={`/userProfile/${item.updatedBy?._id}`}
                  >
                    {item.updatedBy?.firstName} {item.updatedBy?.lastName}
                  </Link>
                }
                description={(
                  // <>
                  //   <div className={styles.userIdea}>{item.updatedBy?.firstName} {item.updatedBy?.lastName}</div>
                  //   <div>{item.description}</div>
                  // </>
                  <div>
                    {format(new Date(item.createdAt), DATE)}
                  </div>
                )}
              />
              <div className={styles.postContent}>
                {item.content}
                <ImageList imageList={item.images} />
              </div>
            </Card>

            {showCommentMap[item._id] &&
              <Spin spinning={isLoadingComment}>
                <div className={styles.commentContainer}>
                  {item?.comments?.map((comment: any) =>
                    <div
                      key={comment._id}
                      className={styles.comment}
                    >
                      <Meta
                        key={comment._id}
                        avatar={
                          <>
                            <Avatar src={comment.updatedBy?.avatar?.url || comment.createdBy?.avatar?.url} /> 
                            <strong>{comment.createdBy?.firstName} {comment.createdBy?.lastName}</strong>
                          </>
                        }
                        description={<p className={styles.commentContent}>{comment.content}</p>}
                      />
                      {(comment.createdBy._id === userId) ?
                        <Dropdown
                          menu={
                            {
                              items: [
                                {
                                  label: <div onClick={() => handleEditComment(item._id, comment._id)}>Edit comment</div>,
                                  key: '0',
                                },
                                {
                                  type: 'divider',
                                },
                                {
                                  label: <div onClick={() => handleDeleteComment(item._id, comment._id)}>Delete comment</div>,
                                  key: '2',
                                  danger: true,
                                },
                              ]
                            }
                          }
                          trigger={['click']}
                        >
                          <div
                            className={styles.commentOption}
                          >
                            <EllipsisOutlined />
                          </div>
                        </Dropdown>
                        : null
                      }
                    </div>
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
      <ModalEditComment
        visible={visibleModalEditComment}
        setVisivle={setVisibleModalEditComment}
        postId={itemEditComment?.postId}
        commentId={itemEditComment?.commentId}
        refetch={refetch}
      />
      <ModalPost
        postData={postEditing}
        visible={visibleModalEditPost}
        setVisible={setVisibleModalEditPost}
        afterSuccess={refetch}
      />
    </Spin>
  )
}

export default Post;