/**
 * Navigation param lists — typed routes for the whole app.
 *
 * A bottom-tab navigator (Home/Search/Profile) is nested inside a native stack
 * that also owns the modal-ish Detail and WebView screens.
 */

import type { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  Detail: { courseId: string };
  Browse: undefined;
  WebView: { url: string; title?: string };
};

// Make useNavigation()/Link fully typed app-wide without per-call generics.
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
