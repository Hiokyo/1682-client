import { sendGet, sendPut } from "~/utils/axios";

export const getUserInfo = () => sendGet('/user/profile');
export const updateUserInfo = (userId: any, params: any) => sendPut(`/user/${userId}/update`, params);
export const setAvatar = (userId: any, params: any) => sendPut(`/user/${userId}/upload-avatar`, params);
export const changeDepartment = (userId: any, params: any) => sendPut(`/admin/user/${userId}/change-department`, params);