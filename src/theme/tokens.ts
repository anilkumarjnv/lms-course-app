/**
 * Design tokens — the single source of truth for color across the app.
 *
 * Values are stored as hex so imperative consumers (React Navigation theme,
 * StatusBar, Switch, vector icons) can use them directly. For declarative
 * NativeWind styling they are converted to "R G B" triplets and injected as CSS
 * variables (see ThemeProvider), which lets `className` colors switch with the
 * theme AND support opacity modifiers (e.g. `bg-overlay/60`).
 *
 * RULE: components never hardcode hex — they read `bg-*`/`text-*` token classes
 * or pull from `useTheme().colors`.
 */

export const colorNames = [
  'background',
  'surface',
  'card',
  'border',
  'foreground',
  'muted',
  'subtle',
  'primary',
  'primary-foreground',
  'accent',
  'rating',
  'danger',
  'success',
  'tab-bar',
  'overlay',
] as const;

export type ColorName = (typeof colorNames)[number];
export type ColorTokens = Record<ColorName, string>;

export const lightColors: ColorTokens = {
  background: '#F6F7F9',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E6E8EC',
  foreground: '#0F172A',
  muted: '#475569',
  subtle: '#94A3B8',
  primary: '#6D5EF6',
  'primary-foreground': '#FFFFFF',
  accent: '#22C55E',
  rating: '#F59E0B',
  danger: '#EF4444',
  success: '#16A34A',
  'tab-bar': '#FFFFFF',
  overlay: '#0F172A',
};

export const darkColors: ColorTokens = {
  background: '#0B0B0F',
  surface: '#141420',
  card: '#1A1A26',
  border: '#2A2A38',
  foreground: '#F4F5F7',
  muted: '#A5A7B4',
  subtle: '#6B6D7C',
  primary: '#8B7CFF',
  'primary-foreground': '#FFFFFF',
  accent: '#4ADE80',
  rating: '#FBBF24',
  danger: '#F87171',
  success: '#22C55E',
  'tab-bar': '#101018',
  overlay: '#000000',
};

/** Convert `#RRGGBB` to a space-separated "R G B" triplet for CSS variables. */
export function hexToRgbTriplet(hex: string): string {
  const h = hex.replace('#', '');
  const r = Number.parseInt(h.slice(0, 2), 16);
  const g = Number.parseInt(h.slice(2, 4), 16);
  const b = Number.parseInt(h.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}
