import { sendDelete, sendGet, sendPost, sendPut } from '~/utils/axios';

export const getBooks = (params: any) => sendGet('/book/list', params);
export const getBookDetail = (params: any) => sendGet('/book', params);
export const createBook = (params: any) => sendPost('/idea/create', params);
export const updateAction = (bookId: string, action: string) => sendPut(`/book/${bookId}/like-dislike/${action}`);
export const setComment = (bookId: string, params: any) => sendPut(`/book/${bookId}/comment`, params);
export const editBookComment = (bookId: string, commentId: string, params: any) => sendPut(`/book/${bookId}/edit-comment/${commentId}`, params);
export const deleteBookComment = (bookId: string, commentId: string) => sendDelete(`/book/${bookId}/delete-comment/${commentId}`);
export const viewBook = (bookId: string) => sendPut(`/book/${bookId}/view`);
