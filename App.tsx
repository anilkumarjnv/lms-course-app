import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

import './global.css';
import { APP } from '@/constants/strings';

// Phase 1 placeholder. The full provider stack + navigation land in Phase 2.
export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl font-bold text-slate-900">{APP.name}</Text>
      <Text className="mt-2 text-center text-base text-slate-500">
        {APP.tagline}
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
