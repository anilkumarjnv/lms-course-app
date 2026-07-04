/**
 * Watchlist — client/UI state for saved courses.
 *
 * Lives in zustand (not React Query) because it's user-owned local state, not
 * server data. In-memory for the demo; a persist middleware + AsyncStorage
 * would make it survive restarts.
 */

import { create } from 'zustand';

interface WatchlistState {
  ids: string[];
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useWatchlistStore = create<WatchlistState>((set) => ({
  ids: [],
  toggle: (id) =>
    set((state) => ({
      ids: state.ids.includes(id)
        ? state.ids.filter((existing) => existing !== id)
        : [...state.ids, id],
    })),
  remove: (id) =>
    set((state) => ({ ids: state.ids.filter((existing) => existing !== id) })),
  clear: () => set({ ids: [] }),
}));
