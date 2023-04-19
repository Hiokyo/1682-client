import React from 'react'
import { Drawer, List } from 'antd';
import styles from './styles.module.scss';
import { TextArea } from '../Input';

interface Props {
  userId: string;
  open: boolean;
  onClose: () => void;
}
const ChatModal = (props: Props) => {
  const {userId, open, onClose} = props;
  const messages = [
    { id: 1, user: {id: 1, name: 'Quan'}, content: 'Hello' },
    { id: 2, user: {id: 2, name: 'Hieu'}, content: 'How are you?' },
    { id: 3, user: {id: 1, name: 'Quan'}, content: 'I am fine' },
    { id: 4, user: {id: 1, name: 'Quan'}, content: 'Hello' },
    { id: 5, user: {id: 2, name: 'Hieu'}, content: 'How are you?' },
    { id: 6, user: {id: 1, name: 'Quan'}, content: 'I am fine' },
    { id: 7, user: {id: 1, name: 'Quan'}, content: 'Hello' },
    { id: 8, user: {id: 2, name: 'Hieu'}, content: 'How are you?' },
    { id: 9, user: {id: 1, name: 'Quan'}, content: 'I am fine' },
    { id: 10, user: {id: 1, name: 'Quan'}, content: 'Hello' },
    { id: 11, user: {id: 2, name: 'Hieu'}, content: 'How are you?' },
    { id: 13, user: {id: 1, name: 'Quan'}, content: 'Hello' },
    { id: 14, user: {id: 2, name: 'Hieu'}, content: 'How are you?' },
    { id: 15, user: {id: 1, name: 'Quan'}, content: 'I am fine' },
    { id: 16, user: {id: 1, name: 'Quan'}, content: 'Hello' },
    { id: 17, user: {id: 2, name: 'Hieu'}, content: 'How are you?' },
    { id: 18, user: {id: 1, name: 'Quan'}, content: 'I am fine' },
    { id: 19, user: {id: 1, name: 'Quan'}, content: 'Hello' },
    { id: 20, user: {id: 2, name: 'Hieu'}, content: 'How are you?' },
    { id: 21, user: {id: 1, name: 'Quan'}, content: 'I am fine' },
  ];

  return (
    <Drawer
      title='Chat'
      placement="right"
      onClose={onClose}
      className={styles.modalChat}
      open={open}
      // style={{width: '200px'}}
      // extra={
      //   <Space>
      //     <Button onClick={onClose}>Cancel</Button>
      //     <Button type="primary" onClick={onClose}>
      //       OK
      //     </Button>
      //   </Space>
      // }
      footer={
        <div className={styles.inputChat}>
          <TextArea/>
        </div>
      }
    >
      <List
        dataSource={messages}
        className={styles.listChat}
        renderItem={(item) => (
          <div className={styles.chatBorder}>
            <List.Item
              className={item.user.id === 2 ? styles.sender : styles.receiver}
              key={item.id}
            >
              {item.content}
            </List.Item>
          </div>
        )}
      />

    </Drawer>
  )
}

export default ChatModal