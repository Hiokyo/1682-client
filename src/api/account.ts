import { sendDelete, sendGet, sendPost, sendPut } from "~/utils/axios";

export const createAccount = (params: any) => sendPost('/admin/auth/signup', params);
export const getAccounts = (params: any) => sendGet('/user/list', params);
export const inactiveAcount = (userId: any) => sendPut(`/admin/auth/${userId}/deactivate`);

