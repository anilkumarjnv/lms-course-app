import { useCallback, useMemo, useState } from 'react';
import { FlatList, type ListRenderItem, ScrollView, View } from 'react-native';

import { Chip } from '@/components/Chip';
import { RankedCard } from '@/components/RankedCard';
import { SectionHeader } from '@/components/SectionHeader';
import { HOME } from '@/constants/strings';
import { HERO_H_PADDING } from '@/theme/layout';
import type { CategoryRow, Course } from '@/types/course';
import { haptics } from '@/utils/haptics';

const GAP = 12;
const TOP_N = 10;

interface TopCoursesProps {
  categories: CategoryRow[];
  onPress: (courseId: string) => void;
}

/** "Top Courses" rail with rank numerals, filterable by category chip. */
export function TopCourses({ categories, onPress }: TopCoursesProps) {
  const [selected, setSelected] = useState<string>(HOME.filterAll);

  const chips = useMemo(
    () => [HOME.filterAll, ...categories.map((category) => category.title)],
    [categories],
  );

  const allCourses = useMemo(() => {
    const byId = new Map<string, Course>();
    for (const category of categories) {
      for (const course of category.courses) byId.set(course.id, course);
    }
    return Array.from(byId.values());
  }, [categories]);

  const ranked = useMemo(() => {
    const pool =
      selected === HOME.filterAll
        ? allCourses
        : allCourses.filter((course) => course.category === selected);
    return [...pool].sort((a, b) => b.rating - a.rating).slice(0, TOP_N);
  }, [selected, allCourses]);

  const renderItem = useCallback<ListRenderItem<Course>>(
    ({ item, index }) => (
      <RankedCard course={item} rank={index + 1} onPress={onPress} />
    ),
    [onPress],
  );
  const keyExtractor = useCallback((item: Course) => item.id, []);

  return (
    <View className="gap-3">
      <SectionHeader title={HOME.topCourses} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: HERO_H_PADDING, gap: 8 }}
      >
        {chips.map((chip) => (
          <Chip
            key={chip}
            label={chip}
            selected={chip === selected}
            onPress={() => {
              haptics.selection();
              setSelected(chip);
            }}
          />
        ))}
      </ScrollView>

      <FlatList
        data={ranked}
        extraData={selected}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
        contentContainerStyle={{ paddingHorizontal: HERO_H_PADDING }}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews
      />
    </View>
  );
}
