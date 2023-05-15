import React, { useCallback, useMemo, useState } from "react";
import { Button, Form } from "antd";
import { Option } from "~/components/atoms/Select";
import { SortPosts, UserRole } from "~/utils/constant";

import Svg from "~/components/atoms/Svg";
import loadable from "~/utils/loadable";
import iconPlus from "~/assets/images/iconPlus.svg";

import styles from "./styles.module.scss";
import ModalPost from "../PostModal";
import Input from "~/components/atoms/Input";
import { Authorization } from "~/wrapper/Authorization";

const Select = loadable(() => import("~/components/atoms/Select"));
const ModalIdeas = loadable(
  () => import("~/components/molecules/BooksList/ModalBooks")
);

interface Props {
  afterSuccess?: () => void;
  onChange: (value: any) => void;
}

const Filter = (props: Props) => {
  const { afterSuccess, onChange } = props;

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const sortOption = useMemo(
    () =>
      Object.entries(SortPosts)
        // render options sort by
        .map((item: any, index) => ({
          id: index,
          name: item[1],
          value: item[0],
        })),
    []
  );

  const showAddModal = () => {
    setIsModalVisible(true);
  };

  const handleValuesChange = useCallback(
    (_: any, formValues: any) => {
      onChange(formValues);
    },
    [onChange]
  );

  return (
    <>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.optionsWrapper}>
            <Form
              form={form}
              onValuesChange={handleValuesChange}
              initialValues={{
                sort: sortOption[sortOption.length - 1].value,
              }}
            >
              <div className={styles.filterWrapper}>
                <Form.Item name="sort">
                  <Select
                    className={styles.selectSort}
                    placeholder="Sort ideas"
                  >
                    {sortOption?.map((item: any) => (
                      <Option key={item.id} value={item.value}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="keyword">
                  <Input
                    className={styles.keyword}
                    autoComplete="off"
                    placeholder="Search"
                  />
                </Form.Item>
              </div>
            </Form>
            <Authorization roles={[UserRole.Author, UserRole.User]}>
              <Button
                className={styles.btnAdd}
                type="primary"
                onClick={showAddModal}
              >
                <Svg
                  className={styles.iconPlus}
                  src={iconPlus}
                  alt="iconPlus"
                />
                <p className={styles.btnText}> New post</p>
              </Button>
            </Authorization>
          </div>
        </div>
      </div>
      <ModalPost
        visible={isModalVisible}
        setVisible={setIsModalVisible}
        afterSuccess={afterSuccess}
      />
    </>
  );
};

export default Filter;
