import { useEffect } from 'react';
import type { DimensionValue } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  /** Corner radius in px. */
  radius?: number;
  className?: string;
}

/**
 * A single pulsing placeholder block. Compose these into content-shaped
 * skeletons (see HomeFeedSkeleton / DetailSkeleton) rather than using a spinner.
 */
export function Skeleton({
  width = '100%',
  height = 16,
  radius = 8,
  className,
}: SkeletonProps) {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      className={`bg-border ${className ?? ''}`}
      style={[{ width, height, borderRadius: radius }, animatedStyle]}
    />
  );
}
