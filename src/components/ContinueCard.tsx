import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ProgressBar } from '@/components/ProgressBar';
import { BLURHASH, IMAGE_TRANSITION_MS } from '@/constants/images';
import { DETAIL } from '@/constants/strings';
import type { Course } from '@/types/course';
import { formatTimeLeft, metaLine } from '@/utils/format';
import { haptics } from '@/utils/haptics';

export const CONTINUE_CARD_WIDTH = 260;
const IMAGE_HEIGHT = Math.round((CONTINUE_CARD_WIDTH * 9) / 16);

interface ContinueCardProps {
  course: Course;
  /** Resume playback. */
  onPlay: (courseId: string) => void;
}

function ContinueCardComponent({ course, onPlay }: ContinueCardProps) {
  return (
    <Pressable
      onPress={() => {
        haptics.medium();
        onPlay(course.id);
      }}
      style={{ width: CONTINUE_CARD_WIDTH }}
      className="active:opacity-90"
      accessibilityRole="button"
      accessibilityLabel={course.title}
    >
      <View
        className="overflow-hidden rounded-2xl bg-card"
        style={{ width: CONTINUE_CARD_WIDTH, height: IMAGE_HEIGHT }}
      >
        <Image
          source={{ uri: course.backdrop }}
          placeholder={{ blurhash: BLURHASH }}
          transition={IMAGE_TRANSITION_MS}
          contentFit="cover"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Play overlay */}
        <View
          style={{
            position: 'absolute',
            inset: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.5)',
            }}
          >
            <Ionicons name="play" size={22} color="#fff" />
          </View>
        </View>

        {/* Progress */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.65)']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            paddingHorizontal: 8,
            paddingTop: 20,
            paddingBottom: 8,
          }}
        >
          <ProgressBar progress={course.progress} height={3} />
        </LinearGradient>
      </View>

      <Text numberOfLines={1} className="mt-2 text-sm font-semibold text-foreground">
        {course.title}
      </Text>
      <Text numberOfLines={1} className="mt-0.5 text-xs text-muted">
        {metaLine(DETAIL.resume, formatTimeLeft(course.duration, course.progress))}
      </Text>
    </Pressable>
  );
}

export const ContinueCard = memo(ContinueCardComponent);
