
import { useQuery } from '@tanstack/react-query';
import { getPaymentHistoryAuthor } from '~/api/payment';

export const QK_PAYMENT_AUTHOR = 'payment/author';

export function usePaymentAuthor(params: any) {
  const res = useQuery([QK_PAYMENT_AUTHOR, {params}], () => getPaymentHistoryAuthor(params), {
    enabled: Boolean(params),
    keepPreviousData: true,
    refetchOnWindowFocus: false
  });
  return res;
}