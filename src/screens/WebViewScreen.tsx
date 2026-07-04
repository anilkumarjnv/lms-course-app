import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import { ErrorState } from '@/components/ErrorState';
import { WEBVIEW } from '@/constants/strings';
import { useTheme } from '@/theme/ThemeProvider';
import type { RootStackParamList } from '@/types/navigation';
import { analytics } from '@/utils/analytics';

type Props = NativeStackScreenProps<RootStackParamList, 'WebView'>;

/**
 * Injected once the page finishes loading: posts a PAGE_LOADED message back to
 * RN through the react-native-webview bridge. The trailing `true;` avoids a
 * warning about the injected script's return value.
 */
const INJECTED_JS = `
(function () {
  function post(type, payload) {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, payload: payload }));
    }
  }
  post('PAGE_LOADED', { url: window.location.href, title: document.title });
})();
true;
`;

interface BridgeMessage {
  type: string;
  payload?: { title?: string; url?: string };
}

export function WebViewScreen({ route }: Props) {
  const { url } = route.params;
  const { colors } = useTheme();
  const webRef = useRef<WebView>(null);
  const [errored, setErrored] = useState(false);
  const [bridgeTitle, setBridgeTitle] = useState<string | null>(null);

  // Receive messages posted from the web page (RN <-> web bridge).
  const onMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data) as BridgeMessage;
      if (data.type === 'PAGE_LOADED') {
        analytics.track('webview_page_loaded', data.payload ?? {});
        setBridgeTitle(data.payload?.title ?? '');
      }
    } catch {
      // Non-JSON messages are ignored.
    }
  }, []);

  if (errored) {
    return (
      <ErrorState
        title={WEBVIEW.errorTitle}
        message={WEBVIEW.errorBody}
        onRetry={() => {
          setErrored(false);
          webRef.current?.reload();
        }}
      />
    );
  }

  return (
    <View className="flex-1 bg-background">
      <WebView
        ref={webRef}
        source={{ uri: url }}
        startInLoadingState
        injectedJavaScript={INJECTED_JS}
        onMessage={onMessage}
        onError={() => setErrored(true)}
        renderLoading={() => (
          <View className="absolute inset-0 items-center justify-center bg-background">
            <ActivityIndicator color={colors.primary} />
          </View>
        )}
      />

      {bridgeTitle !== null ? (
        <View className="absolute inset-x-0 bottom-0 flex-row items-center gap-2 bg-primary px-4 py-3">
          <Ionicons name="link" size={16} color={colors['primary-foreground']} />
          <Text
            numberOfLines={1}
            className="flex-1 text-xs font-medium text-primary-foreground"
          >
            {WEBVIEW.bridgeReceived} · {bridgeTitle || WEBVIEW.untitled}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
