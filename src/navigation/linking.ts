/**
 * Deep-link configuration.
 *
 * `app://detail/c1` (and the Expo dev URL equivalent) resolves to the Detail
 * screen with `courseId = "c1"`. The same config also drives the notification
 * tap flow: getInitialURL/subscribe surface a notification's `data.deepLink` so
 * React Navigation routes it exactly like a URL.
 */

import type { LinkingOptions } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';

import type { RootStackParamList } from '@/types/navigation';

function deepLinkFromResponse(
  response: Notifications.NotificationResponse | null,
): string | null {
  const link = response?.notification.request.content.data?.deepLink;
  return typeof link === 'string' ? link : null;
}

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
      Browse: 'browse',
      WebView: 'webview',
    },
  },
  // Cold start: if the app was launched by tapping a notification, route to it.
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (url) {
      return url;
    }
    const response = await Notifications.getLastNotificationResponseAsync();
    return deepLinkFromResponse(response);
  },
  // Warm: forward both URL opens and notification taps to the router.
  subscribe(listener) {
    const urlSub = Linking.addEventListener('url', ({ url }) => listener(url));
    const notifSub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const link = deepLinkFromResponse(response);
        if (link) {
          listener(link);
        }
      },
    );
    return () => {
      urlSub.remove();
      notifSub.remove();
    };
  },
};
