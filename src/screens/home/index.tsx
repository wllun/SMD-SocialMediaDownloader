import * as Clipboard from 'expo-clipboard';
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
import { colors, radius, shadows, sizes, spacing, typography } from '@/theme';

import { DownloadItem, type DownloadItemData } from './download-item';
import { SourceChip } from './source-chip';

const sourceTypes = [
  { symbol: '▷', label: 'Video' },
  { symbol: '▣', label: 'Clips' },
  { symbol: '◉', label: 'Photos' },
  { symbol: '♪', label: 'Music' },
  { symbol: '◇', label: 'Social' },
  { symbol: '•••', label: 'More' },
] as const;

const initialDownloads: DownloadItemData[] = [
  { id: '1', title: 'Mountain sunrise', meta: 'MP4  ·  1080p', date: 'Today' },
  { id: '2', title: 'Weekend city guide', meta: 'MP4  ·  720p', date: 'Yesterday' },
  { id: '3', title: 'Focus playlist', meta: 'MP3  ·  320 kbps', date: 'Yesterday' },
];

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
  const [downloads, setDownloads] = useState(initialDownloads);

  const queuedItem = useMemo(
    () => downloads.find((item) => item.progress !== undefined),
    [downloads],
  );

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

    if (!isDirectMediaUrl(url)) {
      setError('For now, enter a direct media URL ending in a supported file extension.');
      return;
    }

    setError(undefined);
    setIsAnalyzing(true);

    const hostname = new URL(url.trim()).hostname.replace(/^www\./, '');
    const id = String(Date.now());
    const title = `Media from ${hostname}`;

    setDownloads((current) => [
      { id, title, meta: 'Direct file', date: 'Downloading', progress: 0 },
      ...current,
    ]);

    try {
      const result = await downloadMedia(url.trim(), (progress) => {
        setDownloads((current) =>
          current.map((item) => (item.id === id ? { ...item, progress } : item)),
        );
      });

      const location =
        result.savedTo === 'device-library'
          ? 'Saved to your device library'
          : result.savedTo === 'browser'
            ? 'Saved by your browser'
            : 'Opened the device save menu';

      setDownloads((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, title: result.fileName, date: 'Just now', progress: undefined }
            : item,
        ),
      );
      Alert.alert('Download complete', location);
      setUrl('');
    } catch (downloadError) {
      const message =
        downloadError instanceof Error ? downloadError.message : 'The download failed.';
      setDownloads((current) => current.filter((item) => item.id !== id));
      setError(
        message.includes('Network request failed')
          ? 'Could not reach that file. On web, the source must allow cross-origin downloads.'
          : message,
      );
    } finally {
      setIsAnalyzing(false);
    }
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

      <View style={{ gap: spacing.lg }}>
        <AppText variant="headline">Works with your favorite platforms</AppText>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          {sourceTypes.map((source) => (
            <SourceChip key={source.label} {...source} />
          ))}
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
              {queuedItem ? '1' : '0'}
            </AppText>
          </View>
        </View>

        {queuedItem ? (
          <DownloadItem item={queuedItem} />
        ) : (
          <View style={{ paddingVertical: spacing.lg, alignItems: 'center', gap: spacing.xs }}>
            <AppText variant="bodyMedium">Nothing waiting</AppText>
            <AppText variant="subhead">New downloads will appear here.</AppText>
          </View>
        )}
      </SurfaceCard>

      <View style={{ gap: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <AppText variant="section" style={{ flex: 1 }}>
            Recent
          </AppText>
          <AppText variant="bodyMedium" style={{ color: colors.accent }}>
            View all  ›
          </AppText>
        </View>
        <SurfaceCard style={{ paddingVertical: 0 }}>
          {downloads
            .filter((item) => item.progress === undefined)
            .map((item, index, items) => (
              <View key={item.id}>
                <DownloadItem item={item} />
                {index < items.length - 1 ? (
                  <View style={{ height: 1, backgroundColor: colors.borderSoft }} />
                ) : null}
              </View>
            ))}
        </SurfaceCard>
      </View>
    </ScrollView>
  );
}
