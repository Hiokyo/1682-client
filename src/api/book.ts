import { sendGet, sendPost, sendPut } from '~/utils/axios';

export const getBooks = (params: any) => sendGet('/book/list', params);
export const createBook = (params: any) => sendPost('/idea/create', params);
export const updateAction = (bookId: string, action: string) => sendPut(`/book/${bookId}/like-dislike/${action}`);
export const setComment = (bookId: string, params: any) => sendPut(`/book/${bookId}/comment`, params);
export const viewBook = (bookId: string) => sendPut(`/book/${bookId}/view`);