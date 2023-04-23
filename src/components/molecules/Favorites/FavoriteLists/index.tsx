import React, { useState } from "react";

import { Item } from "~/components/atoms/List";
import loadable from "~/utils/loadable";

import styles from "./styles.module.scss";
import BookFavorite from "./Items";

const Spin = loadable(() => import("~/components/atoms/Spin"));
const List = loadable(() => import("~/components/atoms/List"));


interface Props {
  data?: any;
  refetch?: () => void;
  isLoading?: boolean;
  isFetching?: boolean;
  setParams?: (value: any) => void;
}
interface DataType {
  name: string;
  createdAt: Date;
  status: string;
}

const FavoriteLists = (props: Props) => {
  const { data, refetch, isLoading, isFetching, setParams } = props;

  return (
    <Spin spinning={isLoading || isFetching}>
      <List
        className={styles.listsDepartment}
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 3,
          xl: 3,
          xxl: 4,
        }}
        dataSource={data}
        renderItem={(item: any, i: number) => {
          const div = Math.floor(i / 3);
          return (
            <Item
              className={`${styles.item} ${
                div % 2 !== 0 ? styles.background : ""
              }`}
            >
              <BookFavorite item={item.book} refetch={refetch} />
            </Item>
          );
        }}
      />
    </Spin>
  );
};

export default FavoriteLists;
