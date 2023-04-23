
import { useQuery } from '@tanstack/react-query';
import { getFavoriteBooks } from '~/api/user';

export const QK_FAVORITE_BOOK = 'department';

export function useFavoriteBook(params: any) {
  const res = useQuery([QK_FAVORITE_BOOK, {params}], () => getFavoriteBooks(params), {
    enabled: Boolean(params),
    keepPreviousData: true,
    refetchOnWindowFocus: false
  });
  return res;
}