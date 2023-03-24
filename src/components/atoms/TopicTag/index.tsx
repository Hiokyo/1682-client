import { Tag } from 'antd';
import React from 'react'

interface Props{ 
  topic: any
}
const TopicTag = (props: Props) => {
  const {topic} = props;
  switch (topic.name) {
    case 'Adventure':
      return <Tag color="magenta">{topic.name}</Tag>
    case 'Classics':
      return <Tag color="volcano">{topic.name}</Tag>
    default:
      return <Tag color="blue">{topic.name}</Tag>
  }
}

export default TopicTag