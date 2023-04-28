import { sendGet, sendPost, sendPut } from "~/utils/axios";
import { PAYMENT_STATUS } from "~/utils/constant";

export const getAvailablePaymentMethod = () =>
  sendGet("/payment/available-payment-method");
export const createOrder = (bookId: string, method: string) =>
  sendPost("/payment/create-order", { bookId, method });
export const updateOrderStatus = (paymentId: string, status: PAYMENT_STATUS) =>
  sendPut(`/payment/${paymentId}/update-status`, { status });
export const createOrderMembership = (params: any) => sendPost('/payment/create-order-for-subscription', params)

export const getPaymentHistoryAdmin = (params: any) => sendGet('/admin/payment/list', params);
export const getPaymentHistoryAuthor = (params: any) => sendGet('/author/payment/list', params);
