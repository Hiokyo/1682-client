import { Card, Button, Col, Row, Modal, Radio, message } from "antd";
import React, { useEffect, useState } from "react";

import styles from "./styles.module.scss";
import { RootState, useAppDispatch, useAppSelector } from "~/store";
import {
  setAvailableMethods,
  setCurrentOrder,
  setMethodUsed,
} from "~/store/payment";
import {
  createOrderForSubscription,
  getAvailablePaymentMethod,
} from "~/api/payment";

const Memberships = () => {
  const availablePaymentMethod = useAppSelector(
    (state: RootState) => state.payment.availableMethods
  );
  const dispatch = useAppDispatch();
  const methodUsed = useAppSelector(
    (state: RootState) => state.payment.methodUsed
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSubscribe = async () => {
    if (!methodUsed) {
      message.error("Please select a payment method");
    }

    const res = await createOrderForSubscription(
      paymentData.amount,
      paymentData.validTime,
      methodUsed._id
    );

    if (res && !res.errorCode && !res.errors.length) {
      const { data } = res;

      dispatch(setCurrentOrder(data.paymentId));
      window.open(data.vnpUrl, "_self");
    } else {
      message.error("Internal error");
    }
  };

  const [paymentData, setPaymentData] = useState<{
    amount: string;
    validTime: number;
  }>({ amount: "", validTime: 0 });

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

    return () => {
      dispatch(setMethodUsed(""));
    };
  }, []);

  return (
    <div className={styles.membershipContainer}>
      <Row gutter={16}>
        <Col span={8} xs={24}>
          <Card title=" 1 month" style={{ width: "100%" }}>
            <p>Read all book in 1 month.</p>
            <p>Price: VN100000</p>
            <Button
              type="primary"
              size="large"
              onClick={() => {
                setIsOpen(() => true);
                setPaymentData(() => ({ amount: "100000", validTime: 1 }));
              }}
            >
              Buy
            </Button>
          </Card>
        </Col>
        <Col span={8} xs={24}>
          <Card title=" 3 month" style={{ width: "100%" }}>
            <p>Read all book in 3 month.</p>
            <p>Price: VND250000</p>
            <Button
              type="primary"
              size="large"
              onClick={() => {
                setIsOpen(() => true);
                setPaymentData(() => ({ amount: "250000", validTime: 3 }));
              }}
            >
              Buy
            </Button>
          </Card>
        </Col>
        <Col span={8} xs={24}>
          <Card title=" 6 month" style={{ width: "100%" }}>
            <p>Read all book in 6 month.</p>
            <p>Price: VND400000</p>
            <Button
              type="primary"
              size="large"
              onClick={() => {
                setIsOpen(() => true);
                setPaymentData(() => ({ amount: "400000", validTime: 6 }));
              }}
            >
              Buy
            </Button>
          </Card>
        </Col>
      </Row>

      <Modal
        open={isOpen}
        footer={<Button onClick={handleSubscribe}>Check out</Button>}
        onCancel={() => {
          setPaymentData(() => ({ amount: "", validTime: 0 }));

          dispatch(setMethodUsed(""));
        }}
      >
        <p>Payment</p>
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
      </Modal>
    </div>
  );
};

export default Memberships;
