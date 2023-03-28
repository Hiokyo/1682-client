import { sendPost, sendPut } from "~/utils/axios";


export const createReport = (params: any) => sendPost(`report/create`, params);
