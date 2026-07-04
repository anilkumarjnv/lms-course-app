import { Pressable, Text, View } from 'react-native';

interface SectionHeaderProps {
  title: string;
  /** Optional trailing action (e.g. "See all"). */
  actionLabel?: string;
  onAction?: () => void;
}

/** Row title with an optional right-aligned action link. Renders from props only. */
export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-5">
      <Text className="text-lg font-bold text-foreground">{title}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={8} className="active:opacity-60">
          <Text className="text-sm font-semibold text-primary">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
