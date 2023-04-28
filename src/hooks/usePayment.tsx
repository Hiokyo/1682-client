import { useQuery } from '@tanstack/react-query';
import { getPaymentHistoryAdmin, getPaymentHistoryAuthor } from '~/api/payment';

export const QK_PAYMENT = 'payment';
export const QK_PAYMENT_AUTHOR = 'payment-author';

export function usePaymentAdmin(params: any) {
  const res = useQuery([QK_PAYMENT], () => getPaymentHistoryAdmin(params), {
    enabled: Boolean(params),
    keepPreviousData: true,
    refetchOnWindowFocus: false
  });
  return res;
}

export function usePaymentAuthor(params: any) {
  const res = useQuery([QK_PAYMENT_AUTHOR], () => getPaymentHistoryAuthor(params), {
    enabled: Boolean(params),
    keepPreviousData: true,
    refetchOnWindowFocus: false
  });
  return res;
}