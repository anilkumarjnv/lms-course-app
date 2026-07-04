import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, Text } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

type IoniconName = keyof typeof Ionicons.glyphMap;

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  icon?: IoniconName;
  loading?: boolean;
  disabled?: boolean;
}

/**
 * Branded CTA button (custom on purpose — see README "component library" note).
 * The library primitive is used for the Switch; branded visuals stay custom.
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
}: ButtonProps) {
  const { colors } = useTheme();
  const isPrimary = variant === 'primary';
  const iconColor = isPrimary ? colors['primary-foreground'] : colors.foreground;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      className={`flex-row items-center justify-center gap-2 rounded-2xl px-5 py-3.5 active:opacity-80 ${
        isPrimary ? 'bg-primary' : 'border border-border bg-card'
      } ${disabled ? 'opacity-50' : ''}`}
    >
      {loading ? (
        <ActivityIndicator color={iconColor} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={18} color={iconColor} /> : null}
          <Text
            className={`text-base font-semibold ${
              isPrimary ? 'text-primary-foreground' : 'text-foreground'
            }`}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}
