import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { CourseRow } from '@/components/CourseRow';
import { DetailSkeleton } from '@/components/DetailSkeleton';
import { ErrorState } from '@/components/ErrorState';
import { BLURHASH, IMAGE_TRANSITION_MS } from '@/constants/images';
import { DETAIL } from '@/constants/strings';
import { useCourseDetail, useRelatedCourses } from '@/hooks/useCourseDetail';
import { useTheme } from '@/theme/ThemeProvider';
import { useWatchlistStore } from '@/store/watchlistStore';
import type { RootStackParamList } from '@/types/navigation';
import { formatRating } from '@/utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

const BACKDROP_HEIGHT = 300;

export function DetailScreen({ route, navigation }: Props) {
  const { courseId } = route.params;
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const { data: course, isLoading, isError, refetch } = useCourseDetail(courseId);
  const { data: related = [] } = useRelatedCourses(courseId);

  const saved = useWatchlistStore((state) => state.ids.includes(courseId));
  const toggleWatchlist = useWatchlistStore((state) => state.toggle);

  const [expanded, setExpanded] = useState(false);

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // Title bar fades in as the backdrop scrolls away.
  const topBarStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [BACKDROP_HEIGHT - 120, BACKDROP_HEIGHT - 60],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  // Backdrop parallax + overscroll zoom.
  const backdropStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [-150, 0, BACKDROP_HEIGHT],
          [-75, 0, BACKDROP_HEIGHT * 0.4],
          Extrapolation.CLAMP,
        ),
      },
      {
        scale: interpolate(scrollY.value, [-150, 0], [1.3, 1], Extrapolation.CLAMP),
      },
    ],
  }));

  const backButton = (
    <Pressable
      onPress={() => navigation.goBack()}
      hitSlop={8}
      style={{
        position: 'absolute',
        left: 16,
        top: insets.top + 8,
        zIndex: 30,
        height: 36,
        width: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        backgroundColor: colors.overlay + '80',
      }}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <Ionicons name="chevron-back" size={22} color="#fff" />
    </Pressable>
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-background">
        {backButton}
        <DetailSkeleton />
      </View>
    );
  }

  if (isError || !course) {
    return (
      <View className="flex-1 bg-background">
        {backButton}
        <ErrorState onRetry={refetch} />
      </View>
    );
  }

  const inProgress = course.progress > 0;

  return (
    <View className="flex-1 bg-background">
      {/* Fading title bar */}
      <Animated.View
        style={[
          topBarStyle,
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 20,
            paddingTop: insets.top,
            backgroundColor: colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View
          style={{
            height: 48,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 56,
          }}
        >
          <Text
            numberOfLines={1}
            style={{ color: colors.foreground, fontSize: 16, fontWeight: '600' }}
          >
            {course.title}
          </Text>
        </View>
      </Animated.View>

      {backButton}

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Backdrop */}
        <View style={{ height: BACKDROP_HEIGHT, overflow: 'hidden' }}>
          <Animated.View style={[backdropStyle, { height: BACKDROP_HEIGHT }]}>
            <Image
              source={{ uri: course.backdrop }}
              placeholder={{ blurhash: BLURHASH }}
              transition={IMAGE_TRANSITION_MS}
              contentFit="cover"
              style={{ width: '100%', height: '100%' }}
            />
          </Animated.View>
          <LinearGradient
            colors={['transparent', colors.background] as const}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 140 }}
          />
        </View>

        {/* Content */}
        <View className="-mt-8 gap-5 rounded-t-3xl bg-background px-5 pt-2">
          <View>
            <Text className="text-2xl font-bold text-foreground">{course.title}</Text>
            <Text className="mt-1 text-sm text-muted">{course.category}</Text>
          </View>

          <View className="flex-row flex-wrap gap-2">
            <Chip label={course.level} />
            <Chip label={course.duration} />
            <Chip label={`★ ${formatRating(course.rating)}`} />
          </View>

          {/* Actions */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Button
                label={inProgress ? DETAIL.resume : DETAIL.enroll}
                icon={inProgress ? 'play' : 'add'}
                onPress={() =>
                  navigation.navigate('WebView', {
                    url: 'https://reactnative.dev',
                    title: course.title,
                  })
                }
              />
            </View>
            <Pressable
              onPress={() => toggleWatchlist(course.id)}
              className="items-center justify-center rounded-2xl border border-border bg-card px-4 active:opacity-80"
              accessibilityRole="button"
              accessibilityLabel={saved ? DETAIL.removeWatchlist : DETAIL.addWatchlist}
            >
              <Ionicons
                name={saved ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={saved ? colors.primary : colors.foreground}
              />
            </Pressable>
          </View>

          {/* About */}
          <View className="gap-2">
            <Text className="text-lg font-bold text-foreground">{DETAIL.aboutTitle}</Text>
            <Text
              numberOfLines={expanded ? undefined : 3}
              className="text-sm leading-5 text-muted"
            >
              {course.description}
            </Text>
            <Pressable onPress={() => setExpanded((value) => !value)} hitSlop={6}>
              <Text className="text-sm font-semibold text-primary">
                {expanded ? DETAIL.showLess : DETAIL.showMore}
              </Text>
            </Pressable>
          </View>

          {/* Modules */}
          {course.modules && course.modules.length > 0 ? (
            <View className="gap-1">
              <Text className="mb-1 text-lg font-bold text-foreground">
                {DETAIL.modulesTitle}
              </Text>
              {course.modules.map((module, index) => (
                <View key={module.id} className="flex-row items-center gap-3 py-2">
                  <View className="h-8 w-8 items-center justify-center rounded-full border border-border bg-card">
                    {module.completed ? (
                      <Ionicons name="checkmark" size={16} color={colors.success} />
                    ) : (
                      <Text className="text-xs text-muted">{index + 1}</Text>
                    )}
                  </View>
                  <Text numberOfLines={1} className="flex-1 text-sm text-foreground">
                    {module.title}
                  </Text>
                  <Text className="text-xs text-muted">{module.duration}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {/* Syllabus (WebView) */}
          <Pressable
            onPress={() =>
              navigation.navigate('WebView', {
                url: 'https://docs.expo.dev',
                title: DETAIL.viewSyllabus,
              })
            }
            className="flex-row items-center justify-between rounded-2xl border border-border bg-card p-4 active:opacity-80"
          >
            <Text className="text-sm font-medium text-foreground">
              {DETAIL.viewSyllabus}
            </Text>
            <Ionicons name="open-outline" size={18} color={colors.muted} />
          </Pressable>
        </View>

        {/* Related */}
        {related.length > 0 ? (
          <View className="mt-6">
            <CourseRow
              title={DETAIL.relatedTitle}
              courses={related}
              onPressCourse={(id) => navigation.push('Detail', { courseId: id })}
            />
          </View>
        ) : null}
      </Animated.ScrollView>
    </View>
  );
}
