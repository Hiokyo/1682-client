import React from "react";

import Svg from "~/components/atoms/Svg";
import { DATE, SUCCESS } from "~/utils/constant";
import { format } from "date-fns";

import styles from "./styles.module.scss";
import TopicTag from "~/components/atoms/TopicTag";
import { removeBookFavorite } from "~/api/user";
import { message } from "antd";
import {
  LikeOutlined,
} from '@ant-design/icons';

interface Props {
  item: any;
  afterSuccess?: () => void;
  refetch: () => void;
}

function BookFavorite(props: Props) {
  const { item, refetch } = props;

  const handleRemove = async (id: string) => {
    const res = await removeBookFavorite(id)
    if (res.message === SUCCESS) {
      message.success("Remove book favorite success")
      refetch()
    } else {
      message.error(res.message)
    }
  }

  return (
    <>
      <div className={styles.departmentContainer}>
        <div className={styles.info}>
          <div className={styles.name}>
            {item?.book?.title ?? ""}
          </div>
{/* 
          <div className={styles.content}>
            {item?.likeCount}  
            <LikeOutlined/>
          </div> */}

          <div className={styles.topic}>
            {
              item.book.topics?.map((topic: any) => (
                <TopicTag key={topic._id} topic={topic}/>
              ))
            }
          </div>

          <div className={styles.infoGroup}>
          
          </div>
        </div>

        <div 
          className={styles.btnEdit}
          onClick={() => handleRemove(item._id) }
        >
          Remove
        </div>
      </div>
    </>
  );
}

export default BookFavorite;
