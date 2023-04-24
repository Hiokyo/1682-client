import React from 'react'
import { useParams } from 'react-router-dom';
import PostDetail from '~/components/molecules/PostDetail';

const PostDetails = () => {
  const { id } = useParams();
  return (
    <PostDetail postId={id}/>
  );
}

export default PostDetails