import React from 'react'
import loadable from '~/utils/loadable';
import { Authorization } from '~/wrapper/Authorization';

const BooksList = loadable(() => import('~/components//molecules/BooksList'));

const Ideas = () => {
  return (
    <>
      <BooksList/>
    </>
  )
}

export default Ideas