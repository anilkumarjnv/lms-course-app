import { courseService } from '@/services/courseService';
import { NetworkError, networkConfig } from '@/utils/delay';

// Remove artificial latency so tests run fast; failureRate is set per-case.
beforeAll(() => {
  networkConfig.minDelayMs = 0;
  networkConfig.maxDelayMs = 0;
});
beforeEach(() => {
  networkConfig.failureRate = 0;
});

describe('courseService (success path)', () => {
  test('getHomeFeed returns hero, continue-learning, and categories', async () => {
    const feed = await courseService.getHomeFeed();
    expect(feed.hero.length).toBeGreaterThan(0);
    expect(feed.categories.length).toBeGreaterThan(0);
    // Continue-learning only contains in-progress courses.
    expect(feed.continueLearning.every((c) => c.progress > 0)).toBe(true);
  });

  test('getCourseById returns the course, or undefined for unknown ids', async () => {
    expect((await courseService.getCourseById('c1'))?.id).toBe('c1');
    expect(await courseService.getCourseById('does-not-exist')).toBeUndefined();
  });

  test('searchCourses filters case-insensitively; blank query is empty', async () => {
    const results = await courseService.searchCourses('react');
    expect(results.map((c) => c.id)).toContain('c1');
    expect(await courseService.searchCourses('   ')).toEqual([]);
  });

  test('getCoursesPage paginates with a nextCursor', async () => {
    const page = await courseService.getCoursesPage();
    expect(page.items.length).toBeGreaterThan(0);
    expect(page.nextCursor).not.toBeNull();
  });
});

describe('courseService (failure path)', () => {
  test('rejects with NetworkError when failureRate = 1', async () => {
    networkConfig.failureRate = 1;
    await expect(courseService.getHomeFeed()).rejects.toBeInstanceOf(NetworkError);
    await expect(courseService.searchCourses('react')).rejects.toBeInstanceOf(
      NetworkError,
    );
  });
});
