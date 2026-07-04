import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryKeys';
import { userService } from '@/services/userService';
import type { User } from '@/types/user';

export function useUser() {
  return useQuery<User>({
    queryKey: queryKeys.user,
    queryFn: () => userService.getCurrentUser(),
    staleTime: Infinity,
  });
}
