import { Ionicons } from '@expo/vector-icons';
import { Pressable, TextInput, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  autoFocus?: boolean;
}

/** Themed search input with a leading icon and a clear button. Controlled. */
export function SearchBar({
  value,
  onChangeText,
  placeholder,
  onClear,
  autoFocus,
}: SearchBarProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center rounded-2xl border border-border bg-card px-3">
      <Ionicons name="search" size={18} color={colors.subtle} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.subtle}
        autoFocus={autoFocus}
        autoCorrect={false}
        returnKeyType="search"
        className="ml-2 flex-1 py-3 text-base text-foreground"
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => {
            onChangeText('');
            onClear?.();
          }}
          hitSlop={8}
          accessibilityLabel="Clear search"
        >
          <Ionicons name="close-circle" size={18} color={colors.subtle} />
        </Pressable>
      ) : null}
    </View>
  );
}
