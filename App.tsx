import './global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { queryClient } from '@/lib/queryClient';
import { RootNavigator } from '@/navigation/RootNavigator';
import { notificationService } from '@/services/notificationService';
import { AppPaperProvider } from '@/theme/PaperProvider';
import { ThemeProvider } from '@/theme/ThemeProvider';

// Show local notifications while the app is foregrounded.
notificationService.configureHandler();

// Provider order (spec): SafeArea > QueryClient > Theme > Navigation.
// GestureHandlerRootView must wrap the whole tree for React Navigation.
// Paper sits under Theme so its MD3 palette is derived from our tokens.
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AppPaperProvider>
              <RootNavigator />
            </AppPaperProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
