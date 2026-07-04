import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import {
  Dimensions,
  FlatList,
  type ListRenderItem,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  Text,
  View,
} from 'react-native';

import { BLURHASH, IMAGE_TRANSITION_MS } from '@/constants/images';
import { HOME } from '@/constants/strings';
import { HERO_HEIGHT, HERO_H_PADDING } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeProvider';
import type { Course } from '@/types/course';
import { metaLine } from '@/utils/format';

const { width: SCREEN_W } = Dimensions.get('window');

interface HeroCarouselProps {
  courses: Course[];
  onPress: (courseId: string) => void;
}

/** Full-width paginated hero pager with a gradient scrim and active-dot indicator. */
export function HeroCarousel({ courses, onPress }: HeroCarouselProps) {
  const { colors } = useTheme();
  const [active, setActive] = useState(0);

  const renderItem = useCallback<ListRenderItem<Course>>(
    ({ item }) => (
      <Pressable
        onPress={() => onPress(item.id)}
        style={{ width: SCREEN_W, paddingHorizontal: HERO_H_PADDING }}
        accessibilityRole="button"
        accessibilityLabel={item.title}
      >
        <View
          className="overflow-hidden rounded-3xl bg-card"
          style={{ height: HERO_HEIGHT }}
        >
          <Image
            source={{ uri: item.backdrop }}
            placeholder={{ blurhash: BLURHASH }}
            transition={IMAGE_TRANSITION_MS}
            contentFit="cover"
            style={{ width: '100%', height: '100%' }}
          />
          <LinearGradient
            colors={['transparent', colors.overlay] as const}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              padding: 16,
              paddingTop: 56,
            }}
          >
            <View className="self-start rounded-full bg-primary px-2.5 py-1">
              <Text className="text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
                {HOME.heroBadge}
              </Text>
            </View>
            <Text numberOfLines={1} className="mt-2 text-xl font-bold text-white">
              {item.title}
            </Text>
            <Text numberOfLines={1} className="mt-0.5 text-xs text-white/80">
              {metaLine(item.category, item.level, item.duration)}
            </Text>
          </LinearGradient>
        </View>
      </Pressable>
    ),
    [onPress, colors.overlay],
  );

  const keyExtractor = useCallback((item: Course) => item.id, []);

  const getItemLayout = useCallback(
    (_data: ArrayLike<Course> | null | undefined, index: number) => ({
      length: SCREEN_W,
      offset: SCREEN_W * index,
      index,
    }),
    [],
  );

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      setActive(Math.round(e.nativeEvent.contentOffset.x / SCREEN_W));
    },
    [],
  );

  return (
    <View className="gap-3">
      <FlatList
        data={courses}
        horizontal
        pagingEnabled
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        onMomentumScrollEnd={onMomentumScrollEnd}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
      />
      <View className="flex-row justify-center gap-1.5">
        {courses.map((course, index) => (
          <View
            key={course.id}
            className={`h-1.5 rounded-full ${
              index === active ? 'w-4 bg-primary' : 'w-1.5 bg-border'
            }`}
          />
        ))}
      </View>
    </View>
  );
}
