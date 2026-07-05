import { Ionicons } from '@expo/vector-icons';
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
import { HERO_H_PADDING } from '@/theme/layout';
import { useTheme } from '@/theme/ThemeProvider';
import { useWatchlistStore } from '@/store/watchlistStore';
import type { Course } from '@/types/course';
import { metaLine } from '@/utils/format';
import { haptics } from '@/utils/haptics';

const { width: SCREEN_W } = Dimensions.get('window');
const GAP = 12;
// Card leaves ~44px on the right so the next hero peeks (carousel affordance).
const ITEM_W = SCREEN_W - HERO_H_PADDING - 44;
const ITEM_H = Math.round(ITEM_W * 1.12);
const STRIDE = ITEM_W + GAP;

interface HeroCarouselProps {
  courses: Course[];
  /** Open the course detail. */
  onPress: (courseId: string) => void;
  /** Start playback. */
  onPlay: (courseId: string) => void;
}

/** Prominent, edge-peeking hero pager with overlaid Play + Add controls. */
export function HeroCarousel({ courses, onPress, onPlay }: HeroCarouselProps) {
  const { colors } = useTheme();
  const [active, setActive] = useState(0);
  const savedIds = useWatchlistStore((state) => state.ids);
  const toggleWatchlist = useWatchlistStore((state) => state.toggle);

  const renderItem = useCallback<ListRenderItem<Course>>(
    ({ item }) => {
      const saved = savedIds.includes(item.id);
      return (
        <Pressable
          onPress={() => onPress(item.id)}
          style={{ width: ITEM_W }}
          accessibilityRole="button"
          accessibilityLabel={item.title}
        >
          <View
            className="overflow-hidden rounded-3xl bg-card"
            style={{ height: ITEM_H }}
          >
            <Image
              source={{ uri: item.backdrop }}
              placeholder={{ blurhash: BLURHASH }}
              transition={IMAGE_TRANSITION_MS}
              contentFit="cover"
              style={{ width: '100%', height: '100%' }}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.85)'] as const}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: '62%',
              }}
            />

            {/* Text */}
            <View
              style={{ position: 'absolute', left: 16, right: 96, bottom: 18 }}
            >
              <View className="mb-2 self-start rounded-full bg-primary px-2.5 py-1">
                <Text className="text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
                  {HOME.heroBadge}
                </Text>
              </View>
              <Text numberOfLines={2} className="text-2xl font-extrabold text-white">
                {item.title}
              </Text>
              <Text numberOfLines={1} className="mt-1 text-xs text-white/75">
                {metaLine(item.category, item.level, item.duration)}
              </Text>
            </View>

            {/* Controls */}
            <View
              style={{
                position: 'absolute',
                right: 16,
                bottom: 18,
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Pressable
                onPress={() => {
                  haptics.selection();
                  toggleWatchlist(item.id);
                }}
                hitSlop={6}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.45)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.25)',
                }}
                accessibilityRole="button"
                accessibilityLabel="Add to watchlist"
              >
                <Ionicons
                  name={saved ? 'checkmark' : 'add'}
                  size={24}
                  color="#fff"
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  haptics.medium();
                  onPlay(item.id);
                }}
                hitSlop={6}
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 27,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fff',
                }}
                accessibilityRole="button"
                accessibilityLabel="Play"
              >
                <Ionicons name="play" size={26} color="#0B0B0F" />
              </Pressable>
            </View>
          </View>
        </Pressable>
      );
    },
    [onPress, onPlay, savedIds, toggleWatchlist],
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
  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      setActive(Math.round(e.nativeEvent.contentOffset.x / STRIDE));
    },
    [],
  );

  return (
    <View className="gap-3">
      <FlatList
        data={courses}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        onMomentumScrollEnd={onMomentumScrollEnd}
        snapToInterval={STRIDE}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
        contentContainerStyle={{ paddingHorizontal: HERO_H_PADDING }}
        initialNumToRender={2}
        maxToRenderPerBatch={3}
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
