import { Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { updateOrderStatus } from "~/api/payment";
import { PAYMENT_STATUS } from "~/utils/constant";

export default function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const sendUpdateOrderStatus = async () => {
      try {
        const vnp_OrderInfo = searchParams.get("vnp_OrderInfo");
        const responseCode = searchParams.get("vnp_ResponseCode");

        if (responseCode === "00") {
          const orderInfo = JSON.parse(vnp_OrderInfo || "{}");
          const { paymentId, validTime, paymentType, bookId } = orderInfo;

          const body: any = {
            status: "SUCCESS",
          };

          if (validTime) {
            body.validTime = validTime;
          }

          const res = await updateOrderStatus(paymentId, body);

          if (res && !res.errorCode && !res.errors.length) {
            if (paymentType === "BOOK") {
              navigate(`/books/lists/${bookId}`);
            } else {
              navigate("/books");
            }
          } else {
            navigate("/books");
          }
        }
      } catch (error) {
        message.error("Payment fail");
      }
    };

    sendUpdateOrderStatus();
  }, []);

  return (
    <Spin
      tip="Successfully paid, redirecting..."
      style={{ width: "100%", marginTop: "25%" }}
    ></Spin>
  );
}
