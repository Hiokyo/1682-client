import { sendGet, sendPut } from "~/utils/axios";

export const getUserInfo = (userId: any) => sendGet(`/user/${userId}/profile`);

export const updateUserInfo = (userId: any, params: any) =>
  sendPut(`/user/${userId}/update`, params);

export const setAvatar = (userId: any, params: any) =>
  sendPut(`/user/${userId}/upload-avatar`, params);

export const changeDepartment = (userId: any, params: any) =>
  sendPut(`/admin/user/${userId}/change-department`, params);

export const getMessages = (receiver: string) =>
  sendGet("/user/messages", { receiver });

export const sendMessage = (receiver: string, content: string) =>
  sendPut(`/user/chat/${receiver}`, { content });

export const getAllMessages = () => sendGet("/user/all-messages");

export const getPostByUser = (params: any) => sendGet(`/user/post/list`, params);

