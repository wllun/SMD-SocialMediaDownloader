import { router, Stack } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, View } from 'react-native';
import { WebView, type WebViewNavigation } from 'react-native-webview';
import type { FileDownloadEvent } from 'react-native-webview/lib/WebViewTypes';

import { AppText } from '@/components/app-text';
import { downloadMedia } from '@/services/download-media';
import { colors, radius, spacing } from '@/theme';

type DownloaderScreenProps = {
  platform?: string;
  url?: string;
};

const directMediaExtensions = new Set([
  'mp4', 'mov', 'm4v', 'webm',
  'jpg', 'jpeg', 'png', 'webp', 'gif',
  'mp3', 'm4a', 'aac', 'wav',
]);

function isSecureWebUrl(value?: string) {
  try {
    return new URL(value ?? '').protocol === 'https:';
  } catch {
    return false;
  }
}

function isDirectMediaUrl(value: string) {
  try {
    const pathname = new URL(value).pathname.toLowerCase();
    return directMediaExtensions.has(pathname.split('.').pop() ?? '');
  } catch {
    return false;
  }
}

function getDisplayAddress(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.hostname || parsed.protocol.replace(':', '');
  } catch {
    return 'Downloader website';
  }
}

export function DownloaderScreen({ platform, url }: DownloaderScreenProps) {
  const webView = useRef<WebView>(null);
  const [currentUrl, setCurrentUrl] = useState(url ?? '');
  const [canGoBack, setCanGoBack] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function saveDownload(downloadUrl: string) {
    if (isDownloading) return;
    setIsDownloading(true);
    setProgress(0);
    try {
      const result = await downloadMedia(downloadUrl, setProgress);
      const location =
        result.savedTo === 'device-library'
          ? 'Saved to your device library.'
          : 'Opened the device save menu.';
      Alert.alert('Download complete', location);
    } catch (error) {
      Alert.alert(
        'Could not save this file',
        error instanceof Error ? error.message : 'The download failed.',
      );
    } finally {
      setIsDownloading(false);
    }
  }

  function handleNavigationChange(navigation: WebViewNavigation) {
    setCanGoBack(navigation.canGoBack);
    setCurrentUrl(navigation.url);
  }

  function handleShouldStart(request: WebViewNavigation) {
    if (isDirectMediaUrl(request.url)) {
      void saveDownload(request.url);
      return false;
    }

    if (request.url.startsWith('https://') || request.url.startsWith('about:blank')) {
      return true;
    }

    if (request.url.startsWith('http://')) {
      Alert.alert('Blocked insecure page', 'SMD only opens HTTPS pages inside the app.');
      return false;
    }

    if (request.url.startsWith('blob:') || request.url.startsWith('data:')) {
      return true;
    }

    void Linking.openURL(request.url).catch(() => {
      Alert.alert('Unsupported link', 'This link cannot be opened on the device.');
    });
    return false;
  }

  if (!isSecureWebUrl(url)) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacing.sm,
          padding: spacing.xl,
          backgroundColor: colors.background,
        }}
      >
        <AppText variant="section">Invalid downloader URL</AppText>
        <AppText variant="body" selectable style={{ color: colors.inkMuted, textAlign: 'center' }}>
          Configure an HTTPS website for {platform ?? 'this platform'} in Settings.
        </AppText>
      </View>
    );
  }

  const sourceUrl = url as string;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close downloader"
              onPress={() => router.back()}
              style={{ padding: spacing.sm }}
            >
              <AppText variant="bodyMedium" style={{ color: colors.accent }}>
                Close
              </AppText>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Open downloader in external browser"
              onPress={() => Linking.openURL(currentUrl)}
              style={{ padding: spacing.sm }}
            >
              <AppText variant="bodyMedium" style={{ color: colors.accent }}>
                Browser ↗
              </AppText>
            </Pressable>
          ),
        }}
      />

      <View
        style={{
          minHeight: 40,
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          paddingHorizontal: spacing.md,
          backgroundColor: colors.surface,
          borderBottomColor: colors.borderSoft,
          borderBottomWidth: 1,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back in downloader website"
          disabled={!canGoBack}
          onPress={() => webView.current?.goBack()}
          style={{ padding: spacing.xs, opacity: canGoBack ? 1 : 0.3 }}
        >
          <AppText variant="bodyMedium" style={{ color: colors.accent }}>
            ‹ Page
          </AppText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Reload downloader website"
          onPress={() => webView.current?.reload()}
          style={{ padding: spacing.xs }}
        >
          <AppText variant="bodyMedium" style={{ color: colors.accent }}>
            Reload
          </AppText>
        </Pressable>
        {isDownloading ? <ActivityIndicator size="small" color={colors.accent} /> : null}
        <AppText variant="caption" numberOfLines={1} style={{ flex: 1 }}>
          {isDownloading ? `Saving file… ${progress}%` : getDisplayAddress(currentUrl)}
        </AppText>
      </View>

      <WebView
        ref={webView}
        allowsBackForwardNavigationGestures
        javaScriptCanOpenWindowsAutomatically={false}
        onFileDownload={(event: FileDownloadEvent) => {
          void saveDownload(event.nativeEvent.downloadUrl);
        }}
        onNavigationStateChange={handleNavigationChange}
        onShouldStartLoadWithRequest={handleShouldStart}
        originWhitelist={['https://*', 'about:blank', 'blob:*', 'data:*']}
        pullToRefreshEnabled
        renderError={() => (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.sm,
              padding: spacing.xl,
            }}
          >
            <AppText variant="section">Website unavailable</AppText>
            <AppText variant="body" style={{ color: colors.inkMuted, textAlign: 'center' }}>
              Reload the page or open it in your external browser.
            </AppText>
          </View>
        )}
        renderLoading={() => (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.sm,
              backgroundColor: colors.background,
            }}
          >
            <ActivityIndicator color={colors.accent} />
            <AppText variant="subhead">Opening downloader…</AppText>
          </View>
        )}
        setSupportMultipleWindows={false}
        source={{ uri: sourceUrl }}
        startInLoadingState
        style={{ flex: 1, backgroundColor: colors.background }}
        thirdPartyCookiesEnabled={false}
      />

      <View
        style={{
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          backgroundColor: colors.mintSoft,
          borderTopLeftRadius: radius.md,
          borderTopRightRadius: radius.md,
        }}
      >
        <AppText variant="caption" selectable style={{ textAlign: 'center' }}>
          External website. Never enter social-media passwords, cookies, or payment details.
        </AppText>
      </View>
    </View>
  );
}
