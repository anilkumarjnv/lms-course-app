/**
 * Shared React Query client.
 *
 * Server state (course data from the mock service) is owned by React Query;
 * client/UI state (theme, watchlist) lives in zustand. Defaults are tuned for a
 * content app: short staleness, no refetch-on-focus, one retry.
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});
