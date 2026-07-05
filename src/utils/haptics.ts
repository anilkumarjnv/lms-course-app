/**
 * Thin haptics wrapper. Each call is fire-and-forget and swallows errors so a
 * platform without a taptic engine (e.g. the iOS simulator) never throws.
 */

import * as Haptics from 'expo-haptics';

export const haptics = {
  light: () =>
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}),
  medium: () =>
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {}),
  selection: () => Haptics.selectionAsync().catch(() => {}),
  success: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {},
    ),
};
