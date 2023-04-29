import { sendPost } from "~/utils/axios";


export const registerForAuthor = (params: any) => sendPost(`/user/register-for-author`, params);