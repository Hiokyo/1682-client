
import { useQuery } from '@tanstack/react-query';
import { getReports } from '~/api/report';

export const QK_REPORT = 'report';

export function useReports(params: any) {
  const res = useQuery([QK_REPORT, {params}], () => getReports(params), {
    enabled: Boolean(params),
    keepPreviousData: true,
    refetchOnWindowFocus: false
  });
  return res;
}