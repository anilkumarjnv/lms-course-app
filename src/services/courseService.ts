/**
 * Mock course API.
 *
 * ARCHITECTURAL RULE: this is the ONLY module in the app permitted to import the
 * raw seed JSON. Screens, hooks, and components consume courses exclusively
 * through these async methods, so the entire data source can later be swapped
 * for a real backend without changing a single consumer.
 *
 * Every method returns a Promise resolved after an artificial delay (and may
 * reject based on `networkConfig.failureRate`) via {@link simulateNetwork}.
 */

import type {
  Category,
  Course,
  CoursePage,
  HomeFeed,
} from '@/types/course';
import { simulateNetwork } from '@/utils/delay';

import categoriesData from '@/data/categories.json';
import coursesData from '@/data/courses.json';

// The JSON literals are validated by hand against the domain models; cast once
// here so the rest of the module is fully typed.
const COURSES = coursesData as unknown as Course[];
const CATEGORIES = categoriesData as unknown as Category[];

/** id -> Course lookup, built once for O(1) access. */
const COURSE_BY_ID: ReadonlyMap<string, Course> = new Map(
  COURSES.map((course) => [course.id, course]),
);

const HERO_COUNT = 5;
const PAGE_SIZE = 6;

/** Resolve a list of ids to courses, silently dropping unknown ids. */
function resolveCourses(ids: readonly string[]): Course[] {
  const resolved: Course[] = [];
  for (const id of ids) {
    const course = COURSE_BY_ID.get(id);
    if (course) {
      resolved.push(course);
    }
  }
  return resolved;
}

export const courseService = {
  /**
   * Composed home feed: hero carousel, continue-learning row, and one row per
   * category. Built server-side (here) so the Home screen renders from a single
   * typed payload.
   */
  getHomeFeed(): Promise<HomeFeed> {
    const hero = [...COURSES]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, HERO_COUNT);

    const continueLearning = COURSES.filter(
      (course) => course.progress > 0,
    ).sort((a, b) => b.progress - a.progress);

    const categories = CATEGORIES.map((category) => ({
      id: category.id,
      title: category.title,
      courses: resolveCourses(category.courseIds),
    }));

    return simulateNetwork({ hero, continueLearning, categories });
  },

  /** Fetch a single course by id (undefined if not found). */
  getCourseById(id: string): Promise<Course | undefined> {
    return simulateNetwork(COURSE_BY_ID.get(id));
  },

  /** Fetch several courses by id, preserving input order. */
  getCoursesByIds(ids: readonly string[]): Promise<Course[]> {
    return simulateNetwork(resolveCourses(ids));
  },

  /** Courses in the same category as `courseId`, excluding it. */
  getRelatedCourses(courseId: string): Promise<Course[]> {
    const course = COURSE_BY_ID.get(courseId);
    if (!course) {
      return simulateNetwork<Course[]>([]);
    }
    const related = COURSES.filter(
      (candidate) =>
        candidate.category === course.category && candidate.id !== courseId,
    );
    return simulateNetwork(related);
  },

  /**
   * Case-insensitive search across title, category, and tags. An empty/blank
   * query resolves to an empty list.
   */
  searchCourses(query: string): Promise<Course[]> {
    const q = query.trim().toLowerCase();
    if (q.length === 0) {
      return simulateNetwork<Course[]>([]);
    }

    const results = COURSES.filter((course) => {
      const haystack = [
        course.title,
        course.category,
        ...course.tags,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });

    return simulateNetwork(results);
  },

  /**
   * Cursor-paginated "Browse all" list for infinite scroll. The cursor is a
   * stringified offset; pass `undefined`/`null` for the first page. `nextCursor`
   * is null once the final page has been served.
   */
  getCoursesPage(cursor?: string | null): Promise<CoursePage> {
    const start = cursor ? Number.parseInt(cursor, 10) : 0;
    const safeStart = Number.isNaN(start) ? 0 : start;
    const end = safeStart + PAGE_SIZE;

    const items = COURSES.slice(safeStart, end);
    const nextCursor = end < COURSES.length ? String(end) : null;

    return simulateNetwork({ items, nextCursor });
  },
};

export type CourseService = typeof courseService;
