import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, TextInput, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { SurfaceCard } from '@/components/surface-card';
import {
  createEmptyDownloaderSettings,
  getDownloaderSettings,
  saveDownloaderSettings,
  socialPlatforms,
  type DownloaderSettings,
} from '@/services/downloader-settings';
import { colors, radius, shadows, sizes, spacing, typography } from '@/theme';

export function SettingsScreen() {
  const [downloaders, setDownloaders] = useState<DownloaderSettings>(() =>
    createEmptyDownloaderSettings(),
  );
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    setDownloaders(getDownloaderSettings());
  }, []);

  function updateDownloader(
    platformId: keyof DownloaderSettings,
    websiteId: string,
    value: string,
  ) {
    setDownloaders((current) => ({
      ...current,
      [platformId]: {
        ...current[platformId],
        websites: current[platformId].websites.map((website) =>
          website.id === websiteId ? { ...website, url: value } : website,
        ),
      },
    }));
    setMessage(undefined);
  }

  function addDownloader(platformId: keyof DownloaderSettings) {
    const id = `${platformId}-${Date.now()}`;
    setDownloaders((current) => {
      const setting = current[platformId];
      return {
        ...current,
        [platformId]: {
          websites: [...setting.websites, { id, url: '' }],
          defaultWebsiteId: setting.defaultWebsiteId ?? id,
        },
      };
    });
    setMessage(undefined);
  }

  function removeDownloader(platformId: keyof DownloaderSettings, websiteId: string) {
    setDownloaders((current) => {
      const setting = current[platformId];
      const websites = setting.websites.filter((website) => website.id !== websiteId);
      return {
        ...current,
        [platformId]: {
          websites,
          defaultWebsiteId:
            setting.defaultWebsiteId === websiteId
              ? websites[0]?.id
              : setting.defaultWebsiteId,
        },
      };
    });
    setMessage(undefined);
  }

  function setDefaultDownloader(platformId: keyof DownloaderSettings, websiteId: string) {
    setDownloaders((current) => ({
      ...current,
      [platformId]: { ...current[platformId], defaultWebsiteId: websiteId },
    }));
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
          const cleared = saveDownloaderSettings(createEmptyDownloaderSettings());
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

        {socialPlatforms.map((platform) => {
          const setting = downloaders[platform.id];
          return (
            <SurfaceCard key={platform.id} style={{ gap: spacing.md }}>
              <AppText variant="headline">{platform.label}</AppText>

              {setting.websites.map((website, index) => {
                const isDefault = website.id === setting.defaultWebsiteId;
                return (
                  <View key={website.id} style={{ gap: spacing.sm }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                      <Pressable
                        accessibilityRole="radio"
                        accessibilityState={{ checked: isDefault }}
                        accessibilityLabel={`Use ${platform.label} URL ${index + 1} by default`}
                        onPress={() => setDefaultDownloader(platform.id, website.id)}
                        style={({ pressed }) => ({
                          minHeight: sizes.minimumTouch,
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: spacing.sm,
                          opacity: pressed ? 0.6 : 1,
                        })}
                      >
                        <View
                          style={{
                            width: 20,
                            height: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: radius.full,
                            borderWidth: 2,
                            borderColor: isDefault ? colors.accent : colors.border,
                          }}
                        >
                          {isDefault ? (
                            <View
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: radius.full,
                                backgroundColor: colors.accent,
                              }}
                            />
                          ) : null}
                        </View>
                        <AppText variant="caption" style={{ color: colors.inkMuted }}>
                          {isDefault ? 'Default' : 'Set as default'}
                        </AppText>
                      </Pressable>

                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Remove ${platform.label} URL ${index + 1}`}
                        onPress={() => removeDownloader(platform.id, website.id)}
                        style={({ pressed }) => ({ marginLeft: 'auto', opacity: pressed ? 0.55 : 1 })}
                      >
                        <AppText variant="caption" style={{ color: colors.danger }}>
                          Remove
                        </AppText>
                      </Pressable>
                    </View>

                    <TextInput
                      accessibilityLabel={`${platform.label} downloader website URL ${index + 1}`}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="url"
                      onChangeText={(value) => updateDownloader(platform.id, website.id, value)}
                      placeholder="https://trusted-downloader.example/"
                      placeholderTextColor={colors.inkFaint}
                      style={[
                        typography.body,
                        {
                          minHeight: sizes.input,
                          color: colors.ink,
                          backgroundColor: colors.background,
                          borderColor: isDefault ? colors.accent : colors.border,
                          borderWidth: 1,
                          borderRadius: radius.md,
                          borderCurve: 'continuous',
                          paddingHorizontal: spacing.md,
                        },
                      ]}
                      value={website.url}
                    />
                  </View>
                );
              })}

              <Pressable
                accessibilityRole="button"
                onPress={() => addDownloader(platform.id)}
                style={({ pressed }) => ({
                  minHeight: sizes.minimumTouch,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: radius.md,
                  backgroundColor: pressed ? colors.accentSoft : colors.transparent,
                })}
              >
                <AppText variant="bodyMedium" style={{ color: colors.accent }}>
                  + Add URL
                </AppText>
              </Pressable>
            </SurfaceCard>
          );
        })}
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
