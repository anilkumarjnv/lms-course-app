/**
 * Tiny analytics façade — a single hook the app calls for events.
 *
 * Today it logs; swap the body for Segment/Amplitude/Sentry breadcrumbs without
 * touching call sites. Used by the WebView bridge (and a good home for the
 * Sentry stub in Phase 10).
 */

export const analytics = {
  track(event: string, props: Record<string, unknown> = {}): void {
    if (__DEV__) {
      console.log(`[analytics] ${event}`, props);
    }
  },
};
