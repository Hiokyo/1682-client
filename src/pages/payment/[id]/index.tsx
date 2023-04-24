import React from 'react'
import Payments from '~/components/molecules/Payments';
import { useParams } from 'react-router-dom';

const PaymentOne = () => {
  const { id } = useParams();

  return (
    <Payments bookId={id}/>
  )
}

export default PaymentOne