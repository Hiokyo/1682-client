import React, { useEffect, useState } from 'react'
import { Avatar, Card, Dropdown, Form, Popover, Statistic, message } from 'antd'
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

import { format } from 'date-fns';
import { DATE, SUCCESS } from '~/utils/constant';
import { useAppSelector } from '~/store';
import { TextArea } from '~/components/atoms/Input';
import styles from './styles.module.scss'

import { deletePostComment, setCommentPost, updateActionPost } from '~/api/post';
import ModalEditComment from '~/components/atoms/ModalEditComment';
import ImageList from '~/components/molecules/PostsList/ImageList';
import { usePostDetail } from '~/hooks/usePosts';
import Spin from '~/components/atoms/Spin';
import ModalPost from '../PostsList/PostModal';

interface Props {
  postId: any;
}

const PostDetail = (props: Props) => {
  const { postId } = props;

  const {data, isLoading, isFetching, refetch} = usePostDetail({postId})
  const dataPosts = data?.data;
  const userData = useAppSelector((state) => state.userInfo.userData);
  const [showCommentMap, setShowCommentMap] = useState<any>({})
  const [isLoadingComment, setIsLoadingComment] = useState(false)
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<any>([]);
  const [itemEditComment, setItemEditComment] = useState<any>({});
  const [visibleModalEditComment, setVisibleModalEditComment] = useState(false);

  const [visibleModalEditPost, setVisibleModalEditPost] = useState(false);
  const [postEditing, setPostEditing] = useState({});

  useEffect(() => {
    if (dataPosts) {
      setDataSource(dataPosts)
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
    const post = dataSource;
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

    setDataSource(updatedPost);

    const res = await updateActionPost(itemId, action)
    if (res.message === SUCCESS) {
      setDataSource(res?.data)
    }
  };

  const handleKeyPress = (event: any) => {
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

  return (
    <Spin spinning={isLoading || isFetching}>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.infoContainer}>
            <div>
            <Card
              className='mt-2'
              headStyle={{ border: 'none' }}
              actions={[
                <Statistic
                  value={dataSource?.likeCount}
                  prefix={
                    dataSource.like?.find((e: any) => e.user?._id === userData?._id) ?
                      <Popover
                        trigger={'hover'}
                        content={(
                          dataSource.like?.map((userLike: any) =>
                            <div key={userLike.user?._id}>
                              {userLike.user?.firstName} {userLike.user?.lastName}
                            </div>
                          )
                        )}
                      >
                        <LikeTwoTone
                          onClick={() => handleLike_Dislike(dataSource._id, 'like')}
                        />
                      </Popover>
                      :
                      <Popover
                        trigger={'hover'}
                        content={(
                          dataSource.like?.map((userLike: any) =>
                            <div key={userLike.user?._id}>
                              {userLike?.user?.firstName} {userLike?.user?.lastName}
                            </div>
                          )
                        )}
                      >
                        <LikeOutlined
                          onClick={() => handleLike_Dislike(dataSource._id, 'like')}
                        />
                      </Popover>
                  }
                  valueStyle={{ fontSize: '16px' }}
                />,
                <Statistic
                  value={dataSource.dislikeCount}
                  prefix={
                    dataSource.dislike?.find((e: any) => e.user?._id === userData?._id) ?
                      <Popover
                        trigger={'hover'}
                        content={(
                          dataSource.dislike?.map((userDislike: any) =>
                            <div key={userDislike.user?._id}>
                              {userDislike.user?.firstName} {userDislike.user?.lastName}
                            </div>
                          )
                        )}
                      >
                        <DislikeTwoTone
                          onClick={() => handleLike_Dislike(dataSource._id, 'dislike')}
                        />
                      </Popover>
                      :
                      <Popover
                        trigger={'hover'}
                        content={(
                          dataSource.dislike?.map((userDislike: any) =>
                            <div key={userDislike.user?._id}>
                              {userDislike.user?.firstName} {userDislike.user?.lastName}
                            </div>
                          )
                        )}
                      >
                        <DislikeOutlined
                          onClick={() => handleLike_Dislike(dataSource._id, 'dislike')}
                        />
                      </Popover>
                  }
                  valueStyle={{ fontSize: '16px' }}
                />,
                <Statistic
                  value={dataSource.commentCount}
                  valueStyle={{ fontSize: '16px' }}
                  prefix={
                    <MessageOutlined
                      onClick={() => handleShowComment(dataSource._id)}
                    />
                  }
                />,
              ]}
              extra={ userData?._id === dataSource.createdBy ? <div onClick={() => handleEditPost(dataSource)}>Edit</div> : null}
            >
              <Meta
                avatar={<Avatar size={42} src={dataSource.updatedBy?.avatar?.url} />}
                title={
                  <div>
                    {dataSource.updatedBy?.firstName} {dataSource.updatedBy?.lastName}
                  </div>
                }
                description={(
                  // <>
                  //   <div className={styles.userIdea}>{item.updatedBy?.firstName} {item.updatedBy?.lastName}</div>
                  //   <div>{item.description}</div>
                  // </>
                  <div>
                    { dataSource?.updatedAt && format(new Date(dataSource.updatedAt), DATE)}
                  </div>
                )}
              />
              <div className={styles.postContent}>
                {dataSource.content}
                <ImageList imageList={dataSource.images} />
              </div>
            </Card>

            {showCommentMap[dataSource._id] &&
              <Spin spinning={isLoadingComment}>
                <div className={styles.commentContainer}>
                  {dataSource?.comments?.map((comment: any) =>
                    <div
                      key={comment._id}
                      className={styles.comment}
                    >
                      <Meta
                        key={comment._id}
                        avatar={
                          <>
                            <Avatar 
                              src={comment?.createdBy?.avatar?.url || comment?.updatedBy?.avatar?.url}
                              style={{marginRight: '0.5rem'}}
                            /> 
                            <strong>
                              {comment.createdBy?.firstName} {comment.createdBy?.lastName}
                            </strong>
                          </>
                        }
                        description={<p className={styles.commentContent}>{comment.content}</p>}
                      />
                      {(comment.createdBy._id === userData?._id) ?
                        <Dropdown
                          menu={
                            {
                              items: [
                                {
                                  label: <div onClick={() => handleEditComment(dataSource._id, comment._id)}>Edit comment</div>,
                                  key: '0',
                                },
                                {
                                  type: 'divider',
                                },
                                {
                                  label: <div onClick={() => handleDeleteComment(dataSource._id, comment._id)}>Delete comment</div>,
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
              </Spin>
            }
          </div>
        </div>
      </div>
    </div>
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


export default PostDetail