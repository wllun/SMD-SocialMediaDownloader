import { useEffect, useMemo, useRef, useState } from 'react';
import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Alert, Pressable, ScrollView, TextInput, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { SurfaceCard } from '@/components/surface-card';
import {
  createEmptyDownloaderSettings,
  getDownloaderSettings,
  saveDownloaderSettings,
  socialPlatforms,
  type DownloaderSettings,
  type SocialPlatformId,
} from '@/services/downloader-settings';
import { colors, radius, sizes, spacing, typography } from '@/theme';

type Feedback = { tone: 'success' | 'error'; text: string };

const platformIcons: Record<SocialPlatformId, number> = {
  instagram: require('../../assets/social/instagram.svg'),
  facebook: require('../../assets/social/facebook.svg'),
  tiktok: require('../../assets/social/tiktok.svg'),
  douyin: require('../../assets/social/tiktok.svg'),
  xhs: require('../../assets/social/xiaohongshu.svg'),
  x: require('../../assets/social/x.svg'),
};

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

function isPlatformConfigured(setting: DownloaderSettings[SocialPlatformId]) {
  return (
    setting.websites.length > 0 &&
    setting.websites.every((website) => !getUrlError(website.url)) &&
    setting.websites.some((website) => website.id === setting.defaultWebsiteId)
  );
}

