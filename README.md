# LearnHub — Mobile LMS (React Native / Expo)

A mobile-first Learning Management System built as a **Hotstar-style content app**,
re-themed for course discovery. Hero banners are featured courses, carousels are
course categories, "Continue Watching" becomes "Continue Learning", and the player
surface plays lessons/modules. This mapping keeps the polished streaming UX while
modelling the real product: discovery → detail → playback → progress.

> Built phase-by-phase; each phase is a clean commit.

## Features

- **Home** — edge-peek hero carousel with overlaid **Play / Add** controls, landscape
  **Continue Learning** resume cards (progress + "time left"), a **Top Courses** ranked
  rail (gradient numerals, category filter chips), and per-category rows.
- **Detail** — Reanimated collapsing/parallax header, metadata chips, progress-aware
  **Resume/Enroll**, **Watchlist** toggle, expandable About, module list with completion,
  related courses, and a **WebView** syllabus link.
- **Player** — immersive "Now Playing" surface (play/pause, ±10s, scrubber + clock,
  up-next modules).
- **Search** — debounced query, results list, prompt/skeleton/empty/error states.
- **Profile** — mock user, dark-mode + notifications toggles, **local notification** that
  deep-links into a course on tap, watchlist section, logout.
- **Browse all** — infinite scroll (`useInfiniteQuery`).
- **Cross-cutting** — light/dark theming, skeleton/empty/error on every async surface,
  pull-to-refresh, haptics, press micro-interactions, shimmer skeletons, deep links
  (`app://detail/:id`), and a WebView `postMessage` bridge.

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | Expo SDK 57 (managed / CNG), React Native 0.81, React 19 |
| Language | TypeScript (strict, `noUncheckedIndexedAccess`) |
| Styling | NativeWind v4 (design tokens via CSS variables) |
| Navigation | React Navigation v7 (native stack + bottom tabs) |
| Server state | `@tanstack/react-query` v5 |
| Client/UI state | `zustand` (theme, watchlist) |
| Images | `expo-image` (blurhash placeholders) |
| Component library | React Native Paper (themed `Switch`) |
| Animation | `react-native-reanimated` v4 |
| Others | `expo-linear-gradient`, `@react-native-masked-view/masked-view`, `react-native-webview`, `expo-notifications`, `expo-haptics` |
| Testing | Jest (`jest-expo`) + `@testing-library/react-native` |

## Getting started

```bash
npm install

# Run a development build on iOS (recommended — see note below)
npm run ios          # expo run:ios  (prebuild + native build + launch)
# or Android
npm run android

npm test             # unit tests
npm run typecheck    # tsc --noEmit
```

> **Why a development build, not Expo Go?** On the current toolchain, Expo Go 57 crashes
> at startup on the iOS simulators here (an `expo-notifications` native crash on iOS 26,
> and a `react-native-worklets` JSI mismatch on iOS 18.5) — both are Expo Go binary issues,
> not app code. A development build compiles the native modules from this project at
> matching versions and runs cleanly. This is still the **managed / CNG** workflow:
> `ios/` and `android/` are git-ignored, generated artifacts (`expo prebuild`), and
> `app.json` remains the single source of truth. For a shareable build, use **EAS Build**.

## Architecture

```
src/
  services/    mock API (courseService, userService, notificationService)
  hooks/       React Query + small hooks bridging services -> UI
  store/       zustand (themeStore, watchlistStore)
  screens/     Home, Detail, Player, Search, Profile, Browse, WebView
  components/   presentational, prop-driven, reusable
  theme/       tokens + ThemeProvider (+ Paper bridge)
  navigation/  RootNavigator, tabs, deep-link config
  constants/   strings (all UI copy), images
  utils/       delay (mock network), format, haptics, analytics
  data/        seed JSON (imported ONLY by services)
```

**Layering.** Screens orchestrate, components render from props, services fetch, hooks
bridge services to components. The single most important rule: **only `services/` may
import the seed JSON** — so the entire data source can be swapped for a real API without
touching a single consumer. All user-facing copy lives in `constants/strings.ts`; screens
contain no hardcoded strings.

**Mock service layer.** Every call goes through `simulateNetwork` (artificial latency +
a tunable `networkConfig.failureRate`), so the UI exercises real loading / success / error
paths. Flip `failureRate` to `1` to demo error states.

### Why React Query **and** Zustand (the split)

