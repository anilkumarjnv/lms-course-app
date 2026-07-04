import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP, HOME, SHELL } from '@/constants/strings';
import type { RootStackParamList } from '@/types/navigation';

export function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background">
      <View className="flex-1 px-5 pt-4">
        <Text className="text-3xl font-bold text-foreground">{HOME.title}</Text>
        <Text className="mt-2 text-base text-muted">{APP.tagline}</Text>

        <Pressable
          onPress={() => navigation.navigate('Detail', { courseId: 'c1' })}
          className="mt-8 rounded-2xl bg-primary px-5 py-4 active:opacity-80"
        >
          <Text className="text-center text-base font-semibold text-primary-foreground">
            {SHELL.homeCta}
          </Text>
        </Pressable>

        <Text className="mt-6 text-sm text-subtle">{SHELL.homeNote}</Text>
      </View>
    </SafeAreaView>
  );
}
