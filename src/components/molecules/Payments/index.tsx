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
      {/* <div>New Order</div>

      <input
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        type="number"
      />

      <div>Select payment method</div>

      {availablePaymentMethod.map((item) => (
        <Fragment key={item._id}>
          <input
            type="radio"
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
          />
          <label>{item.note}</label>
        </Fragment>
      ))}

      <button onClick={handleSubmit}>Thanh toan</button> */}
      <Spin spinning={isLoading}>
        <div className={styles.container}>
          <Row gutter={[36, 36]}>
            <Col span={12} className={styles.cardContainer}>
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
            <Col className={styles.paymentMethod} span={12}>
              <div>
                {/* <h1>Giá tiền: 300.000 VNĐ</h1> */}
                <h1>
                  Price: {dataBook?.price?.currency || ""}
                  {dataBook?.price?.amount || 0}
                </h1>
                <Radio.Group
                // value={paymentMethod}
                // onChange={handlePaymentMethodChange}
                >
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
                  Thanh toán
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
