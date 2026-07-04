import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BLURHASH, IMAGE_TRANSITION_MS } from '@/constants/images';
import { useTheme } from '@/theme/ThemeProvider';
import type { Course } from '@/types/course';
import { formatRating, metaLine } from '@/utils/format';

/** Fixed row height so the search FlatList can use getItemLayout. */
export const SEARCH_ITEM_HEIGHT = 88;

interface CourseListItemProps {
  course: Course;
  onPress: (courseId: string) => void;
}

function CourseListItemComponent({ course, onPress }: CourseListItemProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => onPress(course.id)}
      className="flex-row items-center gap-3 px-5 active:opacity-70"
      style={{ height: SEARCH_ITEM_HEIGHT }}
      accessibilityRole="button"
      accessibilityLabel={course.title}
    >
      <View className="overflow-hidden rounded-xl bg-card" style={{ width: 56, height: 72 }}>
        <Image
          source={{ uri: course.thumbnail }}
          placeholder={{ blurhash: BLURHASH }}
          transition={IMAGE_TRANSITION_MS}
          contentFit="cover"
          style={{ width: '100%', height: '100%' }}
        />
      </View>

      <View className="flex-1 gap-1">
        <Text numberOfLines={1} className="text-sm font-semibold text-foreground">
          {course.title}
        </Text>
        <Text numberOfLines={1} className="text-xs text-muted">
          {metaLine(course.category, course.level, course.duration)}
        </Text>
        <View className="flex-row items-center gap-1">
          <Ionicons name="star" size={11} color={colors.rating} />
          <Text className="text-xs text-muted">{formatRating(course.rating)}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.subtle} />
    </Pressable>
  );
}

export const CourseListItem = memo(CourseListItemComponent);
