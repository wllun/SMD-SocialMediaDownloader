import * as Clipboard from 'expo-clipboard';
import { Link } from 'expo-router';
import { Alert, Pressable, ScrollView, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { SurfaceCard } from '@/components/surface-card';
import { useDownloadQueue } from '@/providers/download-queue-provider';
import { colors, radius, sizes, spacing } from '@/theme';

import { DownloadItem } from './download-item';

export function QueueScreen() {
  const { downloads, isDownloading, removeDownload, runDirectDownload } = useDownloadQueue();

  async function copyUrl(url: string) {
    try {
      await Clipboard.setStringAsync(url);
      Alert.alert('Link copied', 'The failed download URL is ready to paste.');
    } catch {
      Alert.alert('Could not copy link', 'Select and copy the URL from the failed item instead.');
    }
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        width: '100%',
        maxWidth: sizes.maxContent,
        alignSelf: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xxl,
        paddingBottom: spacing.xxxl * 3,
        gap: spacing.xl,
      }}
    >
      <View style={{ gap: spacing.sm }}>
        <AppText variant="display">Queue</AppText>
        <AppText variant="body" style={{ color: colors.inkMuted }}>
          Downloads in progress and links that need your attention.
        </AppText>
      </View>

      <SurfaceCard style={{ gap: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <AppText variant="section" style={{ flex: 1 }}>
            Downloads
          </AppText>
          <View
            accessibilityLabel={`${downloads.length} items in Queue`}
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
                  isBusy={isDownloading}
                  item={item}
                  onCopy={() => copyUrl(item.url)}
                  onRemove={() => removeDownload(item.id)}
                  onRetry={() => runDirectDownload(item.url, item.id)}
                />
                {index < downloads.length - 1 ? (
                  <View style={{ height: 1, backgroundColor: colors.borderSoft }} />
                ) : null}
              </View>
            ))}
          </View>
        ) : (
          <View style={{ paddingVertical: spacing.xl, alignItems: 'center', gap: spacing.xs }}>
            <AppText variant="bodyMedium">Queue is empty</AppText>
            <AppText variant="subhead" style={{ textAlign: 'center' }}>
              Downloads started from Home will appear here.
            </AppText>
            <Link href="/" asChild>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Go to Home to start a download"
                style={({ pressed }) => ({
                  minHeight: sizes.minimumTouch,
                  justifyContent: 'center',
                  paddingHorizontal: spacing.lg,
                  borderRadius: radius.md,
                  backgroundColor: pressed ? colors.accentSoft : colors.skySoft,
                })}
              >
                <AppText variant="bodyMedium" style={{ color: colors.accent }}>
                  Start a download
                </AppText>
              </Pressable>
            </Link>
          </View>
        )}
      </SurfaceCard>
    </ScrollView>
  );
}
