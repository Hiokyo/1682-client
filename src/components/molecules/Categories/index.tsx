import React, { useState } from 'react'
import { useCategories } from '~/hooks/useCategory'
import loadable from '~/utils/loadable';

const Filter = loadable(() => import('~/components/molecules/Categories/Filter'));
const CategoryTable = loadable(() => import('~/components/molecules/Categories/TableCategory'));

const Categories = () => {
  const [params, setParams] = useState({
    page: 1,
    limit: 5,
    sort: 'NAME_DESC'
  })
  const { data, isLoading, isFetching, refetch } = useCategories(params);
  return (
    <>
      <Filter refetch={refetch}/>
      <CategoryTable  
        categories={data?.data}
        refetch={refetch}  
        isLoading={isLoading}
        isFetching={isFetching}
        setParams={setParams}
      />
    </>
  )
}

export default Categories