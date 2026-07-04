import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, Text, View } from 'react-native';

import { DETAIL, SHELL } from '@/constants/strings';
import type { RootStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export function DetailScreen({ route, navigation }: Props) {
  const { courseId } = route.params;

  return (
    <View className="flex-1 bg-background px-5 pt-6">
      <Text className="text-sm text-muted">{SHELL.detailCourseId}</Text>
      <Text className="text-2xl font-bold text-foreground">{courseId}</Text>

      <Pressable
        onPress={() =>
          navigation.navigate('WebView', {
            url: 'https://reactnative.dev',
            title: DETAIL.viewSyllabus,
          })
        }
        className="mt-8 rounded-2xl bg-primary px-5 py-4 active:opacity-80"
      >
        <Text className="text-center text-base font-semibold text-primary-foreground">
          {DETAIL.viewSyllabus}
        </Text>
      </Pressable>

      <Text className="mt-6 text-sm text-subtle">{SHELL.detailNote}</Text>
    </View>
  );
}