export function SettingsScreen() {
  const [downloaders, setDownloaders] = useState<DownloaderSettings>(() =>
    createEmptyDownloaderSettings(),
  );
  const [expandedPlatformId, setExpandedPlatformId] =
    useState<SocialPlatformId | null>(null);
  const [feedback, setFeedback] = useState<Feedback>();
  const [touchedWebsiteIds, setTouchedWebsiteIds] = useState<Record<string, boolean>>({});
  const [hasLoaded, setHasLoaded] = useState(false);
  const savedSnapshotRef = useRef(JSON.stringify(createEmptyDownloaderSettings()));

  useEffect(() => {
    const stored = getDownloaderSettings();
    savedSnapshotRef.current = JSON.stringify(stored);
    setDownloaders(stored);
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;

    const hasInvalidWebsite = socialPlatforms.some((platform) =>
      downloaders[platform.id].websites.some((website) => getUrlError(website.url)),
    );
    if (hasInvalidWebsite) return;

    const currentSnapshot = JSON.stringify(downloaders);
    if (currentSnapshot === savedSnapshotRef.current) return;

    const saveTimer = setTimeout(() => {
      try {
        const saved = saveDownloaderSettings(downloaders);
        const savedSnapshot = JSON.stringify(saved);
        savedSnapshotRef.current = savedSnapshot;
        if (savedSnapshot !== currentSnapshot) setDownloaders(saved);
        setTouchedWebsiteIds({});
        setFeedback({ tone: 'success', text: 'Changes saved automatically.' });
      } catch (error) {
        setFeedback({
          tone: 'error',
          text: error instanceof Error ? error.message : 'Could not save settings.',
        });
      }
    }, 400);

    return () => clearTimeout(saveTimer);
  }, [downloaders, hasLoaded]);

  const configuredCount = useMemo(
    () =>
      socialPlatforms.filter((platform) =>
        isPlatformConfigured(downloaders[platform.id]),
      ).length,
    [downloaders],
  );
  const progressWidth = `${Math.round((configuredCount / socialPlatforms.length) * 100)}%` as const;

  function updateDownloader(
    platformId: SocialPlatformId,
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

  function addDownloader(platformId: SocialPlatformId) {
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
    setExpandedPlatformId(platformId);
    setFeedback(undefined);
  }

  function removeDownloader(platformId: SocialPlatformId, websiteId: string) {
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

  function setDefaultDownloader(platformId: SocialPlatformId, websiteId: string) {
    setDownloaders((current) => ({
      ...current,
      [platformId]: { ...current[platformId], defaultWebsiteId: websiteId },
    }));
    setFeedback(undefined);
  }

  function clearAllWebsites() {
    try {
      const cleared = saveDownloaderSettings(createEmptyDownloaderSettings());
      savedSnapshotRef.current = JSON.stringify(cleared);
      setDownloaders(cleared);
      setTouchedWebsiteIds({});
      setExpandedPlatformId(null);
      setFeedback({ tone: 'success', text: 'All downloader websites cleared.' });
    } catch (error) {
      setFeedback({
        tone: 'error',
        text: error instanceof Error ? error.message : 'Could not clear settings.',
      });
    }
  }

  function handleClear() {
    const message =
      'This removes every saved downloader website from this device. Social links will not open until configured again.';

    if (process.env.EXPO_OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(`Clear all websites?\n\n${message}`)) {
        clearAllWebsites();
      }
      return;
    }

    Alert.alert(
      'Clear all websites?',
      message,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear all', style: 'destructive', onPress: clearAllWebsites },
      ],
      { cancelable: true },
    );
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
        paddingTop: spacing.xxl,
        paddingBottom: spacing.xxxl * 3,
        gap: spacing.xl,
      }}
    >
      <View style={{ gap: spacing.sm }}>
        <AppText variant="display">Downloader Settings</AppText>
        <AppText variant="body" style={{ color: colors.inkMuted }}>
          Choose a trusted website for each platform. Valid changes save automatically.
        </AppText>
      </View>

      <View
        accessibilityLabel={`${configuredCount} of ${socialPlatforms.length} platforms configured`}
        style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}
      >
        <AppText
          variant="bodyMedium"
          style={{ color: colors.accent, fontVariant: ['tabular-nums'] }}
        >
          {configuredCount} of {socialPlatforms.length} configured
        </AppText>
        <View
          style={{
            flex: 1,
            height: spacing.sm,
            overflow: 'hidden',
            borderRadius: radius.full,
            backgroundColor: colors.progressTrack,
          }}
        >
          <View
            style={{
              width: progressWidth,
              height: '100%',
              borderRadius: radius.full,
              backgroundColor: colors.accent,
            }}
          />
        </View>
      </View>

      <View style={{ gap: spacing.md }}>
        {socialPlatforms.map((platform) => {
          const setting = downloaders[platform.id];
          const isExpanded = expandedPlatformId === platform.id;
          const isConfigured = isPlatformConfigured(setting);
          const hasInvalidWebsite = setting.websites.some((website) => getUrlError(website.url));
          const status = isConfigured
            ? 'Configured'
            : hasInvalidWebsite
              ? 'Needs attention'
              : 'Not set';

          return (
            <SurfaceCard
              key={platform.id}
              style={{
                padding: 0,
                gap: 0,
                overflow: 'hidden',
                borderColor: isExpanded ? colors.accent : colors.borderSoft,
              }}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${platform.label}, ${status}`}
                accessibilityHint={`${isExpanded ? 'Collapse' : 'Expand'} downloader settings`}
                accessibilityState={{ expanded: isExpanded }}
                onPress={() =>
                  setExpandedPlatformId((current) =>
                    current === platform.id ? null : platform.id,
                  )
                }
                style={({ pressed }) => ({
                  minHeight: 76,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.md,
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.md,
                  backgroundColor: pressed ? colors.skySoft : colors.surface,
                })}
              >
                <View
                  accessible={false}
                  style={{
                    width: sizes.minimumTouch,
                    height: sizes.minimumTouch,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: radius.md,
                    backgroundColor: colors.transparent,
                  }}
                >
                  <Image
                    accessible={false}
                    accessibilityElementsHidden
                    contentFit="contain"
                    source={platformIcons[platform.id]}
                    style={{
                      width: 24,
                      height: 24,
                    }}
                  />
                </View>

                <View style={{ flex: 1, gap: spacing.xxs }}>
                  <AppText variant="headline">{platform.label}</AppText>
                  {setting.websites.length > 0 ? (
                    <AppText variant="caption">
                      {setting.websites.length}{' '}
                      {setting.websites.length === 1 ? 'website' : 'websites'}
                    </AppText>
                  ) : null}
                </View>

                <View
                  style={{
                    minHeight: 36,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing.xs,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs,
                    borderRadius: radius.full,
                    backgroundColor: isConfigured
                      ? colors.mintSoft
                      : hasInvalidWebsite
                        ? colors.skySoft
                        : colors.borderSoft,
                  }}
                >
                  <SymbolView
                    accessible={false}
                    aria-hidden={true}
                    name={
                      isConfigured
                        ? { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }
                        : {
                            ios: 'minus.circle',
                            android: 'remove_circle_outline',
                            web: 'remove_circle_outline',
                          }
                    }
                    size={16}
                    tintColor={
                      isConfigured
                        ? colors.success
                        : hasInvalidWebsite
                          ? colors.danger
                          : colors.inkMuted
                    }
                  />
                  <AppText
                    variant="caption"
                    style={{
                      color: isConfigured
                        ? colors.success
                        : hasInvalidWebsite
                          ? colors.danger
                          : colors.inkMuted,
                    }}
                  >
                    {status}
                  </AppText>
                </View>

                <View
                  style={{
                    width: 24,
                    minHeight: sizes.minimumTouch,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SymbolView
                    accessible={false}
                    aria-hidden={true}
                    name={
                      isExpanded
                        ? {
                            ios: 'chevron.up',
                            android: 'keyboard_arrow_up',
                            web: 'keyboard_arrow_up',
                          }
                        : {
                            ios: 'chevron.down',
                            android: 'keyboard_arrow_down',
                            web: 'keyboard_arrow_down',
                          }
                    }
                    size={22}
                    tintColor={colors.inkMuted}
                    style={{
                      width: 22,
                      height: 22,
                    }}
                  />
                </View>
              </Pressable>

              {isExpanded ? (
                <View
                  style={{
                    gap: spacing.md,
                    padding: spacing.lg,
                    borderTopWidth: 1,
                    borderTopColor: colors.borderSoft,
                    backgroundColor: colors.surface,
                  }}
                >
                  {setting.websites.map((website, index) => {
                    const isDefault = website.id === setting.defaultWebsiteId;
                    const fieldError = touchedWebsiteIds[website.id]
                      ? getUrlError(website.url)
                      : undefined;

                    return (
                      <View
                        key={website.id}
                        style={{
                          gap: spacing.sm,
                          paddingHorizontal: spacing.md,
                          paddingVertical: spacing.sm,
                          borderWidth: 1,
                          borderColor: fieldError
                            ? colors.danger
                            : isDefault
                              ? colors.accent
                              : colors.border,
                          borderRadius: radius.md,
                          borderCurve: 'continuous',
                          backgroundColor: colors.surface,
                        }}
                      >
                        <View
                          style={{
                            minHeight: sizes.input,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: spacing.sm,
                          }}
                        >
                          <View
                            accessible={false}
                            style={{
                              width: sizes.minimumTouch,
                              height: sizes.minimumTouch,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: radius.md,
                              backgroundColor: colors.skySoft,
                            }}
                          >
                            <SymbolView
                              accessible={false}
                              aria-hidden={true}
                              name={{ ios: 'globe', android: 'language', web: 'language' }}
                              size={24}
                              tintColor={colors.accent}
                            />
                          </View>

                          <TextInput
                            accessibilityLabel={`${platform.label} downloader website URL ${index + 1}`}
                            accessibilityHint="Enter a secure website address. You may include the URL placeholder."
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="url"
                            numberOfLines={1}
                            onBlur={() =>
                              setTouchedWebsiteIds((current) => ({
                                ...current,
                                [website.id]: true,
                              }))
                            }
                            onChangeText={(value) =>
                              updateDownloader(platform.id, website.id, value)
                            }
                            placeholder="https://trusted-downloader.example/"
                            placeholderTextColor={colors.inkFaint}
                            style={[
                              typography.body,
                              {
                                flex: 1,
                                minWidth: 0,
                                minHeight: sizes.minimumTouch,
                                color: colors.ink,
                                backgroundColor: colors.transparent,
                                paddingHorizontal: spacing.xs,
                                outlineStyle: 'solid',
                                outlineWidth: 0,
                              },
                            ]}
                            value={website.url}
                          />

                          <Pressable
                            accessibilityRole="radio"
                            accessibilityState={{ checked: isDefault }}
                            accessibilityLabel={`Use ${platform.label} website ${index + 1} by default`}
                            onPress={() => setDefaultDownloader(platform.id, website.id)}
                            style={({ pressed }) => ({
                              minHeight: sizes.minimumTouch,
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: spacing.sm,
                              paddingHorizontal: spacing.sm,
                              borderRadius: radius.md,
                              backgroundColor: pressed ? colors.accentSoft : colors.transparent,
                            })}
                          >
                            <AppText
                              variant="caption"
                              style={{ color: isDefault ? colors.accent : colors.inkMuted }}
                            >
                              {isDefault ? 'Default' : 'Set default'}
                            </AppText>
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
                          </Pressable>

                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Remove ${platform.label} website ${index + 1}`}
                            onPress={() => removeDownloader(platform.id, website.id)}
                            style={({ pressed }) => ({
                              width: sizes.minimumTouch,
                              minHeight: sizes.minimumTouch,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: radius.md,
                              backgroundColor: pressed ? colors.skySoft : colors.transparent,
                            })}
                          >
                            <SymbolView
                              accessible={false}
                              aria-hidden={true}
                              name={{ ios: 'trash', android: 'delete_outline', web: 'delete_outline' }}
                              size={20}
                              tintColor={colors.danger}
                            />
                          </Pressable>
                        </View>

                        {fieldError ? (
                          <AppText
                            accessibilityRole="alert"
                            variant="caption"
                            style={{ color: colors.danger }}
                          >
                            {fieldError}
                          </AppText>
                        ) : null}

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
                      borderColor: colors.accent,
                      borderRadius: radius.md,
                      backgroundColor: pressed ? colors.accentSoft : colors.surface,
                    })}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                      <SymbolView
                        accessible={false}
                        aria-hidden={true}
                        name={{ ios: 'plus', android: 'add', web: 'add' }}
                        size={22}
                        tintColor={colors.accent}
                      />
                      <AppText variant="bodyMedium" style={{ color: colors.accent }}>
                        {setting.websites.length === 0
                          ? 'Add downloader website'
                          : 'Add another website'}
                      </AppText>
                    </View>
                  </Pressable>
                </View>
              ) : null}
            </SurfaceCard>
          );
        })}
      </View>

      {feedback ? (
        <AppText
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          variant="bodyMedium"
          style={{ color: feedback.tone === 'success' ? colors.success : colors.danger }}
        >
          {feedback.text}
        </AppText>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Clear all downloader websites"
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

    </ScrollView>
  );
}
