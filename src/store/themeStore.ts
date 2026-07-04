/**
 * Global UI theme state (light/dark).
 *
 * Kept in a small zustand store so any component can read or toggle the theme
 * without prop drilling. Server state lives in React Query; this store is only
 * for client/UI concerns — see the README's "why React Query + Zustand split".
 */

import { Appearance } from 'react-native';
import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
}

/** Seed from the OS appearance so first paint matches the device. */
const initialMode: ThemeMode =
  Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';

export const useThemeStore = create<ThemeState>((set) => ({
  mode: initialMode,
  toggle: () =>
    set((state) => ({ mode: state.mode === 'light' ? 'dark' : 'light' })),
  setMode: (mode) => set({ mode }),
}));
