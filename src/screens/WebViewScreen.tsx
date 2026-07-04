import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WebView } from 'react-native-webview';

import type { RootStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'WebView'>;

/**
 * Phase 2 shell: renders the target URL. The RN↔web postMessage bridge
 * (injected JS + onMessage handler) is added in Phase 8.
 */
export function WebViewScreen({ route }: Props) {
  const { url } = route.params;
  return <WebView source={{ uri: url }} startInLoadingState />;
}
