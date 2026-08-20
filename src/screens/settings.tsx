import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, TextInput, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { SurfaceCard } from '@/components/surface-card';
import {
  emptyDownloaderSettings,
  getDownloaderSettings,
  saveDownloaderSettings,
  socialPlatforms,
  type DownloaderSettings,
} from '@/services/downloader-settings';
import { colors, radius, shadows, sizes, spacing, typography } from '@/theme';

export function SettingsScreen() {
  const [downloaders, setDownloaders] = useState<DownloaderSettings>({
    ...emptyDownloaderSettings,
  });
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    setDownloaders(getDownloaderSettings());
  }, []);

  function updateDownloader(id: keyof DownloaderSettings, value: string) {
    setDownloaders((current) => ({ ...current, [id]: value }));
    setMessage(undefined);
  }

  function handleSave() {
    try {
      const saved = saveDownloaderSettings(downloaders);
      setDownloaders(saved);
      setMessage('Downloader websites saved on this device.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save settings.');
    }
  }

  function handleClear() {
    Alert.alert('Clear downloader websites?', 'Social links will not open until configured again.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear all',
        style: 'destructive',
        onPress: () => {
          const cleared = saveDownloaderSettings({ ...emptyDownloaderSettings });
          setDownloaders(cleared);
          setMessage('All downloader websites cleared.');
        },
      },
    ]);
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
        <AppText variant="display">Settings</AppText>
        <AppText variant="body" style={{ color: colors.inkMuted }}>
          Choose which external website handles each social platform.
        </AppText>
      </View>

      <SurfaceCard style={{ gap: spacing.sm }}>
        <AppText variant="headline">How it works</AppText>
        <AppText variant="subhead">
          SMD copies the post link and opens your configured website in the device browser. The
          external website and browser control the download.
        </AppText>
      </SurfaceCard>

      <View style={{ gap: spacing.md }}>
        <View style={{ gap: spacing.xs }}>
          <AppText variant="section">Downloader websites</AppText>
          <AppText variant="subhead">
            HTTPS only. Add {'{url}'} where a website accepts a prefilled encoded post link.
          </AppText>
        </View>

        {socialPlatforms.map((platform) => (
          <SurfaceCard key={platform.id} style={{ gap: spacing.sm }}>
            <AppText variant="headline">{platform.label}</AppText>
            <TextInput
              accessibilityLabel={`${platform.label} downloader website URL`}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              onChangeText={(value) => updateDownloader(platform.id, value)}
              placeholder="https://trusted-downloader.example/"
              placeholderTextColor={colors.inkFaint}
              style={[
                typography.body,
                {
                  minHeight: sizes.input,
                  color: colors.ink,
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: radius.md,
                  borderCurve: 'continuous',
                  paddingHorizontal: spacing.md,
                },
              ]}
              value={downloaders[platform.id]}
            />
          </SurfaceCard>
        ))}
      </View>

      {message ? (
        <AppText
          accessibilityRole="alert"
          selectable
          variant="caption"
          style={{ color: message.includes('saved') ? colors.success : colors.danger }}
        >
          {message}
        </AppText>
      ) : null}

      <Pressable
        accessibilityRole="button"
        onPress={handleSave}
        style={({ pressed }) => ({
          minHeight: sizes.button,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: pressed ? colors.accentPressed : colors.accent,
          borderRadius: radius.lg,
          borderCurve: 'continuous',
          boxShadow: shadows.raised,
        })}
      >
        <AppText variant="button">Save downloader websites</AppText>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={handleClear}
        style={({ pressed }) => ({
          minHeight: sizes.minimumTouch,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.55 : 1,
        })}
      >
        <AppText variant="bodyMedium" style={{ color: colors.danger }}>
          Clear all websites
        </AppText>
      </Pressable>

      <SurfaceCard style={{ gap: spacing.sm }}>
        <AppText variant="headline">Safety</AppText>
        <AppText variant="subhead" selectable>
          Configure only websites you trust. SMD does not inspect, control, or endorse their
          content. Never enter social-media passwords, cookies, or payment details into a downloader
          website.
        </AppText>
      </SurfaceCard>
    </ScrollView>
  );
}
