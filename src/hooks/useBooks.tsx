
import { useQuery } from '@tanstack/react-query';
import { getBookDetail, getBooks } from '~/api/book';

export const QK_BOOKS = 'books/list';
export const QK_BOOK_DETAIL = 'book/detail';

export function useBooks(params: any) {
  const res = useQuery([QK_BOOKS, {params}], () => getBooks(params), {
    enabled: Boolean(params),
    keepPreviousData: true,
    refetchOnWindowFocus: false
  });
  return res;
}

export function useBookDetail(params: any) {
  const res = useQuery([QK_BOOK_DETAIL, {params}], () => getBookDetail(params), {
    enabled: Boolean(params),
    keepPreviousData: true,
    refetchOnWindowFocus: false
  });
  return res;
}