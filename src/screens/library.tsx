import { ScrollView, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { SurfaceCard } from '@/components/surface-card';
import { colors, sizes, spacing } from '@/theme';

const collections = [
  { name: 'All downloads', count: 24 },
  { name: 'Videos', count: 18 },
  { name: 'Audio', count: 6 },
] as const;

export function LibraryScreen() {
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
        <AppText variant="display">Library</AppText>
        <AppText variant="body" style={{ color: colors.inkMuted }}>
          Everything you save, organized in one place.
        </AppText>
      </View>

      <View style={{ gap: spacing.md }}>
        {collections.map((collection) => (
          <SurfaceCard
            key={collection.name}
            style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}
          >
            <View style={{ flex: 1, gap: spacing.xs }}>
              <AppText variant="headline">{collection.name}</AppText>
              <AppText variant="subhead">{collection.count} items</AppText>
            </View>
            <AppText variant="glyph">›</AppText>
          </SurfaceCard>
        ))}
      </View>
    </ScrollView>
  );
}
