import { useCallback } from 'react';
import { FlatList, type ListRenderItem, View } from 'react-native';

import { CourseCard } from '@/components/CourseCard';
import { SectionHeader } from '@/components/SectionHeader';
import {
  CARD_SPACING,
  CARD_STRIDE,
  CARD_WIDTH,
  HERO_H_PADDING,
} from '@/theme/layout';
import type { Course } from '@/types/course';

interface CourseRowProps {
  title: string;
  courses: Course[];
  onPressCourse: (courseId: string) => void;
  /** Show progress overlays on cards (used by the continue-learning row). */
  showProgress?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Horizontal, virtualized row of course cards.
 *
 * Performance: stable id `keyExtractor`, `useCallback` renderItem, memoized
 * `CourseCard`, fixed-size `getItemLayout` (skips async measurement), and tuned
 * windowing so only a few off-screen cards are retained.
 */
export function CourseRow({
  title,
  courses,
  onPressCourse,
  showProgress = false,
  actionLabel,
  onAction,
}: CourseRowProps) {
  const renderItem = useCallback<ListRenderItem<Course>>(
    ({ item }) => (
      <CourseCard
        course={item}
        onPress={onPressCourse}
        showProgress={showProgress}
      />
    ),
    [onPressCourse, showProgress],
  );

  const keyExtractor = useCallback((item: Course) => item.id, []);

  const getItemLayout = useCallback(
    (_data: ArrayLike<Course> | null | undefined, index: number) => ({
      length: CARD_STRIDE,
      offset: CARD_STRIDE * index,
      index,
    }),
    [],
  );

  return (
    <View className="gap-3">
      <SectionHeader title={title} actionLabel={actionLabel} onAction={onAction} />
      <FlatList
        data={courses}
        horizontal
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: CARD_SPACING }} />}
        contentContainerStyle={{ paddingHorizontal: HERO_H_PADDING }}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews
        // Fixed height keeps row layout stable and avoids reflow on scroll.
        style={{ height: CARD_WIDTH * 1.4 + 56 }}
      />
    </View>
  );
}
