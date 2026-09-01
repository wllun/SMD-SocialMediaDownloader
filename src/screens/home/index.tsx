import * as Clipboard from 'expo-clipboard';
import { router, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';

import { AppText } from '@/components/app-text';
import { useDownloadQueue } from '@/providers/download-queue-provider';
import {
  buildDownloaderUrl,
  detectSocialPlatform,
  getDownloaderSettings,
  getDefaultDownloaderUrl,
} from '@/services/downloader-settings';
import { colors, radius, shadows, sizes, spacing, typography } from '@/theme';

function isSupportedUrl(value: string) {
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

const supportedExtensions = new Set([
  'mp4', 'mov', 'm4v', 'webm',
  'jpg', 'jpeg', 'png', 'webp', 'gif',
  'mp3', 'm4a', 'aac', 'wav',
]);

function isDirectMediaUrl(value: string) {
  const pathname = new URL(value.trim()).pathname.toLowerCase();
  const extension = pathname.split('.').pop() ?? '';
  return supportedExtensions.has(extension);
}

export function HomeScreen() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { isDownloading, runDirectDownload } = useDownloadQueue();

  const detectedPlatform = useMemo(() => detectSocialPlatform(url), [url]);

  async function handlePaste() {
    try {
      const clipboardValue = await Clipboard.getStringAsync();
      setUrl(clipboardValue.trim());
      setError(undefined);
    } catch {
      setError('Clipboard access is unavailable. Paste the link manually.');
    }
  }

  async function handleDownload() {
    Keyboard.dismiss();

    if (!isSupportedUrl(url)) {
      setError('Enter a complete http or https link.');
      return;
    }

    const socialPlatform = detectSocialPlatform(url);
    if (!isDirectMediaUrl(url) && !socialPlatform) {
      setError('Enter a direct media URL or a supported social-media post URL.');
      return;
    }

    if (socialPlatform) {
      setError(undefined);
      setIsAnalyzing(true);
      try {
        const downloaderTemplate = getDefaultDownloaderUrl(
          getDownloaderSettings()[socialPlatform.id],
        );
        if (!downloaderTemplate) {
          throw new Error(`Set a downloader website for ${socialPlatform.label} in Settings first.`);
        }

        const downloaderUrl = buildDownloaderUrl(downloaderTemplate, url.trim());
        const downloaderHost = new URL(downloaderUrl).hostname;
        await Clipboard.setStringAsync(url.trim());

        const shouldOpen = await new Promise<boolean>((resolve) => {
          Alert.alert(
            `Open ${socialPlatform.label} downloader?`,
            `The post link was copied. SMD will open ${downloaderHost} inside the app. Only continue if you trust this website.`,
            [
              { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
              { text: 'Open in SMD', onPress: () => resolve(true) },
            ],
            { cancelable: true, onDismiss: () => resolve(false) },
          );
        });

        if (shouldOpen) {
          router.push(
            {
              pathname: '/downloader',
              params: { platform: socialPlatform.label, url: downloaderUrl },
            } as unknown as Href,
          );
          setUrl('');
        }
      } catch (openError) {
        setError(openError instanceof Error ? openError.message : 'Could not open the downloader.');
      } finally {
        setIsAnalyzing(false);
      }
      return;
    }

    setError(undefined);
    if (await runDirectDownload(url.trim())) setUrl('');
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        width: '100%',
        maxWidth: sizes.maxContent,
        alignSelf: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.xxxl * 3,
        gap: spacing.xxl,
      }}
    >
      <View style={{ alignItems: 'center', gap: spacing.md }}>
        <AppText variant="brand">SMD</AppText>
        <View style={{ alignItems: 'center', gap: spacing.sm }}>
          <AppText variant="display" style={{ textAlign: 'center' }}>
            Save videos in seconds
          </AppText>
          <AppText variant="body" style={{ color: colors.inkMuted, textAlign: 'center' }}>
            Paste a link to get started
          </AppText>
        </View>

        <View style={{ width: '100%', gap: spacing.md, paddingTop: spacing.lg }}>
          <View
            style={{
              minHeight: sizes.input,
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.sm,
              paddingLeft: spacing.lg,
              paddingRight: spacing.sm,
              backgroundColor: colors.surface,
              borderColor: error ? colors.danger : colors.border,
              borderWidth: 1,
              borderRadius: radius.lg,
              borderCurve: 'continuous',
            }}
          >
            <AppText variant="glyph">↗</AppText>
            <TextInput
              accessibilityLabel="Media link"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              onChangeText={(value) => {
                setUrl(value);
                if (error) setError(undefined);
              }}
              onSubmitEditing={handleDownload}
              placeholder="Paste link"
              placeholderTextColor={colors.inkFaint}
              returnKeyType="go"
              style={[
                typography.body,
                { flex: 1, minHeight: sizes.input, color: colors.ink },
              ]}
              value={url}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Paste link from clipboard"
              onPress={handlePaste}
              style={({ pressed }) => ({
                minHeight: sizes.minimumTouch,
                justifyContent: 'center',
                paddingHorizontal: spacing.md,
                borderRadius: radius.md,
                backgroundColor: pressed ? colors.accentSoft : colors.transparent,
              })}
            >
              <AppText variant="bodyMedium" style={{ color: colors.accent }}>
                Paste
              </AppText>
            </Pressable>
          </View>

          {error ? (
            <AppText accessibilityRole="alert" variant="caption" style={{ color: colors.danger }}>
              {error}
            </AppText>
          ) : null}

          {!error && detectedPlatform ? (
            <AppText variant="caption" style={{ color: colors.success }}>
              Detected: {detectedPlatform.label}. The post link will be copied before opening its
              configured downloader.
            </AppText>
          ) : null}

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: isAnalyzing || isDownloading }}
            disabled={isAnalyzing || isDownloading}
            onPress={handleDownload}
            style={({ pressed }) => ({
              minHeight: sizes.button,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.sm,
              backgroundColor: pressed ? colors.accentPressed : colors.accent,
              borderRadius: radius.lg,
              borderCurve: 'continuous',
              boxShadow: shadows.raised,
              opacity: isAnalyzing || isDownloading ? 0.7 : 1,
            })}
          >
            {isAnalyzing || isDownloading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <AppText variant="glyphLarge" style={{ color: colors.white }}>
                ↓
              </AppText>
            )}
            <AppText variant="button">
              {isAnalyzing ? 'Analyzing…' : isDownloading ? 'Downloading…' : 'Download'}
            </AppText>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
