import { useQuery } from '@tanstack/react-query';
import { getPostByUser } from '~/api/user';

export const QK_POST_USER = 'user/post/list';

export function usePostByUser(params: any) {
  const res = useQuery([QK_POST_USER, {params}], () => getPostByUser(params), {
    enabled: Boolean(params),
    keepPreviousData: true,
    refetchOnWindowFocus: false
  });
  return res;
}