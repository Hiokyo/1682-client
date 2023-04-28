
import { useQuery } from '@tanstack/react-query';
import { getPaymentHistoryAdmin } from '~/api/payment';

export const QK_PAYMENT_ADMIN = 'payment/admin';

export function usePaymentAdmin(params: any) {
  const res = useQuery([QK_PAYMENT_ADMIN, {params}], () => getPaymentHistoryAdmin(params), {
    enabled: Boolean(params),
    keepPreviousData: true,
    refetchOnWindowFocus: false
  });
  return res;
}