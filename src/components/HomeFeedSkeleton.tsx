import { View } from 'react-native';

import { Skeleton } from '@/components/Skeleton';
import { CARD_IMAGE_RATIO, CARD_WIDTH, HERO_HEIGHT, HERO_H_PADDING } from '@/theme/layout';

const ROWS = [0, 1];
const CARDS = [0, 1, 2];

/** Loading placeholder shaped like the real Home feed (hero + two card rows). */
export function HomeFeedSkeleton() {
  return (
    <View className="gap-6 pt-2">
      <View style={{ paddingHorizontal: HERO_H_PADDING }}>
        <Skeleton height={HERO_HEIGHT} radius={24} />
      </View>

      {ROWS.map((row) => (
        <View key={row} className="gap-3">
          <View style={{ paddingHorizontal: HERO_H_PADDING }}>
            <Skeleton width={160} height={20} radius={6} />
          </View>
          <View
            className="flex-row gap-3"
            style={{ paddingHorizontal: HERO_H_PADDING }}
          >
            {CARDS.map((card) => (
              <View key={card} className="gap-2">
                <Skeleton
                  width={CARD_WIDTH}
                  height={CARD_WIDTH * CARD_IMAGE_RATIO}
                  radius={16}
                />
                <Skeleton width={CARD_WIDTH} height={12} radius={4} />
                <Skeleton width={CARD_WIDTH * 0.6} height={10} radius={4} />
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
