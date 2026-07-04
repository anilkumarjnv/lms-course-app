import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ProgressBar } from '@/components/ProgressBar';
import { BLURHASH, IMAGE_TRANSITION_MS } from '@/constants/images';
import { CARD_IMAGE_RATIO, CARD_WIDTH } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeProvider';
import type { Course } from '@/types/course';
import { formatRating, metaLine } from '@/utils/format';

interface CourseCardProps {
  course: Course;
  onPress: (courseId: string) => void;
  /** Override card width (defaults to the standard portrait card). */
  width?: number;
  /** Show the progress overlay when the course is in progress. */
  showProgress?: boolean;
}

function CourseCardComponent({
  course,
  onPress,
  width = CARD_WIDTH,
  showProgress = true,
}: CourseCardProps) {
  const { colors } = useTheme();
  const imageHeight = width * CARD_IMAGE_RATIO;
  const hasProgress = showProgress && course.progress > 0;

  return (
    <Pressable
      onPress={() => onPress(course.id)}
      className="active:opacity-80"
      style={{ width }}
      accessibilityRole="button"
      accessibilityLabel={course.title}
    >
      <View
        className="overflow-hidden rounded-2xl bg-card"
        style={{ width, height: imageHeight }}
      >
        <Image
          source={{ uri: course.thumbnail }}
          placeholder={{ blurhash: BLURHASH }}
          transition={IMAGE_TRANSITION_MS}
          contentFit="cover"
          style={{ width: '100%', height: '100%' }}
        />

        <View className="absolute right-2 top-2 flex-row items-center rounded-full bg-overlay/70 px-2 py-1">
          <Ionicons name="star" size={11} color={colors.rating} />
          <Text className="ml-1 text-[11px] font-semibold text-white">
            {formatRating(course.rating)}
          </Text>
        </View>

        {hasProgress ? (
          <LinearGradient
            colors={['transparent', colors.overlay] as const}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              paddingHorizontal: 8,
              paddingTop: 24,
              paddingBottom: 8,
            }}
          >
            <ProgressBar progress={course.progress} />
          </LinearGradient>
        ) : null}
      </View>

      <Text
        numberOfLines={2}
        className="mt-2 text-sm font-semibold text-foreground"
        style={{ width }}
      >
        {course.title}
      </Text>
      <Text numberOfLines={1} className="mt-0.5 text-xs text-muted">
        {metaLine(course.level, course.duration)}
      </Text>
    </Pressable>
  );
}

/** Memoized: rows re-render often; a card only changes if its course/handler does. */
export const CourseCard = memo(CourseCardComponent);
