import React, { useState } from 'react'

import {UserRole } from '~/utils/constant'
import { Authorization } from '~/wrapper/Authorization'
import loadable from '~/utils/loadable'
import { useFavoriteBook } from '~/hooks/useFavoriteBook'
import { useAppSelector } from '~/store'
import FavoriteLists from './FavoriteLists'
import { getCookie } from '~/utils/cookie'

// const Filter = loadable(() => import('~/components/molecules/Departments/Filter'));

const BookFavorites = () => {
  const userId = getCookie('userId')
  const {data, isFetching, isLoading, refetch} = useFavoriteBook({userId});
  const dataFavorite = data?.data;
  return (
    <>
      <FavoriteLists
        dataFavorite={dataFavorite}
        refetch={refetch}
        isFetching={isFetching}
        isLoading={isLoading}
      />
    </>
  )
}

export default BookFavorites