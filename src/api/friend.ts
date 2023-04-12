import { sendGet, sendPut } from "~/utils/axios";

export const getFriends = (params: any) => sendGet('/user/follows', params);
export const addFriend = (userId: string) => sendPut(`/user/follow/${userId}`);
export const unFriend = (userId: string) => sendPut(`/user/unfollow/${userId}`);
