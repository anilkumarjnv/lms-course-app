import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

type IoniconName = keyof typeof Ionicons.glyphMap;

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: IoniconName;
}

/** Centered empty-state placeholder. Copy is passed in (data-driven). */
export function EmptyState({
  title,
  message,
  icon = 'file-tray-outline',
}: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Ionicons name={icon} size={48} color={colors.subtle} />
      <Text className="mt-4 text-center text-lg font-semibold text-foreground">
        {title}
      </Text>
      {message ? (
        <Text className="mt-1 text-center text-sm text-muted">{message}</Text>
      ) : null}
    </View>
  );
}
