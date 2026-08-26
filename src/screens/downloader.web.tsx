import { Stack } from 'expo-router';
import { Linking, Pressable, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { colors, radius, sizes, spacing } from '@/theme';

type DownloaderScreenProps = {
  platform?: string;
  url?: string;
};

export function DownloaderScreen({ platform, url }: DownloaderScreenProps) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.lg,
        padding: spacing.xl,
        backgroundColor: colors.background,
      }}
    >
      <Stack.Screen options={{ title: `${platform ?? 'Social'} Downloader` }} />
      <AppText variant="section">Open the downloader website</AppText>
      <AppText variant="body" style={{ maxWidth: 520, color: colors.inkMuted, textAlign: 'center' }}>
        Embedded downloader websites are available in the Android and iOS app. On web, open the
        configured site in a new browser tab.
      </AppText>
      <Pressable
        accessibilityRole="link"
        disabled={!url}
        onPress={() => url && Linking.openURL(url)}
        style={({ pressed }) => ({
          minHeight: sizes.button,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: spacing.xl,
          backgroundColor: colors.accent,
          borderRadius: radius.lg,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <AppText variant="button">Open website ↗</AppText>
      </Pressable>
    </View>
  );
}

