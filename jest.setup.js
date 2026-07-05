/* eslint-disable @typescript-eslint/no-require-imports */
// Mock native modules the component tree touches so unit tests run under Node.
// Factories map straight to RN primitives (no JSX) to avoid the NativeWind
// babel transform injecting helpers into jest.mock factories.

global.__reanimatedWorkletInit = () => {};

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return new Proxy({}, { get: () => Text });
});

jest.mock('expo-image', () => {
  const { View } = require('react-native');
  return { Image: View };
});

jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return { LinearGradient: View };
});

jest.mock('@react-native-masked-view/masked-view', () => {
  const { View } = require('react-native');
  return { __esModule: true, default: View };
});

jest.mock('expo-status-bar', () => ({ StatusBar: () => null }));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  selectionAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium' },
  NotificationFeedbackType: { Success: 'success' },
}));

// Reanimated 4's bundled mock pulls in native worklets, so stub the APIs we use.
jest.mock('react-native-reanimated', () => {
  const { View, ScrollView, Text } = require('react-native');
  const passthrough = (v) => v;
  return {
    __esModule: true,
    default: { View, ScrollView, Text, createAnimatedComponent: (c) => c },
    View,
    ScrollView,
    Text,
    useSharedValue: (v) => ({ value: v }),
    useAnimatedStyle: () => ({}),
    useAnimatedScrollHandler: () => () => {},
    withTiming: passthrough,
    withSpring: passthrough,
    withRepeat: passthrough,
    withDelay: (_d, v) => v,
    cancelAnimation: () => {},
    interpolate: () => 0,
    Extrapolation: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
    Easing: {
      linear: (t) => t,
      ease: (t) => t,
      inOut: () => (t) => t,
      out: () => (t) => t,
      in: () => (t) => t,
      bezier: () => (t) => t,
    },
  };
});
