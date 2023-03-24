import React from 'react'
import { useParams } from 'react-router-dom';
import BookDetails from '~/components/molecules/BookDetails';

const BookDetail = () => {
  const { id } = useParams();
  return (
    <BookDetails bookId={id}/>
  );
}

export default BookDetail