/**
 * Deep-link configuration.
 *
 * `app://detail/c1` (and the Expo dev URL equivalent) resolves to the Detail
 * screen with `courseId = "c1"`. Used by the notification tap flow in Phase 7.
 */

import type { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import type { RootStackParamList } from '@/types/navigation';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/'), 'app://'],
  config: {
    screens: {
      Tabs: {
        screens: {
          Home: 'home',
          Search: 'search',
          Profile: 'profile',
        },
      },
      Detail: 'detail/:courseId',
      WebView: 'webview',
    },
  },
};
