import { sendGet, sendPost, sendPut } from '~/utils/axios';

export const getCategories = (params: any) => sendGet('/topic/list', params);
export const createCategory = (params: any) => sendPost('/admin/topic/create', params);
export const updateCategory = (topicId: string ,params: any) => sendPut(`/admin/topic/${topicId}/update`, params);
export const inactiveCategory = (categoryId: any) => sendPut(`/category/${categoryId}/deactivate`);
