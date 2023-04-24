import { sendDelete, sendGet, sendPost, sendPut } from '~/utils/axios';

export const getPosts = (params: any) => sendGet('/post/list', params);
export const getPostDetail = (params: any) => sendGet(`/post`, params);

export const setPost = (params: any) => sendPost('/post/create', params);
export const updatePost = (postId: string, params: any) => sendPut(`/post/${postId}/update`, params);

export const updateActionPost = (postId: string, action: string) => sendPut(`/post/${postId}/like-dislike/${action}`);
export const setCommentPost = (postId: string, params: any) => sendPut(`/post/${postId}/comment`, params);
export const editPostComment = (postId: string, commentId: string, params: any) => sendPut(`/post/${postId}/edit-comment/${commentId}`, params);
export const deletePostComment = (postId: string, commentId: string) => sendDelete(`/post/${postId}/delete-comment/${commentId}`);
