import { useState } from 'react';
import { ScrollView, Switch, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { SurfaceCard } from '@/components/surface-card';
import { colors, sizes, spacing } from '@/theme';

export function SettingsScreen() {
  const [saveToLibrary, setSaveToLibrary] = useState(true);
  const [wifiOnly, setWifiOnly] = useState(false);

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
        <AppText variant="display">Settings</AppText>
        <AppText variant="body" style={{ color: colors.inkMuted }}>
          Choose how SMD handles your downloads.
        </AppText>
      </View>

      <SurfaceCard style={{ gap: spacing.lg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <View style={{ flex: 1, gap: spacing.xs }}>
            <AppText variant="headline">Save to device library</AppText>
            <AppText variant="subhead">Keep completed files with your photos and media.</AppText>
          </View>
          <Switch
            accessibilityLabel="Save completed downloads to device library"
            onValueChange={setSaveToLibrary}
            trackColor={{ false: colors.border, true: colors.accent }}
            value={saveToLibrary}
          />
        </View>

        <View style={{ height: 1, backgroundColor: colors.borderSoft }} />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <View style={{ flex: 1, gap: spacing.xs }}>
            <AppText variant="headline">Download on Wi-Fi only</AppText>
            <AppText variant="subhead">Avoid using mobile data for large files.</AppText>
          </View>
          <Switch
            accessibilityLabel="Download on Wi-Fi only"
            onValueChange={setWifiOnly}
            trackColor={{ false: colors.border, true: colors.accent }}
            value={wifiOnly}
          />
        </View>
      </SurfaceCard>

      <SurfaceCard style={{ gap: spacing.sm }}>
        <AppText variant="headline">Default quality</AppText>
        <AppText variant="bodyMedium" style={{ color: colors.accent }}>
          Best available  ›
        </AppText>
      </SurfaceCard>
    </ScrollView>
  );
}
