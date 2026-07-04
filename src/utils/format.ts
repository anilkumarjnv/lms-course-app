/**
 * Small pure formatting helpers shared across components.
 */

/** 0.35 -> "35%" (clamped to 0..100, rounded). */
export function formatPercent(progress: number): string {
  const clamped = Math.min(1, Math.max(0, progress));
  return `${Math.round(clamped * 100)}%`;
}

/** 4.7 -> "4.7" (one decimal). */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/** Join non-empty parts with a middot, e.g. "Beginner · 8h 20m". */
export function metaLine(...parts: Array<string | undefined | null>): string {
  return parts.filter((p): p is string => Boolean(p)).join('  ·  ');
}
