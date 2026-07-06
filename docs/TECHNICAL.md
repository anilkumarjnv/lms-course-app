# LearnHub — Technical Architecture

A deep dive into how the app is built and *why*. For a quick overview, features, and
screenshots, see the [README](../README.md).

## Contents

1. [Overview & goals](#1-overview--goals)
2. [Architecture & layering](#2-architecture--layering)
3. [Data layer (mock service)](#3-data-layer-mock-service)
4. [State management — React Query + Zustand](#4-state-management--react-query--zustand)
5. [Design system & theming](#5-design-system--theming)
6. [Component library choice](#6-component-library-choice)
7. [Navigation & deep linking](#7-navigation--deep-linking)
8. [Notifications](#8-notifications)
9. [WebView ↔ RN bridge](#9-webview--rn-bridge)
10. [Animations & micro-interactions](#10-animations--micro-interactions)
11. [Performance optimizations](#11-performance-optimizations)
12. [Type safety](#12-type-safety)
13. [Testing](#13-testing)
14. [Build & runtime decisions](#14-build--runtime-decisions)
15. [Trade-offs & limitations](#15-trade-offs--limitations)

---

## 1. Overview & goals

The brief was to clone a Hotstar-style content app; the target role is a mobile-first LMS. So
the app deliberately maps streaming UX onto learning: **hero = featured course, carousels =
categories, "continue watching" = "continue learning", player = lesson playback.** This keeps a
familiar, polished feel while modelling the real product flow: **discover → detail → play → track
progress.**

Engineering goals, in priority order:

1. **Clean separation of concerns** — so the mock backend could become a real one with zero UI
   churn.
2. **A single, consistent design system** — no hardcoded colors or copy anywhere in components.
3. **Real-world robustness** — every async surface has loading / empty / error states.
4. **Performance by default** — memoized, virtualized lists tuned per usage.

---

## 2. Architecture & layering

```
src/
  services/    mock API (course / user / notification) — the ONLY layer that reads seed JSON
  hooks/       React Query hooks bridging services -> UI
  store/       zustand stores (theme, watchlist)
  screens/     Home · Detail · Player · Search · Profile · Browse · WebView
  components/  presentational, prop-driven, reusable
  theme/       tokens.ts (source of truth) + ThemeProvider + Paper bridge
  navigation/  RootNavigator, BottomTabNavigator, linking config
  constants/   strings.ts (all UI copy) + images.ts
  utils/       delay (network sim), format, haptics, analytics
  types/       Course/Module/Category, User, navigation param lists
  data/        seed JSON
```

**The rule that drives everything:** *screens orchestrate, components render from props, services
fetch, hooks bridge.*

```
 data/*.json ──▶ services/ ──▶ hooks/ (React Query) ──▶ screens/ ──▶ components/
   (seed)        (fetch +        (cache, loading,        (compose)     (render from
                  simulate)       error, refetch)                        props only)
```

Two invariants enforced across the codebase:

- **Only `services/` imports the seed JSON.** Every screen/hook/component consumes courses through
  the async service API. Swapping the mock for a real REST/GraphQL client is a change to one
  folder.
- **No hardcoded UI copy in screens.** All strings come from `constants/strings.ts`, which keeps
  screens declarative and makes the app trivially localizable.

A screen therefore contains almost no data or styling logic — it wires a hook to a few components.

---

## 3. Data layer (mock service)

`services/courseService.ts` is the single source of course data. Every method returns a Promise
routed through a network simulator so the UI exercises **real** async behaviour:

```ts
// utils/delay.ts
export const networkConfig = { failureRate: 0, minDelayMs: 500, maxDelayMs: 1200 };

export async function simulateNetwork<T>(data: T, options?): Promise<T> {
  await delay(randomBetween(min, max));           // artificial latency
  if (Math.random() < failureRate) throw new NetworkError(); // simulatable failure
  return data;
}
```

- **Artificial latency** means skeletons, spinners, and transitions are genuinely visible and
  tested — not just theoretical.
- **`failureRate`** is a runtime dial: set it to `1` and every request rejects, so error states
  (with retry) can be demoed on demand.

The service exposes exactly what the screens need: `getHomeFeed`, `getCourseById`,
`getRelatedCourses`, `searchCourses`, `getCoursesPage` (cursor pagination for infinite scroll).
The home feed is composed server-side (hero + continue-learning + category rows) so the Home
screen renders one typed payload instead of stitching calls together.

---

## 4. State management — React Query + Zustand

The app uses **two** state tools on purpose, because they solve different problems and conflating
them causes bugs.

| Concern | Tool | Why |
| --- | --- | --- |
| Course data, search, pagination | **React Query** | It's *server state* — needs caching, dedup, `isLoading`/`isError`, `refetch`, and infinite queries. Hand-rolling that in a global store means reinventing cache invalidation. |
| Theme, watchlist | **Zustand** | *Local UI state* — synchronous, no server representation. A tiny store avoids prop-drilling; modelling a UI toggle as a "query" would be awkward. |

> Rule of thumb used throughout: **from the server → React Query; local UI → Zustand.**

- React Query keys live in one place (`lib/queryKeys.ts`) so invalidation is predictable.
- Hooks (`useHomeFeed`, `useCourseDetail`, `useSearch`, `useInfiniteCourses`, `useWatchlistCourses`)
  are the *only* thing screens import for data — they hide the service and the query wiring.
- Zustand stores are minimal: `themeStore` (mode + toggle, seeded from OS appearance) and
  `watchlistStore` (ids + toggle). `useWatchlistCourses` bridges the store's ids back through
  React Query to resolve full course objects — a nice example of the two layers cooperating.

---

## 5. Design system & theming

`theme/tokens.ts` is the **single source of truth** for color: two palettes (light/dark) of
semantic tokens (`background`, `surface`, `foreground`, `primary`, `muted`, …).

`ThemeProvider` bridges those tokens into **both** styling systems:

1. **Declarative (NativeWind):** the active palette is injected as CSS variables via `vars()` on a
   root view — `rgb(var(--color-*) / <alpha-value>)`. So `bg-background` / `text-foreground` token
   classes resolve to the right color *and* opacity modifiers (`bg-overlay/60`) keep working.
2. **Imperative:** the raw hex is exposed through context for consumers that aren't className-based
   — React Navigation's theme, `StatusBar`, and vector icons.

Toggling the theme rebuilds the variables, so the entire app re-themes instantly with **no
hardcoded hex in any component.** Dark mode is complete (see screenshots) because it falls out of
the token system for free rather than being bolted on.

---

## 6. Component library choice

The brief asked for **Gluestack UI**, with **React Native Paper as the sanctioned fallback if
Gluestack causes setup friction.**

On this bleeding-edge stack (Expo SDK 57 / React 19 / RN 0.81), Gluestack v2's interactive CLI
setup was a real risk, so I used **React Native Paper** for the required library primitive — the
Profile `Switch` — themed by mapping our design tokens onto Paper's MD3 theme (`AppPaperProvider`).

Crucially, **everything visual/branded is custom** (hero, cards, ranked rail, player, skeletons),
which is exactly what the brief prescribes: use the library for a couple of primitives, keep
custom components for anything branded. This keeps full control over the streaming aesthetic while
still satisfying the "use a component library" requirement.

---

## 7. Navigation & deep linking

React Navigation v7: a **native stack** owns the modal-ish screens (Detail, Player, Browse,
WebView) and wraps a **bottom-tab** navigator (Home, Search, Profile). Param lists are fully typed
and globally registered, so `navigation.navigate(...)` is type-checked everywhere.

Deep linking (`navigation/linking.ts`) resolves `app://detail/:courseId` to the Detail screen. The
same config also powers the **notification tap flow**: `getInitialURL` and `subscribe` surface a
notification's `data.deepLink`, so a tapped notification routes exactly like a URL — no bespoke
navigation logic.

---

## 8. Notifications

`services/notificationService.ts` schedules a **local** notification (~2s out) via
`expo-notifications`, carrying `data.deepLink = app://detail/c1`. A foreground handler is
configured once at startup so it displays in-app, and tapping it deep-links into the course through
the linking config above.

Remote push (FCM/APNs) was an explicit non-goal — local scheduled notifications fully demonstrate
the tap → deep-link flow the role needs.

---

## 9. WebView ↔ RN bridge

`WebViewScreen` (`react-native-webview`) injects JS that posts a `PAGE_LOADED` message once the
page loads; `onMessage` parses it and forwards it to an analytics hook, and a small in-app banner
surfaces the event. This demonstrates the RN ↔ web `postMessage` bridge used for embedded content
and analytics. It also handles `startInLoadingState` (themed loader) and error/reload.

---

## 10. Animations & micro-interactions

All motion uses **Reanimated v4** (UI-thread animations):

- **Detail collapsing header** — `useAnimatedScrollHandler` drives a parallax/zoom backdrop and a
  title bar that fades in as you scroll.
- **Card press-scale** — cards scale on press for tactile feedback.
- **Shimmer skeletons** — a moving-gradient sweep (theme-aware) instead of a spinner; skeletons are
  shaped like the real content.
- **Ranked numerals** — the Top Courses numbers use a MaskedView gradient that fades into the
  poster.
- **Haptics** — `expo-haptics` on key taps (cards, buttons, watchlist, player controls).

---

## 11. Performance optimizations

Lists are the hot path, so the tuning is deliberate:

- **Stable keys** — `keyExtractor={(item) => item.id}`, never index.
- **Memoized render paths** — cards are `React.memo`; `renderItem`/`keyExtractor` are `useCallback`.
- **`getItemLayout`** — provided wherever item size is fixed, so the list skips async on-scroll
  measurement.
- **`removeClippedSubviews`** on the long lists.
- **`expo-image`** — blurhash placeholder + cross-fade `transition`, so images fade in.
- **`useMemo`** only where there's real derived cost (e.g. Top Courses filtering) — trivial values
  are left un-memoized on purpose.

Windowing numbers, and the reasoning:

| List | `initialNumToRender` | `maxToRenderPerBatch` | `windowSize` | Why |
| --- | :---: | :---: | :---: | --- |
| Horizontal course rows | 4 | 4 | 5 | ~2–3 cards visible; render a few ahead for smooth swipes, small retained window since rows are short and off-screen cards are cheap to drop. |
| Vertical lists (Search / Browse) | 8 | 8 | 7 | ~8 rows fill a phone screen — render one screenful up front, keep ~3 screens of buffer for fast flings. |
| Hero pager | 2 | 3 | 3 | Items are large and full-width; keep only the neighbours mounted. |

---

## 12. Type safety

- **`strict: true`** and **`noUncheckedIndexedAccess: true`** — array/record access is
  `T | undefined`, forcing defensive handling everywhere (visible in the service and utils).
- Domain models (`Course`, `Module`, `Category`, `User`) and navigation param lists are the typed
  contracts the whole app is built on.
- Path alias `@/*` keeps imports clean and refactors safe.

---

## 13. Testing

`npm test` — Jest (`jest-expo`) + React Native Testing Library:

- **`courseService`** — resolves typed data; rejects with `NetworkError` when `failureRate = 1`.
- **`format` utils** — percent, rating, meta line, duration parsing, time-left, clock.
- **`CourseCard`** — renders the title and fires `onPress` with the course id.

Native modules (icons, image, gradient, masked-view, haptics, Reanimated) are stubbed in
`jest.setup.js` so component tests run under Node. Reanimated 4's bundled mock pulls in native
worklets, so it's replaced with a small manual stub of the APIs the components use.

---

## 14. Build & runtime decisions

**Managed / CNG workflow.** `ios/` and `android/` are git-ignored, generated by `expo prebuild`;
`app.json` + config plugins are the single source of truth. Native folders are disposable
artifacts, not committed code.

**Development build over Expo Go.** On this toolchain, Expo Go 57 crashes at startup on the iOS
simulators — a native crash in `expo-notifications` on newer iOS and a `react-native-worklets` JSI
mismatch on older iOS. Both are **Expo Go binary** issues, not app code. A development build
compiles the project's native modules at matching versions and runs cleanly, so it's the right
local runtime here (and the correct path for the notifications feature). This is still fully
managed/CNG. A shareable build is produced with **EAS Build** (`eas build -p android --profile
preview`), which never touches local native folders.

---

## 15. Trade-offs & limitations

- **Simulated player.** A real video player was an explicit non-goal, so the Player is a faithful
  playback *UI* (play/pause, ±10s, scrubber, up-next) driven by local state — the natural drop-in
  point for `expo-video`.
- **In-memory state.** Watchlist and theme reset on restart; adding `zustand/persist` +
  AsyncStorage is the next step for offline-first.
- **Local notifications only.** Real push (FCM/APNs) was out of scope.
- **Search is a simple `includes` filter** — no ranking, as specified.

### What I'd do next

Persistence, a real API behind the same service boundary, `expo-video` in the player, a Home
skeleton→content integration test and an E2E for the notification deep-link, and CI running
`typecheck` + `test`.
