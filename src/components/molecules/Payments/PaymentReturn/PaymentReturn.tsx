import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { updateOrderStatus } from "~/api/payment";
import { PAYMENT_STATUS } from "~/utils/constant";

export default function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const sendUpdateOrderStatus = async (status: PAYMENT_STATUS) => {
      try {
        const vnp_OrderInfo = searchParams.get("vnp_OrderInfo");

        console.log(vnp_OrderInfo);
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
