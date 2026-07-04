import { View } from 'react-native';

import { Skeleton } from '@/components/Skeleton';

const CHIPS = [0, 1, 2];
const LINES = [0, 1, 2, 3];
const MODULES = [0, 1, 2];

/** Loading placeholder shaped like the real Detail screen. */
export function DetailSkeleton() {
  return (
    <View className="flex-1 bg-background">
      <Skeleton height={260} radius={0} />
      <View className="gap-4 px-5 pt-4">
        <Skeleton width="80%" height={26} radius={6} />

        <View className="flex-row gap-2">
          {CHIPS.map((chip) => (
            <Skeleton key={chip} width={72} height={28} radius={14} />
          ))}
        </View>

        <Skeleton height={48} radius={16} />

        <View className="gap-2">
          {LINES.map((line) => (
            <Skeleton
              key={line}
              height={14}
              radius={4}
              width={line % 2 === 0 ? '100%' : '90%'}
            />
          ))}
        </View>

        <View className="gap-3 pt-2">
          {MODULES.map((module) => (
            <View key={module} className="flex-row items-center gap-3">
              <Skeleton width={40} height={40} radius={10} />
              <View className="flex-1 gap-2">
                <Skeleton height={14} radius={4} width="70%" />
                <Skeleton height={10} radius={4} width="40%" />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
