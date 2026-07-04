/**
 * Phase 1 acceptance harness (run with: npx tsx scripts/verify-phase1.ts).
 *
 * Proves the mock service layer:
 *   1. resolves typed data after a visible artificial delay, and
 *   2. rejects every method when the failure rate is forced to 1.
 *
 * This is a dev-only check, not shipped app code.
 */

import { courseService } from '@/services/courseService';
import { NetworkError, networkConfig } from '@/utils/delay';

async function timed<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const start = Date.now();
  const result = await fn();
  const ms = Date.now() - start;
  console.log(`  ✓ ${label.padEnd(24)} ${ms}ms`);
  return result;
}

async function main(): Promise<void> {
  console.log('\n=== Phase 1: success path (visible delay, typed data) ===');

  const feed = await timed('getHomeFeed', () => courseService.getHomeFeed());
  console.log(
    `      hero=${feed.hero.length} continue=${feed.continueLearning.length} categories=${feed.categories.length}`,
  );

  const course = await timed('getCourseById(c1)', () =>
    courseService.getCourseById('c1'),
  );
  console.log(`      title="${course?.title}" modules=${course?.modules?.length ?? 0}`);

  const many = await timed('getCoursesByIds', () =>
    courseService.getCoursesByIds(['c4', 'c7', 'nope']),
  );
  console.log(`      resolved=${many.length} (unknown id dropped)`);

  const results = await timed('searchCourses("react")', () =>
    courseService.searchCourses('react'),
  );
  console.log(`      matches=${results.map((c) => c.id).join(', ')}`);

  const page = await timed('getCoursesPage', () =>
    courseService.getCoursesPage(),
  );
  console.log(`      items=${page.items.length} nextCursor=${page.nextCursor}`);

  console.log('\n=== Phase 1: failure path (FAILURE_RATE = 1 → all reject) ===');
  networkConfig.failureRate = 1;

  const calls: Array<[string, () => Promise<unknown>]> = [
    ['getHomeFeed', () => courseService.getHomeFeed()],
    ['getCourseById', () => courseService.getCourseById('c1')],
    ['getCoursesByIds', () => courseService.getCoursesByIds(['c1'])],
    ['searchCourses', () => courseService.searchCourses('react')],
    ['getCoursesPage', () => courseService.getCoursesPage()],
  ];

  let allRejected = true;
  for (const [label, fn] of calls) {
    try {
      await fn();
      allRejected = false;
      console.log(`  ✗ ${label} unexpectedly resolved`);
    } catch (err) {
      const kind = err instanceof NetworkError ? 'NetworkError' : 'Error';
      console.log(`  ✓ ${label.padEnd(24)} rejected (${kind})`);
    }
  }

  networkConfig.failureRate = 0;

  console.log(
    allRejected
      ? '\n✅ Phase 1 acceptance PASSED\n'
      : '\n❌ Phase 1 acceptance FAILED\n',
  );
  process.exit(allRejected ? 0 : 1);
}

main().catch((err) => {
  console.error('Verification crashed:', err);
  process.exit(1);
});
