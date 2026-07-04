/**
 * Home feed query — bridges the mock service to the UI via React Query.
 *
 * The hook owns loading/error/refetch state; the screen just reads it. This is
 * the "hooks bridge services to components" boundary from the architecture.
 */

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryKeys';
import { courseService } from '@/services/courseService';
import type { HomeFeed } from '@/types/course';

export function useHomeFeed() {
  return useQuery<HomeFeed>({
    queryKey: queryKeys.homeFeed,
    queryFn: () => courseService.getHomeFeed(),
  });
}
