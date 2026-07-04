import './global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { queryClient } from '@/lib/queryClient';
import { RootNavigator } from '@/navigation/RootNavigator';
import { AppPaperProvider } from '@/theme/PaperProvider';
import { ThemeProvider } from '@/theme/ThemeProvider';

// Provider order (spec): SafeArea > QueryClient > Theme > Navigation.
// Paper sits under Theme so its MD3 palette is derived from our tokens.
export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AppPaperProvider>
            <RootNavigator />
          </AppPaperProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
