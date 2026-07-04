import { Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PROFILE } from '@/constants/strings';
import { useTheme } from '@/theme/ThemeProvider';

export function ProfileScreen() {
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <View className="flex-1 px-5 pt-4">
        <Text className="text-3xl font-bold text-foreground">
          {PROFILE.title}
        </Text>

        <View className="mt-8 flex-row items-center justify-between rounded-2xl border border-border bg-card p-4">
          <Text className="text-base font-medium text-foreground">
            {PROFILE.darkMode}
          </Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ true: colors.primary, false: colors.border }}
            thumbColor={colors.surface}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
