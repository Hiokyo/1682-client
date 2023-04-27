import React from 'react';
import Modal from '../Modal';
import Svg from '../Svg';
import iconWarning from '~/assets/images/warning.svg';

import styles from './styles.module.scss';

interface Props { 
  visible: boolean;
  centered?: any;
  onCancel: () => void;
  onOk: () => void;
  title: string;
  children?: any;
}

const ModalConfirm = (props: Props) => {
  const {visible, centered, onCancel, onOk, title} = props;
  return (
   <Modal
      open={visible}
      centered={centered}
      onCancel={onCancel}
      onOk={onOk}
      closable={false}
    >
      <div className={styles.headerConfirm}>
        <Svg className={styles.iconWarning} src={iconWarning} alt="icon warning"/>
        <span className={styles.title}>{title}</span>
      </div>
      {props.children}
    </Modal>
  )
}

export default ModalConfirm