import React, { useState } from 'react'
import { useCategories } from '~/hooks/useCategory'
import { NAME_ASC, PARAMS_FILTER } from '~/utils/constant';
import loadable from '~/utils/loadable';

const Filter = loadable(() => import('~/components/molecules/Categories/Filter'));
const CategoryTable = loadable(() => import('~/components/molecules/Categories/TableCategory'));

const Categories = () => {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    sort: 'NAME_DESC'
  })

  const handleFilter = (value: any) => {
    setParams({
      sort: NAME_ASC,
      ...PARAMS_FILTER,
      ...value
    })
  };
  const { data, isLoading, isFetching, refetch } = useCategories(params);
  return (
    <>
      <Filter refetch={refetch} onChange={handleFilter}/>
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