/**
 * Bridges our design tokens into React Native Paper's MD3 theme so the few
 * library primitives we use (e.g. Switch) match the app's palette and flip with
 * dark mode. Branded/visual components stay custom (see README).
 */

import type { ReactNode } from 'react';
import {
  MD3DarkTheme,
  MD3LightTheme,
  type MD3Theme,
  PaperProvider,
} from 'react-native-paper';

import { useTheme } from '@/theme/ThemeProvider';

export function AppPaperProvider({ children }: { children: ReactNode }) {
  const { colors, isDark } = useTheme();
  const base = isDark ? MD3DarkTheme : MD3LightTheme;

  const theme: MD3Theme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      onPrimary: colors['primary-foreground'],
      background: colors.background,
      surface: colors.surface,
      surfaceVariant: colors.card,
      onSurface: colors.foreground,
      onSurfaceVariant: colors.muted,
      outline: colors.border,
      error: colors.danger,
    },
  };

  return <PaperProvider theme={theme}>{children}</PaperProvider>;
}
