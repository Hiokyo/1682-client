
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '~/api/post';

export const QK_POSTS = 'posts/list';

export function usePosts(params: any) {
  const res = useQuery([QK_POSTS, {params}], () => getPosts(params), {
    enabled: Boolean(params),
    keepPreviousData: true,
    refetchOnWindowFocus: false
  });
  return res;
}