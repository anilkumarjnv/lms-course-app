import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { STATES } from '@/constants/strings';
import { useTheme } from '@/theme/ThemeProvider';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

/** Centered error-state with an optional retry action. Copy defaults from strings. */
export function ErrorState({
  title = STATES.errorTitle,
  message = STATES.errorBody,
  onRetry,
}: ErrorStateProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Ionicons name="cloud-offline-outline" size={48} color={colors.danger} />
      <Text className="mt-4 text-center text-lg font-semibold text-foreground">
        {title}
      </Text>
      <Text className="mt-1 text-center text-sm text-muted">{message}</Text>
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          className="mt-5 rounded-full bg-primary px-5 py-2.5 active:opacity-80"
          accessibilityRole="button"
          accessibilityLabel={STATES.retry}
        >
          <Text className="text-sm font-semibold text-primary-foreground">
            {STATES.retry}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
