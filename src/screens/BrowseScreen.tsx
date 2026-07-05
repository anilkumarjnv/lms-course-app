import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  type ListRenderItem,
  Text,
  View,
} from 'react-native';

import {
  CourseListItem,
  SEARCH_ITEM_HEIGHT,
} from '@/components/CourseListItem';
import { ErrorState } from '@/components/ErrorState';
import { SearchSkeleton } from '@/components/SearchSkeleton';
import { BROWSE } from '@/constants/strings';
import { useInfiniteCourses } from '@/hooks/useInfiniteCourses';
import { useTheme } from '@/theme/ThemeProvider';
import type { Course } from '@/types/course';
import type { RootStackParamList } from '@/types/navigation';

export function BrowseScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteCourses();

  const courses = data?.pages.flatMap((page) => page.items) ?? [];

  const openCourse = useCallback(
    (courseId: string) => navigation.navigate('Detail', { courseId }),
    [navigation],
  );
  const renderItem = useCallback<ListRenderItem<Course>>(
    ({ item }) => <CourseListItem course={item} onPress={openCourse} />,
    [openCourse],
  );
  const keyExtractor = useCallback((item: Course) => item.id, []);
  const getItemLayout = useCallback(
    (_data: ArrayLike<Course> | null | undefined, index: number) => ({
      length: SEARCH_ITEM_HEIGHT,
      offset: SEARCH_ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background">
        <SearchSkeleton />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 bg-background">
        <ErrorState onRetry={refetch} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={courses}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        removeClippedSubviews
        contentContainerStyle={{ paddingVertical: 8, paddingBottom: 24 }}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-6">
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : !hasNextPage && courses.length > 0 ? (
            <Text className="py-6 text-center text-xs text-subtle">
              {BROWSE.endReached}
            </Text>
          ) : null
        }
      />
    </View>
  );
}
