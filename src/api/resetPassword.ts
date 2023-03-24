import { sendPost, sendPut } from "~/utils/axios";

export const getResetPasswordCode = (email: string) => sendPut(`/user/${email}/request-reset-password`)
export const resetPassword = (code: string, email: string, params: any) => sendPut(`/user/${email}/reset-password/${code}`, params)
