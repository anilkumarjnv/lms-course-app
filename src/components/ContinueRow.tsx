import { useCallback } from 'react';
import { FlatList, type ListRenderItem, View } from 'react-native';

import { CONTINUE_CARD_WIDTH, ContinueCard } from '@/components/ContinueCard';
import { SectionHeader } from '@/components/SectionHeader';
import { HERO_H_PADDING } from '@/theme/layout';
import type { Course } from '@/types/course';

const GAP = 12;
const STRIDE = CONTINUE_CARD_WIDTH + GAP;

interface ContinueRowProps {
  title: string;
  courses: Course[];
  onPlay: (courseId: string) => void;
}

/** Horizontal row of landscape "continue watching" resume cards. */
export function ContinueRow({ title, courses, onPlay }: ContinueRowProps) {
  const renderItem = useCallback<ListRenderItem<Course>>(
    ({ item }) => <ContinueCard course={item} onPlay={onPlay} />,
    [onPlay],
  );
  const keyExtractor = useCallback((item: Course) => item.id, []);
  const getItemLayout = useCallback(
    (_data: ArrayLike<Course> | null | undefined, index: number) => ({
      length: STRIDE,
      offset: STRIDE * index,
      index,
    }),
    [],
  );

  return (
    <View className="gap-3">
      <SectionHeader title={title} />
      <FlatList
        data={courses}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
        contentContainerStyle={{ paddingHorizontal: HERO_H_PADDING }}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews
      />
    </View>
  );
}
