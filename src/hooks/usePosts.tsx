
import { useQuery } from '@tanstack/react-query';
import { getPostDetail, getPosts } from '~/api/post';

export const QK_POSTS = 'posts/list';
export const QK_POST_DETAIL = 'post/detail';

export function usePosts(params: any) {
  const res = useQuery([QK_POSTS, {params}], () => getPosts(params), {
    enabled: Boolean(params),
    keepPreviousData: true,
    refetchOnWindowFocus: false
  });
  return res;
}

export function usePostDetail(params: any) {
  const res = useQuery([QK_POST_DETAIL, {params}], () => getPostDetail(params), {
    enabled: Boolean(params),
    keepPreviousData: true,
    refetchOnWindowFocus: false
  });
  return res;
}