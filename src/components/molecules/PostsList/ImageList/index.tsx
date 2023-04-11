import React from 'react';
import styles from './styles.module.scss'
interface Props {
  imageList: any;
}

const ImageList = (props: Props) => {
  const {imageList} = props;
  return (
    <div className={styles.grid}>
    {imageList.map((item: any, index: any) => (
      <div key={index} className={styles.gridItem}>
        <img src={item.url} alt={item?.name} />
      </div>
    ))}
  </div>
  );
}

export default ImageList