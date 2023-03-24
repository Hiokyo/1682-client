
import { useQuery } from '@tanstack/react-query';
import { getBooks } from '~/api/book';

export const QK_BOOKS = 'books/list';

export function useBooks(params: any) {
  const res = useQuery([QK_BOOKS, {params}], () => getBooks(params), {
    enabled: Boolean(params),
    keepPreviousData: true,
    refetchOnWindowFocus: false
  });
  return res;
}