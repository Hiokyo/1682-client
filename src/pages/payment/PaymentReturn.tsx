import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { updateOrderStatus } from "~/api/payment";
import { RootState, useAppSelector } from "~/store";
import { PAYMENT_STATUS } from "~/utils/constant";

export default function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<string>("");
  const currentOrder = useAppSelector(
    (state: RootState) => state.payment.currentOrder
  );

  useEffect(() => {
    const sendUpdateOrderStatus = async (status: PAYMENT_STATUS) => {
      try {
        const res = await updateOrderStatus(currentOrder, status);

        if (res && !res.errorCode && !res.errors.length) {
          message.success("Order successfully executed");
        } else {
          message.error("Payment fail");
        }
      } catch (error) {
        message.error("Payment fail");
      }
    };
    const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");

    setStatus(() => vnp_ResponseCode || "");

    let status;

    if (vnp_ResponseCode === "00") {
      status = PAYMENT_STATUS.SUCCESS;
    } else {
      status = PAYMENT_STATUS.FAILURE;
    }

    sendUpdateOrderStatus(status);
  }, []);

  return <div>{status === "00" ? "Success" : "Failure"}</div>;
}
