import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SEARCH, SHELL } from '@/constants/strings';

export function SearchScreen() {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <View className="flex-1 px-5 pt-4">
        <Text className="text-3xl font-bold text-foreground">{SEARCH.title}</Text>
        <Text className="mt-2 text-base text-muted">{SEARCH.promptBody}</Text>
        <Text className="mt-6 text-sm text-subtle">{SHELL.searchNote}</Text>
      </View>
    </SafeAreaView>
  );
}
