import React, { useState } from 'react'

import { useBooks } from '~/hooks/useBooks';
import { PARAMS_FILTER } from '~/utils/constant';
import loadable from '~/utils/loadable';

const BookList = loadable(() => import('~/components/molecules/BooksList/List'));
const Filter = loadable(() => import('~/components/molecules/BooksList/Filter'));

const IdeasList = () => {
  const [params, setParams] = useState({
    ...PARAMS_FILTER,
    sort: 'LIKE_DESC'
  })
  const { data, isLoading, isFetching, refetch } = useBooks(params)

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
      <BookList 
        dataBooks={data?.data?.books}
        isLoading={isLoading}
        isFetching={isFetching}
        refetch={refetch}
      />
    </>
  )
}

export default IdeasList