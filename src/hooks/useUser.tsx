import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from '~/api/user';

export const QK_USER = 'user';

export function useUser(userId: any) {
  const res = useQuery([QK_USER, {userId}], () => getUserInfo(userId), {
    enabled: Boolean(userId),
    keepPreviousData: true,
    refetchOnWindowFocus: false
  });
  return res;
}