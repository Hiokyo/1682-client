import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Col, Radio, Row, Spin, message } from "antd";
import { createOrder, getAvailablePaymentMethod } from "~/api/payment";
import { RootState, useAppDispatch, useAppSelector } from "~/store";
import {
  setAvailableMethods,
  setCurrentOrder,
  setMethodUsed,
} from "~/store/payment";
import { useBookDetail } from "~/hooks/useBooks";
import Svg from "~/components/atoms/Svg";
import styles from "./styles.module.scss";
import { getCookie } from "~/utils/cookie";
import { formatter } from "~/utils/helper";

interface Props {
  bookId: any;
}

const Payments = (props: Props) => {
  const { bookId } = props;
  const {
    data: responseBook,
    isLoading,
    isFetching,
  } = useBookDetail({ bookId });
  const dataBook = responseBook?.data;
  const availablePaymentMethod = useAppSelector(
    (state: RootState) => state.payment.availableMethods
  );
  const userId = getCookie("userId");
  const methodUsed = useAppSelector(
    (state: RootState) => state.payment.methodUsed
  );

  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    if (JSON.stringify(methodUsed) === "{}") {
      return message.error("Please select method");
    }

    try {
      const res = await createOrder(bookId, methodUsed._id);

      if (res && !res.errorCode && !res.errors.length) {
        const { data } = res;

        dispatch(setCurrentOrder(data.paymentId));
        window.open(data.vnpUrl, "_self");
      } else {
        message.error("Internal error");
      }

      console.log(res);
    } catch (error) {
      message.error("");
    }
  };

  useEffect(() => {
    const getCurrentAvailableMethods = async () => {
      try {
        const res = await getAvailablePaymentMethod();

        if (res && !res.errorCode && !res.errors.length) {
          const { data } = res;

          dispatch(setAvailableMethods(data));
        } else {
          message.error("Fail to get payment methods");
        }
      } catch (error) {
        message.error("Fail to get payment methods");
      }
    };

    getCurrentAvailableMethods();
  }, []);

  return (
    <>
      <Spin spinning={isLoading}>
        <div className={styles.container}>
          <Row gutter={[36, 36]}>
            <Col xs={24} sm={12} className={styles.cardContainer}>
              <Card
                cover={
                  <Svg
                    alt="book cover"
                    src="https://www.jdandj.com/uploads/8/0/0/8/80083458/modern-book-cover-design-for-fiction-webp_orig.webp"
                  />
                }
              >
                <Card.Meta
                  title={dataBook?.title}
                  description={
                    <div>
                      {dataBook?.createdBy?.firstName}{" "}
                      {dataBook?.createdBy?.lastName}
                    </div>
                  }
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} className={styles.paymentMethod}>
              <div>
                <h1> Price: &nbsp;{formatter(+dataBook?.price?.amount) || 0}</h1>
                <Radio.Group>
                  {availablePaymentMethod.map((item) => (
                    <Radio
                      key={item._id}
                      value={item.name}
                      onChange={() =>
                        dispatch(
                          setMethodUsed({
                            name: item.name,
                            _id: item._id,
                            note: item.note,
                          })
                        )
                      }
                    >
                      {item.note}
                    </Radio>
                  ))}
                </Radio.Group>
              </div>
              <div className={styles.btnPayment}>
                <Button
                  type="primary"
                  style={{ width: "100%" }}
                  onClick={handleSubmit}
                >
                  Payment
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </Spin>

    </>
  );
};

export default Payments;
