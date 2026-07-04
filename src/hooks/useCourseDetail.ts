/**
 * Course detail + related-courses queries.
 *
 * Related courses are a separate query so they load/refetch independently of
 * the main detail payload and get their own cache entry.
 */

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryKeys';
import { courseService } from '@/services/courseService';
import type { Course } from '@/types/course';

export function useCourseDetail(courseId: string) {
  return useQuery<Course | undefined>({
    queryKey: queryKeys.courseDetail(courseId),
    queryFn: () => courseService.getCourseById(courseId),
  });
}

export function useRelatedCourses(courseId: string) {
  return useQuery<Course[]>({
    queryKey: queryKeys.relatedCourses(courseId),
    queryFn: () => courseService.getRelatedCourses(courseId),
  });
}
