import React from 'react';
import { usePostByUser } from '~/hooks/useUser';

interface Props{
  data?: any;
}

const Post = (props: Props) => {
  const {data} = props;
  const userId  = data?._id;
  const {data: postList} = usePostByUser({userId}) 
  console.log(postList?.data)

  return (
    <div>index</div>
  )
}

export default Post