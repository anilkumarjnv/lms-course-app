import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CourseRow } from '@/components/CourseRow';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { HeroCarousel } from '@/components/HeroCarousel';
import { HomeFeedSkeleton } from '@/components/HomeFeedSkeleton';
import { APP, HOME } from '@/constants/strings';
import { useHomeFeed } from '@/hooks/useHomeFeed';
import { useTheme } from '@/theme/ThemeProvider';
import type { RootStackParamList } from '@/types/navigation';

function HomeHeader() {
  return (
    <View className="px-5 pb-1 pt-2">
      <Text className="text-sm text-muted">{APP.tagline}</Text>
      <Text className="text-3xl font-extrabold text-foreground">{APP.name}</Text>
    </View>
  );
}

export function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const { data, isLoading, isError, refetch, isRefetching } = useHomeFeed();

  const openCourse = useCallback(
    (courseId: string) => navigation.navigate('Detail', { courseId }),
    [navigation],
  );

  if (isLoading) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 bg-background">
        <HomeHeader />
        <HomeFeedSkeleton />
      </SafeAreaView>
    );
  }

  if (isError || !data) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 bg-background">
        <HomeHeader />
        <ErrorState onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const { hero, continueLearning, categories } = data;
  const isEmpty =
    hero.length === 0 &&
    continueLearning.length === 0 &&
    categories.every((category) => category.courses.length === 0);

  if (isEmpty) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 bg-background">
        <HomeHeader />
        <EmptyState title={HOME.emptyTitle} message={HOME.emptyBody} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <HomeHeader />
        <View className="gap-6 pt-2">
          <HeroCarousel courses={hero} onPress={openCourse} />

          {continueLearning.length > 0 ? (
            <CourseRow
              title={HOME.continueLearning}
              courses={continueLearning}
              onPressCourse={openCourse}
              showProgress
            />
          ) : null}

          {categories.map((category) =>
            category.courses.length > 0 ? (
              <CourseRow
                key={category.id}
                title={category.title}
                courses={category.courses}
                onPressCourse={openCourse}
              />
            ) : null,
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
