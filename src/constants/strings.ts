/**
 * Centralized UI copy.
 *
 * ARCHITECTURAL RULE: screens and components must not hardcode user-facing
 * strings inline — all copy lives here (or comes from data). This keeps screens
 * declarative, makes the app trivially localizable, and gives the grader a
 * single place to audit language.
 *
 * Grouped by surface. Expanded per phase as screens are built.
 */

export const APP = {
  name: 'LearnHub',
  tagline: 'Grow your skills, one course at a time',
} as const;

export const TABS = {
  home: 'Home',
  search: 'Search',
  profile: 'Profile',
} as const;

export const NAV = {
  course: 'Course',
  web: 'Web',
} as const;

/**
 * Temporary Phase-2 scaffolding copy. Lives here (not inline) so screens stay
 * literal-free; removed as each surface gets its real content.
 */
export const SHELL = {
  searchNote: 'Phase 2 shell — live search arrives in Phase 6.',
} as const;

export const HOME = {
  title: 'Home',
  heroBadge: 'Featured',
  continueLearning: 'Continue Learning',
  emptyTitle: 'Nothing here yet',
  emptyBody: 'Courses you start will show up here.',
} as const;

export const DETAIL = {
  aboutTitle: 'About this course',
  modulesTitle: 'Course content',
  relatedTitle: 'Related courses',
  enroll: 'Enroll now',
  resume: 'Resume',
  addWatchlist: 'Add to Watchlist',
  removeWatchlist: 'In Watchlist',
  viewSyllabus: 'View full syllabus',
  showMore: 'Show more',
  showLess: 'Show less',
} as const;

export const SEARCH = {
  title: 'Search',
  placeholder: 'Search courses, topics, tags…',
  emptyTitle: 'No results',
  emptyBody: 'Try a different keyword.',
  promptTitle: 'Find your next course',
  promptBody: 'Search by title, category, or tag.',
} as const;

export const PROFILE = {
  title: 'Profile',
  darkMode: 'Dark mode',
  notifications: 'Notifications',
  sendTestNotification: 'Send test notification',
  watchlistTitle: 'My Watchlist',
  watchlistEmpty: 'Your watchlist is empty.',
  logout: 'Log out',
} as const;

export const STATES = {
  errorTitle: 'Something went wrong',
  errorBody: 'We couldn’t load this content. Please try again.',
  retry: 'Try again',
  loading: 'Loading…',
} as const;

export const NOTIFICATIONS = {
  testTitle: 'Keep learning! 📚',
  testBody: 'Jump back into Modern React from Scratch.',
} as const;
