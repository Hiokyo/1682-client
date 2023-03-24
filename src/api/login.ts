import { sendPost, sendPut } from "~/utils/axios";

export const setLogin = (params: any) => sendPost('/auth/login', params);
export const setActive = (code: any ,params: any) => sendPut(`/auth/activate/${code}`, params)
