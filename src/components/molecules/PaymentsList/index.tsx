import React, { useState } from 'react'
import { usePaymentAdmin } from '~/hooks/usePayment';
import { NAME_ASC, PARAMS_FILTER } from '~/utils/constant';
import loadable from '~/utils/loadable';

const Filter = loadable(() => import('~/components/molecules/PaymentsList/Filter'));
const PaymentTable = loadable(() => import('~/components/molecules/PaymentsList/Table'));

const PaymentsList = () => {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    sort: 'DATE_CREATED_DESC'
  })

  const handleFilter = (value: any) => {
    setParams({
      sort: NAME_ASC,
      ...PARAMS_FILTER,
      ...value
    })
  };
  const { data, isLoading, isFetching, refetch } = usePaymentAdmin(params);
  return (
    <>
      <Filter refetch={refetch} onChange={handleFilter}/>
      <PaymentTable  
        payments={data?.data?.payments}
        total={data?.data?.total}
        refetch={refetch}  
        isLoading={isLoading}
        isFetching={isFetching}
        setParams={setParams}
      />
    </>
  )
}

export default PaymentsList