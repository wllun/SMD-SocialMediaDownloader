import { Pressable, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { colors, radius, sizes, spacing } from '@/theme';

export type DownloadItemData = {
  id: string;
  title: string;
  meta: string;
  date: string;
  progress?: number;
};

export function DownloadItem({ item }: { item: DownloadItemData }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.md,
      }}
    >
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
        <AppText variant="glyphLarge">▷</AppText>
      </View>

      <View style={{ flex: 1, gap: spacing.xs }}>
        <AppText variant="headline" numberOfLines={1}>
          {item.title}
        </AppText>
        <AppText variant="subhead">{item.meta}</AppText>
        {item.progress === undefined ? (
          <AppText variant="caption">{item.date}</AppText>
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
                  width: `${item.progress}%`,
                  height: '100%',
                  borderRadius: radius.full,
                  backgroundColor: colors.accent,
                }}
              />
            </View>
            <AppText variant="caption">{item.progress}%</AppText>
          </View>
        )}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Download ${item.title} again`}
        style={({ pressed }) => ({
          width: sizes.minimumTouch,
          height: sizes.minimumTouch,
          borderRadius: radius.md,
          backgroundColor: colors.skySoft,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <AppText variant="glyph">↓</AppText>
      </Pressable>
    </View>
  );
}
