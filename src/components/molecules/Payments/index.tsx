import React, { Fragment, useEffect, useState } from "react";
import { Button, Card, Col, Radio, Row, message } from "antd";
import { createOrder, getAvailablePaymentMethod } from "~/api/payment";
import { RootState, useAppDispatch, useAppSelector } from "~/store";
import {
  setAvailableMethods,
  setCurrentOrder,
  setMethodUsed,
} from "~/store/payment";
import { useBookDetail } from "~/hooks/useBooks";
import Svg from "~/components/atoms/Svg";
import styles from './styles.module.scss'

interface Props {
  bookId: any;
}

const Payments = (props: Props) => {
  const { bookId } = props;
  const { data: responseBook, isLoading, isFetching } = useBookDetail({bookId});
  const dataBook = responseBook?.data;
  console.log(dataBook)
  const [amount, setAmount] = useState<number>(0);
  const availablePaymentMethod = useAppSelector(
    (state: RootState) => state.payment.availableMethods
  );
  const methodUsed = useAppSelector(
    (state: RootState) => state.payment.methodUsed
  );

  console.log(availablePaymentMethod)

  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    if (JSON.stringify(methodUsed) === "{}") {
      return message.error("Please select method");
    } else if (amount === 0) {
      return message.error("Please enter amount");
    }

    try {
      const res = await createOrder(String(amount), methodUsed._id);

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
      <div 
        className={styles.container}
      >
        <Row
          gutter={[36, 36]}
        >
          <Col 
            span={12}
            className={styles.cardContainer}
          >
            <Card 
              cover={
                <Svg alt="book cover" src='https://www.jdandj.com/uploads/8/0/0/8/80083458/modern-book-cover-design-for-fiction-webp_orig.webp' />
              }
            >
              <Card.Meta 
                title={dataBook?.title} 
                description={
                  <div>
                    {dataBook?.createdBy?.firstName} {dataBook?.createdBy?.lastName}
                  </div>
                }
              />
            </Card>
          </Col>
          <Col
            className={styles.paymentMethod}
            span={12}
          >
            <div>
              <h1>Giá tiền: 300.000 VNĐ</h1>
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
            <div 
              className={styles.btnPayment}
            >
              <Button
                type="primary"
                style={{width: '100%'}}
              >
                Thanh toán
              </Button>
            </div>
          </Col>
        </Row>
      </div>
      </>
  );
}

export default Payments