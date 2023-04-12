
import { useQuery } from '@tanstack/react-query';
import { getFriends } from '~/api/friend';

export const QK_FRIEND = 'friends';

export function useFriends(params: any) {
  const res = useQuery([QK_FRIEND, {params}], () => getFriends(params), {
    enabled: Boolean(params),
    keepPreviousData: true,
    refetchOnWindowFocus: false
  });
  return res;
}