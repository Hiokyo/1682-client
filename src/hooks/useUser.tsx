import { useQuery } from '@tanstack/react-query';
import { getPostByUser, getUserInfo } from '~/api/user';

export const QK_USER = 'user';
export const QK_POST_USER = 'user/post/list';

export function useUser(userId: any) {
  const res = useQuery([QK_USER, {userId}], () => getUserInfo(userId), {
    enabled: Boolean(userId),
    keepPreviousData: true,
    refetchOnWindowFocus: false
  });
  return res;
}

export function usePostByUser(params: any) {
  const res = useQuery([QK_USER, {params}], () => getPostByUser(params), {
    enabled: Boolean(params),
    keepPreviousData: true,
    refetchOnWindowFocus: false
  });
  return res;
}