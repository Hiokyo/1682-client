import { sendPost } from "~/utils/axios";

export const setRegister = (params: any) => sendPost('/api/user/register', params);
