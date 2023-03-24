import React from 'react'
import loadable from '~/utils/loadable';
import { Authorization } from '~/wrapper/Authorization';

const PostsList = loadable(() => import('~/components//molecules/PostsList'));

const Ideas = () => {
  return (
    <>
      <PostsList/>
    </>
  )
}

export default Ideas