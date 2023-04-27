import { List, Typography } from 'antd'
import React, { useState } from 'react'
import { useReports } from '~/hooks/useReport'
import { PARAMS_GET_ALL } from '~/utils/constant'
import Filter from './Filter'
import ReportTable from './TableReport'

const ReportList = () => {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    sort: 'TITLE_DESC'
  })
  const {data, isFetching, isLoading, refetch} = useReports(params)
  
  return (
    <>
      <Filter
        refetch={refetch}
      />
      <ReportTable
        setParams={setParams}
        reports={data?.data?.reports}
        refetch={refetch}
        isFetching={isFetching}
        isLoading={isLoading}
      />
    </>
  )
}

export default ReportList