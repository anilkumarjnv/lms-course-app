/**
 * Local notification service (demo).
 *
 * Schedules a local notification whose `data.deepLink` routes into the app via
 * the navigation linking config (see navigation/linking.ts). Remote push is a
 * non-goal — local scheduled notifications are enough to demo the tap → deep
 * link flow, and they work in a development build.
 */

import * as Notifications from 'expo-notifications';

import { NOTIFICATIONS } from '@/constants/strings';

/** Deep link opened when the demo notification is tapped. */
export const TEST_DEEP_LINK = 'app://detail/c1';

export const notificationService = {
  /** Show notifications while the app is foregrounded. Call once at startup. */
  configureHandler(): void {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  },

  /** Ensure permission, requesting it once if not yet determined. */
  async ensurePermission(): Promise<boolean> {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) {
      return true;
    }
    const requested = await Notifications.requestPermissionsAsync();
    return requested.granted;
  },

  /**
   * Schedule the demo notification (~2s out). Returns false if permission was
   * denied so the UI can explain what to do.
   */
  async scheduleTestNotification(deepLink: string = TEST_DEEP_LINK): Promise<boolean> {
    const granted = await this.ensurePermission();
    if (!granted) {
      return false;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: NOTIFICATIONS.testTitle,
        body: NOTIFICATIONS.testBody,
        data: { deepLink },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
    return true;
  },
};
