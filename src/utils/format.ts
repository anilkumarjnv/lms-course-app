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

/** Parse a human duration like "8h 20m" into total minutes. */
export function parseDurationToMinutes(duration: string): number {
  let minutes = 0;
  const hours = duration.match(/(\d+)\s*h/);
  const mins = duration.match(/(\d+)\s*m/);
  if (hours?.[1]) minutes += Number.parseInt(hours[1], 10) * 60;
  if (mins?.[1]) minutes += Number.parseInt(mins[1], 10);
  return minutes;
}

/** Remaining time given a total duration and progress, e.g. "2h 10m left". */
export function formatTimeLeft(duration: string, progress: number): string {
  const total = parseDurationToMinutes(duration);
  const ratio = 1 - Math.min(1, Math.max(0, progress));
  const left = Math.max(0, Math.round(total * ratio));
  const hours = Math.floor(left / 60);
  const minutes = left % 60;
  return hours > 0 ? `${hours}h ${minutes}m left` : `${minutes}m left`;
}

/** Seconds -> clock, e.g. 750 -> "12:30", 3725 -> "1:02:05". */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${minutes}:${ss}`;
}
