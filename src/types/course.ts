/**
 * Core domain models for the LMS content app.
 *
 * These types are the single source of truth for course-shaped data across the
 * service layer, hooks, and UI. Field names/shapes intentionally mirror the
 * build spec so the mock service can later be swapped for a real API without
 * touching consumers.
 */

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Module {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  /** Portrait image, used for cards. */
  thumbnail: string;
  /** Landscape image, used for hero/detail header. */
  backdrop: string;
  /** Completion ratio in the range 0..1. */
  progress: number;
  /** Human-readable total length, e.g. "6h 10m". */
  duration: string;
  level: CourseLevel;
  /** Rating in the range 0..5. */
  rating: number;
  description: string;
  tags: string[];
  /** Optional module/lesson list, present on detail-rich courses. */
  modules?: Module[];
}

export interface Category {
  id: string;
  title: string;
  courseIds: string[];
}

/**
 * Shape returned by the home feed. Composed server-side (in the mock) so the
 * Home screen renders directly from one typed payload rather than stitching
 * multiple calls together.
 */
export interface HomeFeed {
  /** Featured courses for the hero carousel. */
  hero: Course[];
  /** Courses with progress > 0, for the "Continue Learning" row. */
  continueLearning: Course[];
  /** One row per category, in display order. */
  categories: CategoryRow[];
}

export interface CategoryRow {
  id: string;
  title: string;
  courses: Course[];
}

/** Cursor-paginated result used by infinite scroll (Browse all). */
export interface CoursePage {
  items: Course[];
  /** Next cursor, or null when the last page has been reached. */
  nextCursor: string | null;
}
