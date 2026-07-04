/**
 * Centralized React Query keys.
 *
 * One place to define cache keys keeps invalidation predictable and avoids
 * typo-drift between hooks. Factory functions return `as const` tuples so keys
 * are stable and type-safe.
 */

export const queryKeys = {
  homeFeed: ['home-feed'] as const,
  courseDetail: (id: string) => ['course', id] as const,
  relatedCourses: (id: string) => ['course', id, 'related'] as const,
  coursesByIds: (ids: readonly string[]) => ['courses', 'by-ids', ...ids] as const,
  search: (query: string) => ['search', query] as const,
  coursesInfinite: ['courses', 'infinite'] as const,
  user: ['user'] as const,
  watchlistCourses: (ids: readonly string[]) => ['watchlist', ...ids] as const,
};
