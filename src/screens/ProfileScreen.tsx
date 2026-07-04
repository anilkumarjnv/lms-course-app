import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Switch } from 'react-native-paper';

import { Button } from '@/components/Button';
import { CourseListItem } from '@/components/CourseListItem';
import { Skeleton } from '@/components/Skeleton';
import { BLURHASH } from '@/constants/images';
import { PROFILE } from '@/constants/strings';
import { useUser } from '@/hooks/useUser';
import { useWatchlistCourses } from '@/hooks/useWatchlistCourses';
import { notificationService } from '@/services/notificationService';
import { useTheme } from '@/theme/ThemeProvider';
import { useWatchlistStore } from '@/store/watchlistStore';
import type { RootStackParamList } from '@/types/navigation';
import { metaLine } from '@/utils/format';

function SettingRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <Text className="text-base text-foreground">{label}</Text>
      {children}
    </View>
  );
}

export function ProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors, isDark, toggleTheme } = useTheme();

  const { data: user } = useUser();
  const { data: watchlist, ids } = useWatchlistCourses();
  const clearWatchlist = useWatchlistStore((state) => state.clear);

  const [notificationsOn, setNotificationsOn] = useState(true);

  const openCourse = useCallback(
    (courseId: string) => navigation.navigate('Detail', { courseId }),
    [navigation],
  );

  const onSendTest = useCallback(async () => {
    const scheduled = await notificationService.scheduleTestNotification();
    Alert.alert(
      PROFILE.sendTestNotification,
      scheduled ? PROFILE.notificationScheduled : PROFILE.notificationDenied,
    );
  }, []);

  const onLogout = useCallback(() => {
    clearWatchlist();
    Alert.alert(PROFILE.logout, PROFILE.title);
  }, [clearWatchlist]);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="px-5 pt-2">
          <Text className="text-3xl font-extrabold text-foreground">
            {PROFILE.title}
          </Text>
        </View>

        {/* User header */}
        <View className="flex-row items-center gap-4 px-5 py-5">
          {user ? (
            <Image
              source={{ uri: user.avatar }}
              placeholder={{ blurhash: BLURHASH }}
              transition={200}
              contentFit="cover"
              style={{ width: 68, height: 68, borderRadius: 34 }}
            />
          ) : (
            <Skeleton width={68} height={68} radius={34} />
          )}
          <View className="flex-1 gap-1">
            {user ? (
              <>
                <Text className="text-lg font-bold text-foreground">
                  {user.name}
                </Text>
                <Text className="text-sm text-muted">{user.email}</Text>
                <Text className="text-xs text-subtle">
                  {metaLine(
                    `${PROFILE.memberSince} ${user.memberSince}`,
                    `${user.enrolledCount} ${PROFILE.enrolled}`,
                  )}
                </Text>
              </>
            ) : (
              <>
                <Skeleton width="60%" height={18} radius={4} />
                <Skeleton width="45%" height={12} radius={4} />
              </>
            )}
          </View>
        </View>

        {/* Settings */}
        <Text className="px-5 pb-2 pt-3 text-sm font-semibold uppercase tracking-wide text-subtle">
          {PROFILE.settingsTitle}
        </Text>
        <View className="mx-5 overflow-hidden rounded-2xl border border-border bg-card">
          <SettingRow label={PROFILE.darkMode}>
            <Switch value={isDark} onValueChange={toggleTheme} color={colors.primary} />
          </SettingRow>
          <View className="h-px bg-border" />
          <SettingRow label={PROFILE.notifications}>
            <Switch
              value={notificationsOn}
              onValueChange={setNotificationsOn}
              color={colors.primary}
            />
          </SettingRow>
        </View>

        <View className="px-5 pt-4">
          <Button
            label={PROFILE.sendTestNotification}
            icon="notifications-outline"
            variant="secondary"
            disabled={!notificationsOn}
            onPress={onSendTest}
          />
        </View>

        {/* Watchlist */}
        <Text className="px-5 pb-2 pt-6 text-sm font-semibold uppercase tracking-wide text-subtle">
          {PROFILE.watchlistTitle}
        </Text>
        {ids.length === 0 ? (
          <View className="mx-5 items-center gap-2 rounded-2xl border border-border bg-card px-5 py-8">
            <Ionicons name="bookmark-outline" size={28} color={colors.subtle} />
            <Text className="text-center text-sm text-muted">
              {PROFILE.watchlistEmpty}
            </Text>
          </View>
        ) : (
          <View className="mx-5 overflow-hidden rounded-2xl border border-border bg-card">
            {watchlist?.map((course) => (
              <CourseListItem
                key={course.id}
                course={course}
                onPress={openCourse}
              />
            ))}
          </View>
        )}

        {/* Logout */}
        <View className="px-5 pt-8">
          <Pressable
            onPress={onLogout}
            className="items-center rounded-2xl border border-border bg-card py-3.5 active:opacity-80"
            accessibilityRole="button"
            accessibilityLabel={PROFILE.logout}
          >
            <Text className="text-base font-semibold text-danger">
              {PROFILE.logout}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
