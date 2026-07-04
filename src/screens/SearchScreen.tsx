import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { FlatList, type ListRenderItem, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  CourseListItem,
  SEARCH_ITEM_HEIGHT,
} from '@/components/CourseListItem';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { SearchBar } from '@/components/SearchBar';
import { SearchSkeleton } from '@/components/SearchSkeleton';
import { SEARCH } from '@/constants/strings';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearch } from '@/hooks/useSearch';
import type { Course } from '@/types/course';
import type { RootStackParamList } from '@/types/navigation';

export function SearchScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [text, setText] = useState('');
  const query = useDebounce(text.trim(), 350);
  const hasQuery = query.length > 0;

  const { data, isFetching, isError, refetch } = useSearch(query);

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

  function renderContent() {
    if (!hasQuery) {
      return (
        <EmptyState
          icon="search-outline"
          title={SEARCH.promptTitle}
          message={SEARCH.promptBody}
        />
      );
    }
    if (isFetching) {
      return <SearchSkeleton />;
    }
    if (isError) {
      return <ErrorState onRetry={refetch} />;
    }
    if (!data || data.length === 0) {
      return (
        <EmptyState
          icon="sad-outline"
          title={SEARCH.emptyTitle}
          message={SEARCH.emptyBody}
        />
      );
    }
    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        removeClippedSubviews
        className="flex-1"
      />
    );
  }

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <View className="gap-3 px-5 pb-3 pt-2">
        <Text className="text-3xl font-extrabold text-foreground">
          {SEARCH.title}
        </Text>
        <SearchBar
          value={text}
          onChangeText={setText}
          placeholder={SEARCH.placeholder}
        />
      </View>
      {renderContent()}
    </SafeAreaView>
  );
}
