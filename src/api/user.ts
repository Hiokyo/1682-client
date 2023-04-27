import { sendGet, sendPut } from "~/utils/axios";

export const getUserInfo = (userId: any) => sendGet(`/user/${userId}/profile`);

export const updateUserInfo = (params: any) => sendPut(`/user/edit-profile`, params);

export const setAvatar = (params: any) =>
  sendPut(`/user/upload-avatar`, params);

export const changeDepartment = (userId: any, params: any) =>
  sendPut(`/admin/user/${userId}/change-department`, params);

export const getMessages = (receiver: string) =>
  sendGet("/user/messages", { receiver });

export const sendMessage = (receiver: string, content: string) =>
  sendPut(`/user/chat/${receiver}`, { content });

export const getAllMessages = () => sendGet("/user/all-messages");

export const getPostByUser = (params: any) => sendGet(`/user/post/list`, params);

export const addBookFavorite = (bookId: any) => sendPut(`/user/add-favorite/${bookId}`);
export const removeBookFavorite = (bookId: any) => sendPut(`/user/remove-favorite/${bookId}`);

export const getFavoriteBooks = (params: any) => sendGet(`/user/favorites`, params);

export const warningUser = (userId: string, params: any) => sendPut(`/admin/user/${userId}/warn`, params);



