import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { type DimensionValue, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/theme/ThemeProvider';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  /** Corner radius in px. */
  radius?: number;
  className?: string;
}

/**
 * A single placeholder block with a moving-gradient shimmer. Compose these into
 * content-shaped skeletons (HomeFeedSkeleton / DetailSkeleton / SearchSkeleton)
 * rather than using a spinner. The highlight is derived from the theme
 * foreground so it reads in both light and dark mode.
 */
export function Skeleton({
  width = '100%',
  height = 16,
  radius = 8,
  className,
}: SkeletonProps) {
  const { colors } = useTheme();
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.linear }),
      -1,
      false,
    );
  }, [progress]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          progress.value,
          [0, 1],
          [-measuredWidth, measuredWidth],
        ),
      },
    ],
  }));

  return (
    <View
      onLayout={(event) => setMeasuredWidth(event.nativeEvent.layout.width)}
      className={`overflow-hidden bg-border ${className ?? ''}`}
      style={{ width, height, borderRadius: radius }}
    >
      {measuredWidth > 0 ? (
        <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
          <LinearGradient
            // `${foreground}00` = fully transparent; `${foreground}24` ≈ 14%.
            colors={[
              `${colors.foreground}00`,
              `${colors.foreground}24`,
              `${colors.foreground}00`,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: measuredWidth, height: '100%' }}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}
