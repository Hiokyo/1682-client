import React, { useState } from 'react'

import {UserRole } from '~/utils/constant'
import { Authorization } from '~/wrapper/Authorization'
import loadable from '~/utils/loadable'
import { useFavoriteBook } from '~/hooks/useFavoriteBook'
import { useAppSelector } from '~/store'

const FavoriteList = loadable(() => import('~/components/molecules/Favorites/FavoriteLists'));
// const Filter = loadable(() => import('~/components/molecules/Departments/Filter'));


const BookFavorites = () => {
  const userData = useAppSelector((state) => state.userInfo.userData);

  const {data, isFetching, isLoading, refetch} = useFavoriteBook({userId: userData?._id});
  const dataFavorite = data?.data;
  return (
    <>
      <FavoriteList
        data={dataFavorite}
        refetch={refetch}
        isFetching={isFetching}
        isLoading={isLoading}
      />
    </>
  )
}

export default BookFavorites