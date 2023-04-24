import { message } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { createOrder, getAvailablePaymentMethod } from "~/api/payment";
import { RootState, useAppDispatch, useAppSelector } from "~/store";
import {
  setAvailableMethods,
  setCurrentOrder,
  setMethodUsed,
} from "~/store/payment";

export default function Payment() {
  const [amount, setAmount] = useState<number>(0);
  const availablePaymentMethod = useAppSelector(
    (state: RootState) => state.payment.availableMethods
  );
  const methodUsed = useAppSelector(
    (state: RootState) => state.payment.methodUsed
  );

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
      <div>New Order</div>

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

      <button onClick={handleSubmit}>Thanh toan</button>
    </>
  );
}
