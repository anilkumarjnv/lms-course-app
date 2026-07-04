import { View } from 'react-native';

import { Skeleton } from '@/components/Skeleton';
import { SEARCH_ITEM_HEIGHT } from '@/components/CourseListItem';

const ROWS = [0, 1, 2, 3, 4, 5];

/** Loading placeholder shaped like the search results list. */
export function SearchSkeleton() {
  return (
    <View className="pt-2">
      {ROWS.map((row) => (
        <View
          key={row}
          className="flex-row items-center gap-3 px-5"
          style={{ height: SEARCH_ITEM_HEIGHT }}
        >
          <Skeleton width={56} height={72} radius={12} />
          <View className="flex-1 gap-2">
            <Skeleton width="70%" height={14} radius={4} />
            <Skeleton width="50%" height={10} radius={4} />
            <Skeleton width={40} height={10} radius={4} />
          </View>
        </View>
      ))}
    </View>
  );
}
