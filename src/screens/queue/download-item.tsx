import { Pressable, View } from 'react-native';

import { AppText } from '@/components/app-text';
import type { DownloadQueueItem } from '@/providers/download-queue-provider';
import { colors, radius, sizes, spacing } from '@/theme';

type DownloadItemProps = {
  item: DownloadQueueItem;
  isBusy?: boolean;
  onCopy?: () => void;
  onRemove?: () => void;
  onRetry?: () => void;
};

export function DownloadItem({
  item,
  isBusy = false,
  onCopy,
  onRemove,
  onRetry,
}: DownloadItemProps) {
  return (
    <View style={{ gap: spacing.sm, paddingVertical: spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <View
          style={{
            width: sizes.thumbnail,
            height: sizes.thumbnail,
            borderRadius: radius.md,
            borderCurve: 'continuous',
            backgroundColor: colors.skySoft,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AppText
            variant="glyphLarge"
            style={{ color: item.status === 'failed' ? colors.danger : colors.accent }}
          >
            {item.status === 'failed' ? '!' : '▷'}
          </AppText>
        </View>

        <View style={{ flex: 1, gap: spacing.xs }}>
          <AppText variant="headline" numberOfLines={1}>
            {item.title}
          </AppText>
          <AppText variant="subhead">{item.meta}</AppText>
          {item.status === 'failed' ? (
            <AppText variant="caption" style={{ color: colors.danger }}>
              Download failed
            </AppText>
          ) : (
            <View style={{ gap: spacing.xs }}>
              <View
                style={{
                  height: sizes.progress,
                  borderRadius: radius.full,
                  backgroundColor: colors.progressTrack,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    width: `${item.progress ?? 0}%`,
                    height: '100%',
                    borderRadius: radius.full,
                    backgroundColor: colors.accent,
                  }}
                />
              </View>
              <AppText variant="caption">{item.progress ?? 0}%</AppText>
            </View>
          )}
        </View>
      </View>

      {item.status === 'failed' ? (
        <View style={{ gap: spacing.sm }}>
          <View
            style={{
              gap: spacing.xs,
              padding: spacing.md,
              borderRadius: radius.md,
              borderCurve: 'continuous',
              backgroundColor: colors.skySoft,
            }}
          >
            <AppText variant="caption" style={{ color: colors.ink }}>
              {item.url}
            </AppText>
            {item.error ? (
              <AppText accessibilityRole="alert" variant="caption" style={{ color: colors.danger }}>
                {item.error}
              </AppText>
            ) : null}
          </View>

          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Copy failed download URL for ${item.title}`}
              onPress={onCopy}
              style={({ pressed }) => ({
                minHeight: sizes.minimumTouch,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: radius.md,
                backgroundColor: pressed ? colors.accentSoft : colors.skySoft,
              })}
            >
              <AppText variant="bodyMedium" style={{ color: colors.accent }}>
                Copy
              </AppText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Try downloading ${item.title} again`}
              accessibilityState={{ disabled: isBusy }}
              disabled={isBusy}
              onPress={onRetry}
              style={({ pressed }) => ({
                minHeight: sizes.minimumTouch,
                flex: 1.4,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: radius.md,
                backgroundColor: pressed ? colors.accentPressed : colors.accent,
                opacity: isBusy ? 0.55 : 1,
              })}
            >
              <AppText variant="bodyMedium" style={{ color: colors.white }}>
                Try again
              </AppText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remove failed download ${item.title}`}
              onPress={onRemove}
              style={({ pressed }) => ({
                minHeight: sizes.minimumTouch,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: radius.md,
                backgroundColor: pressed ? colors.skySoft : colors.transparent,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <AppText variant="bodyMedium" style={{ color: colors.danger }}>
                Remove
              </AppText>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}
