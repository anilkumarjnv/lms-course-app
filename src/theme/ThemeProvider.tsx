/**
 * ThemeProvider — bridges the zustand theme store to both styling systems:
 *
 *  1. Declarative (NativeWind): injects the active palette as CSS variables via
 *     `vars()` on a root View, so `bg-background`/`text-foreground` token
 *     classes resolve to the right color and flip instantly on toggle.
 *  2. Imperative (React Navigation, StatusBar, icons): exposes the raw hex
 *     `colors` object through context.
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { vars } from 'nativewind';

import { useThemeStore } from '@/store/themeStore';
import {
  colorNames,
  darkColors,
  hexToRgbTriplet,
  lightColors,
  type ColorTokens,
} from '@/theme/tokens';

interface ThemeContextValue {
  colors: ColorTokens;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Map the palette to `--color-*` CSS variables as RGB triplets. */
function buildThemeVars(colors: ColorTokens) {
  const map: Record<string, string> = {};
  for (const name of colorNames) {
    map[`--color-${name}`] = hexToRgbTriplet(colors[name]);
  }
  return vars(map);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const mode = useThemeStore((state) => state.mode);
  const toggleTheme = useThemeStore((state) => state.toggle);

  const isDark = mode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const value = useMemo<ThemeContextValue>(
    () => ({ colors, isDark, toggleTheme }),
    [colors, isDark, toggleTheme],
  );
  const themeVars = useMemo(() => buildThemeVars(colors), [colors]);

  return (
    <ThemeContext.Provider value={value}>
      <View style={themeVars} className="flex-1 bg-background">
        <StatusBar style={isDark ? 'light' : 'dark'} />
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
