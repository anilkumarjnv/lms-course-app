/**
 * Resolves the watchlist store's course ids to full Course objects (via the
 * service). Re-runs whenever the saved ids change.
 */

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryKeys';
import { courseService } from '@/services/courseService';
import { useWatchlistStore } from '@/store/watchlistStore';
import type { Course } from '@/types/course';

export function useWatchlistCourses() {
  const ids = useWatchlistStore((state) => state.ids);

  const query = useQuery<Course[]>({
    queryKey: queryKeys.watchlistCourses(ids),
    queryFn: () => courseService.getCoursesByIds(ids),
    enabled: ids.length > 0,
  });

  return { ...query, ids };
}