They solve different problems, and conflating them causes bugs:

- **React Query owns server/async state** — course data from the service. It gives caching,
  dedup, `isLoading`/`isError`, `refetch`, and pagination (`useInfiniteQuery`) for free.
  Putting this in a global store would mean hand-rolling cache invalidation and loading
  flags.
- **Zustand owns client/UI state** — theme and watchlist. These are synchronous, local, and
  have no server representation. Modelling a UI toggle as a "query" would be awkward; a tiny
  store is the right tool and avoids prop-drilling.

Rule of thumb used throughout: *if it comes from (or goes to) the server, it's React Query;
if it's local UI state, it's Zustand.*

### Why React Native Paper (not Gluestack)

The brief asked for Gluestack UI, with **React Native Paper as the sanctioned fallback if
Gluestack causes setup friction**. On this bleeding-edge stack (SDK 57 / React 19),
Gluestack v2's interactive CLI setup was risky, so Paper was used for the required library
primitive (the Profile `Switch`), themed by mapping our design tokens onto Paper's MD3
theme (`AppPaperProvider`). Everything visual/branded (cards, hero, player, ranked rail)
stays **custom**, exactly as the brief prescribes.

### Theming

`theme/tokens.ts` is the single source of truth. `ThemeProvider` injects the active palette
as **NativeWind CSS variables** (`rgb(var(--color-*) / <alpha-value>)`, so opacity
modifiers keep working) *and* exposes the raw hex via context for imperative consumers
(React Navigation theme, StatusBar, icons). Toggling theme rebuilds the variables, so the
whole app re-themes instantly — no hardcoded hex in components.

## Performance

Graded surface, so the FlatList tuning is deliberate:

- **Stable keys** — every list uses `keyExtractor={(i) => i.id}`, never index.
- **Memoized render paths** — cards are `React.memo`; `renderItem` and `keyExtractor` are
  `useCallback`.
- **`getItemLayout`** — provided wherever item size is fixed (card stride, row height), so
  the list skips async on-scroll measurement.
- **Windowing numbers, and why:**
  - *Horizontal course rows* — `initialNumToRender=4`, `maxToRenderPerBatch=4`,
    `windowSize=5`, `removeClippedSubviews`. ~2–3 cards are visible; render a few ahead for
    smooth swipes, but keep the retained window small since a row is short and off-screen
    cards are cheap to drop.
  - *Vertical lists (Search / Browse)* — `initialNumToRender=8`, `maxToRenderPerBatch=8`,
    `windowSize=7`. ~8 rows fill a phone screen, so render one screenful up front and keep
    ~3 screens of buffer for fast flings without over-rendering.
  - *Hero pager* — `initialNumToRender=2`, `windowSize=3`. Items are large and full-width;
    keep only the neighbours mounted.
- **Images** — `expo-image` with a blurhash placeholder and a cross-fade `transition`, so
  cards fade in instead of popping.
- **Derived work** — `useMemo` only where there's real cost (e.g. Top Courses filtering);
  trivial values are left un-memoized.

## Testing

`npm test` — Jest + React Testing Library:

- **`courseService`** — resolves typed data; rejects with `NetworkError` when
  `failureRate = 1`.
- **`format` utils** — percent, rating, meta line, duration parsing, time-left, clock.
- **`CourseCard`** — renders the title and fires `onPress` with the course id.

Native modules (icons, image, gradient, masked-view, haptics, Reanimated) are stubbed in
`jest.setup.js` so component tests run under Node.

## What I'd do next

- **Persistence** — `zustand/persist` + AsyncStorage for watchlist and theme; hydrate
  React Query from cache for offline-first.
- **Real backend** — swap the mock `courseService` for a REST/GraphQL client (the service
  boundary means consumers don't change) and add optimistic watchlist mutations.
- **Real playback** — replace the Player stub with `expo-video`, resume positions, and
  per-module progress tracking.
- **More tests** — a Home skeleton→content integration test, Detail watchlist flow, and E2E
  (Maestro/Detox) for the notification → deep-link path.
- **A11y & i18n** — audit labels/contrast; move `constants/strings` behind an i18n library.
- **CI** — GitHub Actions running `typecheck` + `test`, and EAS build/submit.

## Deployment

Managed/CNG, so the shareable build is produced with **EAS Build** (`eas build -p ios|android`)
— no committed native folders. See the "development build" note above for local runs.
