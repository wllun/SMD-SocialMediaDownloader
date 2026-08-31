import { useEffect, useMemo, useState } from 'react';
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

type Feedback = { tone: 'success' | 'error'; text: string };

function getUrlError(value: string) {
  if (!value.trim()) return 'Enter a downloader website URL or remove this row.';
  try {
    const url = new URL(value.trim().replace('{url}', 'https%3A%2F%2Fexample.com%2Fpost'));
    if (url.protocol !== 'https:') return 'Use a secure HTTPS address.';
  } catch {
    return 'Enter a complete URL, such as https://example.com.';
  }
  return undefined;
}

export function SettingsScreen() {
  const [downloaders, setDownloaders] = useState<DownloaderSettings>(() =>
    createEmptyDownloaderSettings(),
  );
  const [feedback, setFeedback] = useState<Feedback>();
  const [touchedWebsiteIds, setTouchedWebsiteIds] = useState<Record<string, boolean>>({});
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify(createEmptyDownloaderSettings()),
  );

  useEffect(() => {
    const stored = getDownloaderSettings();
    setDownloaders(stored);
    setSavedSnapshot(JSON.stringify(stored));
  }, []);

  const currentSnapshot = useMemo(() => JSON.stringify(downloaders), [downloaders]);
  const hasUnsavedChanges = currentSnapshot !== savedSnapshot;
  const configuredCount = useMemo(
    () =>
      socialPlatforms.filter((platform) =>
        downloaders[platform.id].websites.length > 0 &&
        downloaders[platform.id].websites.every((website) => !getUrlError(website.url)),
      ).length,
    [downloaders],
  );

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
    setFeedback(undefined);
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
    setFeedback(undefined);
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
    setTouchedWebsiteIds((current) => {
      const next = { ...current };
      delete next[websiteId];
      return next;
    });
    setFeedback(undefined);
  }

  function setDefaultDownloader(platformId: keyof DownloaderSettings, websiteId: string) {
    setDownloaders((current) => ({
      ...current,
      [platformId]: { ...current[platformId], defaultWebsiteId: websiteId },
    }));
    setFeedback(undefined);
  }

  function handleSave() {
    const invalidWebsites = socialPlatforms.flatMap((platform) =>
      downloaders[platform.id].websites.filter((website) => getUrlError(website.url)),
    );
    if (invalidWebsites.length > 0) {
      setTouchedWebsiteIds((current) => ({
        ...current,
        ...Object.fromEntries(invalidWebsites.map((website) => [website.id, true])),
      }));
      setFeedback({
        tone: 'error',
        text: `Fix ${invalidWebsites.length} invalid ${invalidWebsites.length === 1 ? 'URL' : 'URLs'} before saving.`,
      });
      return;
    }

    try {
      const saved = saveDownloaderSettings(downloaders);
      setDownloaders(saved);
      setSavedSnapshot(JSON.stringify(saved));
      setTouchedWebsiteIds({});
      setFeedback({ tone: 'success', text: 'Downloader websites saved on this device.' });
    } catch (error) {
      setFeedback({
        tone: 'error',
        text: error instanceof Error ? error.message : 'Could not save settings.',
      });
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
          setSavedSnapshot(JSON.stringify(cleared));
          setTouchedWebsiteIds({});
          setFeedback({ tone: 'success', text: 'All downloader websites cleared.' });
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
          Choose trusted downloader websites and decide which one each platform uses by default.
        </AppText>
      </View>

      <SurfaceCard
        style={{
          gap: spacing.md,
          backgroundColor: colors.skySoft,
          borderColor: colors.accentSoft,
          boxShadow: 'none',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <View style={{ flex: 1, gap: spacing.xs }}>
            <AppText variant="headline">Downloader setup</AppText>
            <AppText variant="subhead">
              {configuredCount} of {socialPlatforms.length} platforms configured
            </AppText>
          </View>
          <View
            accessibilityLabel={`${configuredCount} of ${socialPlatforms.length} platforms configured`}
            style={{
              minWidth: sizes.minimumTouch,
              height: sizes.minimumTouch,
              paddingHorizontal: spacing.md,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: radius.full,
              backgroundColor: colors.surface,
            }}
          >
            <AppText variant="bodyMedium" style={{ color: colors.accent, fontVariant: ['tabular-nums'] }}>
              {configuredCount}/{socialPlatforms.length}
            </AppText>
          </View>
        </View>
        <AppText variant="subhead">
          SMD copies the post link before opening the default website. HTTPS addresses only.
        </AppText>
      </SurfaceCard>

      <View style={{ gap: spacing.md }}>
        <View style={{ gap: spacing.xs }}>
          <AppText variant="section">Downloader websites</AppText>
          <AppText variant="subhead">
            Add {'{url}'} to an address when the website supports a prefilled post link.
          </AppText>
        </View>

        {socialPlatforms.map((platform) => {
          const setting = downloaders[platform.id];
          const isConfigured =
            setting.websites.length > 0 &&
            setting.websites.every((website) => !getUrlError(website.url));
          return (
            <SurfaceCard key={platform.id} style={{ gap: spacing.lg }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <View style={{ flex: 1, gap: spacing.xs }}>
                  <AppText variant="headline">{platform.label}</AppText>
                  <AppText variant="caption">
                    {setting.websites.length === 0
                      ? 'Not configured'
                      : `${setting.websites.length} ${setting.websites.length === 1 ? 'website' : 'websites'}`}
                  </AppText>
                </View>
                {isConfigured ? (
                  <View
                    style={{
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.sm,
                      borderRadius: radius.full,
                      backgroundColor: colors.mintSoft,
                    }}
                  >
                    <AppText variant="caption" style={{ color: colors.success }}>
                      Configured
                    </AppText>
                  </View>
                ) : null}
              </View>

              {setting.websites.length === 0 ? (
                <View
                  style={{
                    padding: spacing.lg,
                    gap: spacing.xs,
                    borderRadius: radius.md,
                    borderCurve: 'continuous',
                    backgroundColor: colors.background,
                  }}
                >
                  <AppText variant="bodyMedium">No downloader added</AppText>
                  <AppText variant="subhead">
                    Add a trusted HTTPS website to enable {platform.label} links.
                  </AppText>
                </View>
              ) : null}

              {setting.websites.map((website, index) => {
                const isDefault = website.id === setting.defaultWebsiteId;
                const fieldError = touchedWebsiteIds[website.id]
                  ? getUrlError(website.url)
                  : undefined;
                return (
                  <View
                    key={website.id}
                    style={{
                      gap: spacing.md,
                      padding: spacing.md,
                      borderWidth: 1,
                      borderColor: fieldError
                        ? colors.danger
                        : isDefault
                          ? colors.accent
                          : colors.borderSoft,
                      borderRadius: radius.md,
                      borderCurve: 'continuous',
                      backgroundColor: isDefault ? colors.accentSoft : colors.background,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                      <View style={{ flex: 1, gap: spacing.xxs }}>
                        <AppText variant="bodyMedium">Website {index + 1}</AppText>
                        <AppText variant="caption">
                          {isDefault ? 'Used automatically for this platform' : 'Available as an alternative'}
                        </AppText>
                      </View>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Remove ${platform.label} URL ${index + 1}`}
                        onPress={() => removeDownloader(platform.id, website.id)}
                        style={({ pressed }) => ({
                          minWidth: sizes.minimumTouch,
                          minHeight: sizes.minimumTouch,
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: pressed ? 0.55 : 1,
                        })}
                      >
                        <AppText variant="caption" style={{ color: colors.danger }}>
                          Remove
                        </AppText>
                      </Pressable>
                    </View>

                    <AppText variant="caption" style={{ color: colors.ink }}>
                      Downloader URL
                    </AppText>
                    <TextInput
                      accessibilityLabel={`${platform.label} downloader website URL ${index + 1}`}
                      accessibilityHint="Enter a secure website address. You may include the URL placeholder."
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="url"
                      onBlur={() =>
                        setTouchedWebsiteIds((current) => ({ ...current, [website.id]: true }))
                      }
                      onChangeText={(value) => updateDownloader(platform.id, website.id, value)}
                      placeholder="https://trusted-downloader.example/"
                      placeholderTextColor={colors.inkFaint}
                      style={[
                        typography.body,
                        {
                          minHeight: sizes.input,
                          color: colors.ink,
                          backgroundColor: colors.background,
                          borderColor: fieldError ? colors.danger : isDefault ? colors.accent : colors.border,
                          borderWidth: 1,
                          borderRadius: radius.md,
                          borderCurve: 'continuous',
                          paddingHorizontal: spacing.md,
                        },
                      ]}
                      value={website.url}
                    />

                    {fieldError ? (
                      <AppText accessibilityRole="alert" variant="caption" style={{ color: colors.danger }}>
                        {fieldError}
                      </AppText>
                    ) : null}

                    <Pressable
                      accessibilityRole="radio"
                      accessibilityState={{ checked: isDefault }}
                      accessibilityLabel={`Use ${platform.label} website ${index + 1} by default`}
                      onPress={() => setDefaultDownloader(platform.id, website.id)}
                      style={({ pressed }) => ({
                        minHeight: sizes.minimumTouch,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: spacing.sm,
                        paddingHorizontal: spacing.sm,
                        borderRadius: radius.sm,
                        backgroundColor: pressed ? colors.skySoft : colors.transparent,
                      })}
                    >
                      <View
                        style={{
                          width: 22,
                          height: 22,
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
                      <AppText
                        variant="bodyMedium"
                        style={{ color: isDefault ? colors.accent : colors.inkMuted }}
                      >
                        {isDefault ? 'Default website' : 'Set as default'}
                      </AppText>
                    </Pressable>
                  </View>
                );
              })}

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Add another downloader website for ${platform.label}`}
                onPress={() => addDownloader(platform.id)}
                style={({ pressed }) => ({
                  minHeight: sizes.minimumTouch,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: radius.md,
                  backgroundColor: pressed ? colors.accentSoft : colors.transparent,
                })}
              >
                <AppText variant="bodyMedium" style={{ color: colors.accent }}>
                  {setting.websites.length === 0 ? 'Add downloader website' : 'Add another website'}
                </AppText>
              </Pressable>
            </SurfaceCard>
          );
        })}
      </View>

      {feedback ? (
        <AppText
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          selectable
          variant="bodyMedium"
          style={{ color: feedback.tone === 'success' ? colors.success : colors.danger }}
        >
          {feedback.text}
        </AppText>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !hasUnsavedChanges }}
        disabled={!hasUnsavedChanges}
        onPress={handleSave}
        style={({ pressed }) => ({
          minHeight: sizes.button,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: !hasUnsavedChanges
            ? colors.border
            : pressed
              ? colors.accentPressed
              : colors.accent,
          borderRadius: radius.lg,
          borderCurve: 'continuous',
          boxShadow: hasUnsavedChanges ? shadows.raised : 'none',
        })}
      >
        <AppText variant="button" style={{ color: hasUnsavedChanges ? colors.white : colors.inkMuted }}>
          {hasUnsavedChanges ? 'Save changes' : 'All changes saved'}
        </AppText>
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
