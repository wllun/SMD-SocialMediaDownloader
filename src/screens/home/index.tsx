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
import { SurfaceCard } from '@/components/surface-card';
import { downloadMedia } from '@/services/download-media';
import {
  buildDownloaderUrl,
  detectSocialPlatform,
  getDownloaderSettings,
  getDefaultDownloaderUrl,
} from '@/services/downloader-settings';
import { colors, radius, shadows, sizes, spacing, typography } from '@/theme';

import { DownloadItem, type DownloadItemData } from './download-item';

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
  const [downloads, setDownloads] = useState<DownloadItemData[]>([]);

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

  async function runDirectDownload(downloadUrl: string, existingId?: string) {
    const hostname = new URL(downloadUrl).hostname.replace(/^www\./, '');
    const id = existingId ?? String(Date.now());
    const title = `Media from ${hostname}`;

    setError(undefined);
    setIsAnalyzing(true);
    setDownloads((current) => {
      const pendingItem: DownloadItemData = {
        id,
        title,
        meta: 'Direct file',
        date: existingId ? 'Retrying' : 'Downloading',
        url: downloadUrl,
        status: 'downloading',
        progress: 0,
      };

      return existingId
        ? current.map((item) => (item.id === id ? pendingItem : item))
        : [pendingItem, ...current];
    });

    try {
      const mediaUrls = [downloadUrl];
      let result: Awaited<ReturnType<typeof downloadMedia>> | undefined;

      for (let index = 0; index < mediaUrls.length; index += 1) {
        result = await downloadMedia(mediaUrls[index], (assetProgress) => {
          const progress = Math.round(((index + assetProgress / 100) / mediaUrls.length) * 100);
          setDownloads((current) =>
            current.map((item) => (item.id === id ? { ...item, progress } : item)),
          );
        });
      }

      if (!result) throw new Error('No downloadable media was returned.');

      const location =
        result.savedTo === 'device-library'
          ? 'Saved to your device library'
          : result.savedTo === 'browser'
            ? 'Saved by your browser'
            : 'Opened the device save menu';

      setDownloads((current) => current.filter((item) => item.id !== id));
      Alert.alert(
        'Download complete',
        mediaUrls.length > 1 ? `${mediaUrls.length} files saved. ${location}.` : location,
      );
      if (!existingId) setUrl('');
    } catch (downloadError) {
      const rawMessage =
        downloadError instanceof Error ? downloadError.message : 'The download failed.';
      const message = rawMessage.includes('Network request failed')
        ? 'Could not reach that file. On web, the source must allow cross-origin downloads.'
        : rawMessage;

      setDownloads((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                date: 'Failed',
                error: message,
                progress: undefined,
                status: 'failed',
              }
            : item,
        ),
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleCopyFailedUrl(item: DownloadItemData) {
    try {
      await Clipboard.setStringAsync(item.url);
      Alert.alert('Link copied', 'The failed download URL is ready to paste.');
    } catch {
      Alert.alert('Could not copy link', 'Select and copy the URL from the failed item instead.');
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

    await runDirectDownload(url.trim());
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
            disabled={isAnalyzing}
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
              opacity: isAnalyzing ? 0.7 : 1,
            })}
          >
            {isAnalyzing ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <AppText variant="glyphLarge" style={{ color: colors.white }}>
                ↓
              </AppText>
            )}
            <AppText variant="button">{isAnalyzing ? 'Analyzing…' : 'Download'}</AppText>
          </Pressable>
        </View>
      </View>

      <SurfaceCard style={{ gap: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <AppText variant="section" style={{ flex: 1 }}>
            Queue
          </AppText>
          <View
            style={{
              minWidth: sizes.minimumTouch,
              height: sizes.minimumTouch,
              borderRadius: radius.full,
              backgroundColor: colors.mintSoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppText variant="headline" style={{ color: colors.accent }}>
              {downloads.length}
            </AppText>
          </View>
        </View>

        {downloads.length > 0 ? (
          <View>
            {downloads.map((item, index) => (
              <View key={item.id}>
                <DownloadItem
                  isBusy={isAnalyzing}
                  item={item}
                  onCopy={() => handleCopyFailedUrl(item)}
                  onRemove={() =>
                    setDownloads((current) => current.filter((entry) => entry.id !== item.id))
                  }
                  onRetry={() => runDirectDownload(item.url, item.id)}
                />
                {index < downloads.length - 1 ? (
                  <View style={{ height: 1, backgroundColor: colors.borderSoft }} />
                ) : null}
              </View>
            ))}
          </View>
        ) : (
          <View style={{ paddingVertical: spacing.lg, alignItems: 'center', gap: spacing.xs }}>
            <AppText variant="bodyMedium">Nothing waiting</AppText>
            <AppText variant="subhead">New downloads will appear here.</AppText>
          </View>
        )}
      </SurfaceCard>

    </ScrollView>
  );
}
