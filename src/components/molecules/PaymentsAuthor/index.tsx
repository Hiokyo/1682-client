import { List, Typography } from 'antd'
import React, { useState } from 'react'
import { useReports } from '~/hooks/useReport'
import { PARAMS_FILTER, PARAMS_GET_ALL } from '~/utils/constant'
import Filter from './Filter'
import PaymentTable from './Table'
import { usePaymentAuthor } from '~/hooks/usePayment'

const PaymentAuthorList = () => {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    sort: 'TITLE_DESC'
  })

  const handleFilter = (value: any) => {
    setParams({
      sort: 'TITLE_DESC',
      ...PARAMS_FILTER,
      ...value
    })
  };
  const {data, isFetching, isLoading, refetch} = usePaymentAuthor(params)
  
  return (
    <>
      <Filter
        refetch={refetch}
        onChange={handleFilter}
      />
      <PaymentTable
        setParams={setParams}
        payments={data?.data?.payments}
        total={data?.data?.total}
        refetch={refetch}
        isFetching={isFetching}
        isLoading={isLoading}
      />
    </>
  )
}

export default PaymentAuthorList