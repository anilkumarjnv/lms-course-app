import MaskedView from '@react-native-masked-view/masked-view';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BLURHASH, IMAGE_TRANSITION_MS } from '@/constants/images';
import { useTheme } from '@/theme/ThemeProvider';
import type { Course } from '@/types/course';
import { haptics } from '@/utils/haptics';

const POSTER_W = 130;
const POSTER_H = 160;
// How much of the numeral shows to the left of the poster. Smaller = the poster
// sits further onto the number (more overlap).
const NUMERAL_STICKOUT = 20;

// Shiny top-lit gradient for the numeral; fades to near-transparent at the base
// so the number melts into the poster/background where they meet.
const NUMBER_GRADIENT = ['#FFFFFF', '#CFD4DE', 'rgba(120,124,140,0.12)'] as const;

const numberTextStyle = {
  fontSize: 80,
  lineHeight: 122,
  fontWeight: '700' as const,
};

interface RankedCardProps {
  course: Course;
  rank: number;
  onPress: (courseId: string) => void;
}

/** "Top 10" style card: a large gradient rank numeral in front of the poster. */
function RankedCardComponent({ course, rank, onPress }: RankedCardProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => {
        haptics.light();
        onPress(course.id);
      }}
      style={{ width: NUMERAL_STICKOUT + POSTER_W, height: POSTER_H }}
      className="active:opacity-80"
      accessibilityRole="button"
      accessibilityLabel={`Number ${rank}, ${course.title}`}
    >
      {/* Poster behind, offset right, with a bottom fade into the background. */}
      <View
        className="overflow-hidden rounded-xl bg-card"
        style={{
          position: 'absolute',
          left: NUMERAL_STICKOUT,
          bottom: 0,
          width: POSTER_W,
          height: POSTER_H,
          zIndex: -1,
        }}
      >
        <Image
          source={{ uri: course.thumbnail }}
          placeholder={{ blurhash: BLURHASH }}
          transition={IMAGE_TRANSITION_MS}
          contentFit="cover"
          style={{ width: '100%', height: '100%' }}
        />
        <LinearGradient
          colors={['transparent', colors.background] as const}
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 68 }}
        />
      </View>

      {/* Gradient numeral in front, anchored bottom-left. */}
      <MaskedView
        style={{ position: 'absolute', left: 0, bottom: -20 }}
        maskElement={
          <Text
            allowFontScaling={false}
            style={[numberTextStyle, { color: '#000' }]}
          >
            {rank}
          </Text>
        }
      >
        <LinearGradient
          colors={NUMBER_GRADIENT}
          locations={[0, 0.5, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          <Text
            allowFontScaling={false}
            style={[numberTextStyle, { opacity: 0 }]}
          >
            {rank}
          </Text>
        </LinearGradient>
      </MaskedView>
    </Pressable>
  );
}

export const RankedCard = memo(RankedCardComponent);
