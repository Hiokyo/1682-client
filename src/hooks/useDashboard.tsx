import { useQuery } from '@tanstack/react-query';
import { getInfoDashboard } from '~/api/dashboad';

export const QK_DASHBOARD = 'dashboard';

export function useDashboard(params: any) {
  const res = useQuery([QK_DASHBOARD, {params}], () => getInfoDashboard(), {
    enabled: Boolean(params),
    keepPreviousData: true,
    refetchOnWindowFocus: false
  });
  return res;
}