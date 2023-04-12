import React from 'react'
import { useParams } from 'react-router-dom';
import Profile from '~/components/molecules/Profile'

const UserProfile = () => {
  const { id } = useParams();
  return (
    <Profile userId={id}/>
  )
}

export default UserProfile