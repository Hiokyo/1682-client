import { Card, Button, Col, Row, message } from 'antd'
import React, { useEffect, useState } from 'react'

import styles from './styles.module.scss'
import { createOrderMembership, getAvailablePaymentMethod } from '~/api/payment';
import { setAvailableMethods, setCurrentOrder, setMethodUsed } from '~/store/payment';
import { RootState, useAppDispatch, useAppSelector } from "~/store";
import { getCookie } from '~/utils/cookie';
import ModalConfirm from '~/components/atoms/ModalConfirm';
const Memberships = () => {
  const [packageMember, setPackageMember] = useState({});
  const [disable, setDisable] = useState(false);
  const [visibleModalConfirm, setVisibleModalConfirm] = useState(false)
  const dispatch = useAppDispatch();
  const availablePaymentMethod = useAppSelector(
    (state: RootState) => state.payment.availableMethods
  );
  const userId = getCookie("userId");
  const methodUsed = useAppSelector(
    (state: RootState) => state.payment.methodUsed
  );
  const handleSubmit = async () => {
    if (JSON.stringify(methodUsed) === "{}") {
      return message.error("Please select method");
    }

    try {
      const res = await createOrderMembership({...packageMember, method: methodUsed._id});

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

  const handlePurchase = (month: number) => {
    if (month){
      switch (month) {
        case 1:
          setPackageMember({
            validTime: 1,
            amount: '100000',
            currency: 'VND',
          });
        case 6:
            setPackageMember({
              validTime: 6,
              amount: '600000',
              currency: 'VND',
            });
        case 12:
          setPackageMember({
            validTime: 12,
            amount: '1200000',
            currency: 'VND'
          });
        default:
          break;
      }
      setDisable(true)
      dispatch(
        setMethodUsed({
          name: availablePaymentMethod[0].name,
          _id: availablePaymentMethod[0]._id,
          note: availablePaymentMethod[0].note,
        })
      )
      setVisibleModalConfirm(true)
    }
  }



  return (
    <div className={styles.membershipContainer}>
      <Row gutter={16}>
        <Col span={8} xs={24}>
          <Card title=" 1 month" style={{ width: '100%' }}>
            <p>Read all book in 1 month.</p>
            <p>Price: $10</p>
            <Button

              onClick={() => handlePurchase(1)}
              type="primary" size="large">Buy</Button>
          </Card>
        </Col>
        <Col span={8} xs={24}>
          <Card title=" 6 month" style={{ width: '100%' }}>
            <p>Read all book in 3 month.</p>
            <p>Price: $25</p>
            <Button
              disabled={disable}
              onClick={() => handlePurchase(6)}
              type="primary" size="large">Buy</Button>
          </Card>
        </Col>
        <Col span={8} xs={24}>
          <Card title=" 12 month" style={{ width: '100%' }}>
            <p>Read all book in 6 month.</p>
            <p>Price: $40</p>
            <Button 
              disabled={disable}
              onClick={() =>handlePurchase(12)}
              type="primary" size="large">Buy</Button>
          </Card>
        </Col>
      </Row>
      <ModalConfirm
        title='Are you sure to purchase this package?'
        visible={visibleModalConfirm}
        onCancel={() =>setVisibleModalConfirm(false)}
        onOk={handleSubmit}
      />
    </div>
  );
}

export default Memberships