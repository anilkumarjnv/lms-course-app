/**
 * Cursor-paginated "Browse all" list for the infinite-scroll screen.
 * Wraps courseService.getCoursesPage in React Query's useInfiniteQuery.
 */

import { useInfiniteQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryKeys';
import { courseService } from '@/services/courseService';

export function useInfiniteCourses() {
  return useInfiniteQuery({
    queryKey: queryKeys.coursesInfinite,
    queryFn: ({ pageParam }) => courseService.getCoursesPage(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}
