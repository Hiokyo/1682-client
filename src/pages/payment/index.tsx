import { format } from "date-fns";
import React, { Fragment, useState } from "react";
import config from "./config";
import { sortObject } from "~/utils/helper";
import querystring from "qs";
import crypto from "crypto";

const paymentMethods = [
  {
    id: 1,
    label: "Thanh toán qua ATM-Tài khoản ngân hàng nội địa",
    value: "VNBANK",
  },
];

export default function Payment() {
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<string>(paymentMethods[0].value);

  const handleSubmit = () => {
    const date = new Date();
    const createDate = format(date, "yyyyMMddHHmmss");
    const ipAddr = "::1";
    const tmnCode = config.vnp_TmnCode;
    const secretKey = config.vnp_HashSecret;
    let vnpUrl = config.vnp_Url;
    const returnUrl = config.vnp_ReturnUrl;
    const orderId = format(date, "ddHHmmss");
    const locale = "en";
    const currCode = "VND";
    let vnp_Params: any = {};

    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    vnp_Params["vnp_BankCode"] = method;

    vnp_Params = sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    window.open(vnpUrl, "_blank");
  };

  return (
    <>
      <div>New Order</div>

      <input
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        type="number"
      />

      <div>Select payment method</div>

      {paymentMethods.map((item) => (
        <Fragment key={item.id}>
          <input
            type="radio"
            value={item.value}
            onChange={(e) => setMethod(e.target.value)}
          />
          <label>{item.label}</label>
        </Fragment>
      ))}

      <button onClick={handleSubmit}>Thanh toan</button>

      {/* <select value={method} onChange={(e) => console.log(e)}>
        {paymentMethods.map((item) => (
          <option value={item.value} key={item.id}>
            {item.label}
          </option>
        ))}
      </select> */}
    </>
  );
}
