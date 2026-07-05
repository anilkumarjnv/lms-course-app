import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

import { CourseRow } from '@/components/CourseRow';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { HeroCarousel } from '@/components/HeroCarousel';
import { HomeFeedSkeleton } from '@/components/HomeFeedSkeleton';
import { APP, BROWSE, HOME } from '@/constants/strings';
import { useHomeFeed } from '@/hooks/useHomeFeed';
import { useTheme } from '@/theme/ThemeProvider';
import type { RootStackParamList } from '@/types/navigation';

function HomeHeader({ onBrowse }: { onBrowse: () => void }) {
  const { colors } = useTheme();
  return (
    <View className="flex-row items-center justify-between px-5 pb-1 pt-2">
      <View className="flex-1">
        <Text className="text-sm text-muted">{APP.tagline}</Text>
        <Text className="text-3xl font-extrabold text-foreground">{APP.name}</Text>
      </View>
      <Pressable
        onPress={onBrowse}
        className="flex-row items-center gap-1 rounded-full border border-border bg-card px-3 py-2 active:opacity-80"
        accessibilityRole="button"
        accessibilityLabel={BROWSE.cta}
      >
        <Ionicons name="grid-outline" size={14} color={colors.primary} />
        <Text className="text-xs font-semibold text-primary">{BROWSE.cta}</Text>
      </Pressable>
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
  const openBrowse = useCallback(
    () => navigation.navigate('Browse'),
    [navigation],
  );

  if (isLoading) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 bg-background">
        <HomeHeader onBrowse={openBrowse} />
        <HomeFeedSkeleton />
      </SafeAreaView>
    );
  }

  if (isError || !data) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 bg-background">
        <HomeHeader onBrowse={openBrowse} />
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
        <HomeHeader onBrowse={openBrowse} />
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
        <HomeHeader onBrowse={openBrowse} />
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
