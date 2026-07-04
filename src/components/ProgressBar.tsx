import { View } from 'react-native';

interface ProgressBarProps {
  /** Completion ratio 0..1. */
  progress: number;
  /** Track height in px. */
  height?: number;
  className?: string;
}

/** Thin token-themed progress track used on cards and the continue-learning row. */
export function ProgressBar({ progress, height = 4, className }: ProgressBarProps) {
  const pct = Math.min(1, Math.max(0, progress));

  return (
    <View
      className={`w-full overflow-hidden rounded-full bg-border ${className ?? ''}`}
      style={{ height }}
    >
      <View
        className="h-full rounded-full bg-primary"
        style={{ width: `${pct * 100}%` }}
      />
    </View>
  );
}
