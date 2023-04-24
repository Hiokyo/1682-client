import { sendGet, sendPost, sendPut } from "~/utils/axios";
import { PAYMENT_STATUS } from "~/utils/constant";

export const getAvailablePaymentMethod = () =>
  sendGet("/payment/available-payment-method");
export const createOrder = (amount: string, method: string) =>
  sendPost("/payment/create-order", { amount, method });
export const updateOrderStatus = (paymentId: string, status: PAYMENT_STATUS) =>
  sendPut(`/payment/${paymentId}/update-status`, { status });
