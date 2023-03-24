import React, { useState } from 'react'

import { useBooks } from '~/hooks/useBooks';
import { usePosts } from '~/hooks/usePosts';
import { PARAMS_FILTER } from '~/utils/constant';
import loadable from '~/utils/loadable';

const PostList = loadable(() => import('~/components/molecules/PostsList/List'));
const Filter = loadable(() => import('~/components/molecules/PostsList/Filter'));

const IdeasList = () => {
  const [params, setParams] = useState({
    ...PARAMS_FILTER,
    sort: 'LIKE_DESC'
  })
  const { data, isLoading, isFetching, refetch } = usePosts(params)

  const handleFilter = (value: any) => {
    setParams({
      ...PARAMS_FILTER,
      ...value
    })
  };

  return (
    <>
      <Filter
        onChange={handleFilter}
        afterSuccess={refetch}
      />
      <PostList 
        dataPosts={data?.data?.posts}
        isLoading={isLoading}
        isFetching={isFetching}
        refetch={refetch}
      />
    </>
  )
}

export default IdeasList