import { Pressable, Text } from 'react-native';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

/** Small themed pill. Static when no `onPress`, toggleable when provided. */
export function Chip({ label, selected = false, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className={`rounded-full px-3 py-1.5 active:opacity-80 ${
        selected ? 'bg-primary' : 'border border-border bg-card'
      }`}
    >
      <Text
        className={`text-xs font-medium ${
          selected ? 'text-primary-foreground' : 'text-foreground'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
