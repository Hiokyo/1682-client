import { sendGet, sendPost, sendPut } from '~/utils/axios';

export const getPosts = (params: any) => sendGet('/post/list', params);
export const setPost = (params: any) => sendPost('/post/create', params);
export const updateActionPost = (postId: string, action: string) => sendPut(`/post/${postId}/like-dislike/${action}`);
export const setCommentPost = (postId: string, params: any) => sendPut(`/post/${postId}/comment`, params);