import { Descriptions } from 'antd';
import { format } from 'date-fns';
import React from 'react';
import { DATE } from '~/utils/constant';

interface Props{
  data: any;
}

const Infomations = (props: Props) => {
  const {data} = props;
  return (
    <Descriptions title="User Info">
      <Descriptions.Item 
        label="Name"
      >
        {data?.firstName} {data?.lastName}
      </Descriptions.Item>
      <Descriptions.Item 
        label="Telephone"
      >
        {data?.phoneNumber}
      </Descriptions.Item>
      <Descriptions.Item 
        label="Gender"
      >
        {data?.gender?.charAt(0) + data?.gender?.slice(1).toLowerCase()}
      </Descriptions.Item>
      <Descriptions.Item 
        label="Email"
      >
        {data?.email}
      </Descriptions.Item>
      <Descriptions.Item 
        label="Address"
      >
        {data?.address ? data?.address : '-'}
      </Descriptions.Item>
      <Descriptions.Item 
        label="DOB"
      >
        {data?.dob ? format(new Date(data?.dob), DATE) : '-'}
      </Descriptions.Item>
      <Descriptions.Item 
        label="Followers"
      >
        {data?.followersCount ? data?.followersCount : '-'}
      </Descriptions.Item>
    </Descriptions>
  )
}

export default Infomations