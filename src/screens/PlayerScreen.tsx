import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorState } from '@/components/ErrorState';
import { BLURHASH, IMAGE_TRANSITION_MS } from '@/constants/images';
import { PLAYER } from '@/constants/strings';
import { useCourseDetail } from '@/hooks/useCourseDetail';
import { useTheme } from '@/theme/ThemeProvider';
import type { RootStackParamList } from '@/types/navigation';
import { formatClock, metaLine, parseDurationToMinutes } from '@/utils/format';
import { haptics } from '@/utils/haptics';

type Props = NativeStackScreenProps<RootStackParamList, 'Player'>;

// The player is an intentionally immersive dark surface (like a real streaming
// player), so it uses fixed dark chrome rather than the app's light/dark tokens.
const WHITE = '#FFFFFF';
const WHITE_DIM = 'rgba(255,255,255,0.65)';

export function PlayerScreen({ route, navigation }: Props) {
  const { courseId, moduleId } = route.params;
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const { data: course, isLoading, isError, refetch } =
    useCourseDetail(courseId);

  const modules = useMemo(() => course?.modules ?? [], [course]);

  const [currentModuleId, setCurrentModuleId] = useState<string | null>(
    moduleId ?? null,
  );
  const [playing, setPlaying] = useState(true);
  const [positionSec, setPositionSec] = useState(0);

  // Default to the first not-yet-completed module once the course loads.
  useEffect(() => {
    if (currentModuleId || modules.length === 0) return;
    const firstIncomplete = modules.find((m) => !m.completed);
    const first = firstIncomplete ?? modules[0];
    if (first) setCurrentModuleId(first.id);
  }, [currentModuleId, modules]);

  const currentModule = modules.find((m) => m.id === currentModuleId);
  const lessonTitle = currentModule?.title ?? course?.title ?? '';
  const lessonDuration = currentModule?.duration ?? course?.duration ?? '0m';
  const totalSec = Math.max(1, parseDurationToMinutes(lessonDuration) * 60);

  // Fake playback clock.
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setPositionSec((p) => (p >= totalSec ? totalSec : p + 1));
    }, 1000);
    return () => clearInterval(id);
  }, [playing, totalSec]);

  // Reset position when switching lessons.
  useEffect(() => {
    setPositionSec(0);
    setPlaying(true);
  }, [currentModuleId]);

  const fraction = Math.min(1, positionSec / totalSec);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }
  if (isError || !course) {
    return (
      <View className="flex-1 bg-black">
        <ErrorState onRetry={refetch} />
      </View>
    );
  }

  const upNext = modules.filter((m) => m.id !== currentModuleId);

  return (
    <View className="flex-1 bg-black">
      {/* Video surface (16:9) */}
      <View style={{ width: '100%', aspectRatio: 16 / 9, marginTop: insets.top }}>
        <Image
          source={{ uri: course.backdrop }}
          placeholder={{ blurhash: BLURHASH }}
          transition={IMAGE_TRANSITION_MS}
          contentFit="cover"
          style={{ width: '100%', height: '100%' }}
        />
        <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.35)' }} />

        {/* Close */}
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={10}
          style={{ position: 'absolute', top: 10, left: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Close player"
        >
          <Ionicons name="chevron-down" size={28} color={WHITE} />
        </Pressable>

        {/* Transport controls */}
        <View
          style={{
            position: 'absolute',
            inset: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 36,
          }}
        >
          <Pressable
            onPress={() => {
              haptics.light();
              setPositionSec((p) => Math.max(0, p - 10));
            }}
            hitSlop={10}
            accessibilityLabel="Rewind 10 seconds"
          >
            <Ionicons name="play-back" size={28} color={WHITE} />
          </Pressable>
          <Pressable
            onPress={() => {
              haptics.medium();
              setPlaying((v) => !v);
            }}
            hitSlop={10}
            accessibilityLabel={playing ? 'Pause' : PLAYER.play}
          >
            <Ionicons name={playing ? 'pause' : 'play'} size={52} color={WHITE} />
          </Pressable>
          <Pressable
            onPress={() => {
              haptics.light();
              setPositionSec((p) => Math.min(totalSec, p + 10));
            }}
            hitSlop={10}
            accessibilityLabel="Forward 10 seconds"
          >
            <Ionicons name="play-forward" size={28} color={WHITE} />
          </Pressable>
        </View>

        {/* Scrubber */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 14, paddingTop: 24, paddingBottom: 10 }}
        >
          <View
            className="w-full overflow-hidden rounded-full"
            style={{ height: 3, backgroundColor: 'rgba(255,255,255,0.3)' }}
          >
            <View
              className="h-full rounded-full bg-primary"
              style={{ width: `${fraction * 100}%` }}
            />
          </View>
          <View className="mt-1.5 flex-row justify-between">
            <Text style={{ color: WHITE_DIM, fontSize: 11 }}>
              {formatClock(positionSec)}
            </Text>
            <Text style={{ color: WHITE_DIM, fontSize: 11 }}>
              {formatClock(totalSec)}
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Details + up next */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 24 }}
      >
        <Text style={{ color: WHITE_DIM, fontSize: 12 }}>{PLAYER.nowPlaying}</Text>
        <Text style={{ color: WHITE, fontSize: 20, fontWeight: '700', marginTop: 2 }}>
          {lessonTitle}
        </Text>
        <Text style={{ color: WHITE_DIM, fontSize: 13, marginTop: 4 }}>
          {metaLine(course.title, course.level)}
        </Text>

        {upNext.length > 0 ? (
          <View style={{ marginTop: 24 }}>
            <Text style={{ color: WHITE, fontSize: 16, fontWeight: '700', marginBottom: 8 }}>
              {PLAYER.upNext}
            </Text>
            {upNext.map((module, index) => (
              <Pressable
                key={module.id}
                onPress={() => {
                  haptics.selection();
                  setCurrentModuleId(module.id);
                }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}
                accessibilityRole="button"
                accessibilityLabel={module.title}
              >
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.12)',
                  }}
                >
                  {module.completed ? (
                    <Ionicons name="checkmark" size={16} color={colors.success} />
                  ) : (
                    <Text style={{ color: WHITE, fontSize: 12 }}>{index + 1}</Text>
                  )}
                </View>
                <Text numberOfLines={1} style={{ flex: 1, color: WHITE, fontSize: 14 }}>
                  {module.title}
                </Text>
                <Text style={{ color: WHITE_DIM, fontSize: 12 }}>{module.duration}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
