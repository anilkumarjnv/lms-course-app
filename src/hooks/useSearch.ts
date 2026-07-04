/**
 * Search query. Disabled while the (already-debounced) query is blank so we
 * don't hit the service for empty input.
 */

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryKeys';
import { courseService } from '@/services/courseService';
import type { Course } from '@/types/course';

export function useSearch(query: string) {
  return useQuery<Course[]>({
    queryKey: queryKeys.search(query),
    queryFn: () => courseService.searchCourses(query),
    enabled: query.trim().length > 0,
  });
}
