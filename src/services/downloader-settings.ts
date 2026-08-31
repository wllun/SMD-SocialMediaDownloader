import {
  createEmptyDownloaderSettings,
  socialPlatforms,
  validateDownloaderSettings,
  type DownloaderSettings,
} from './social-platforms';
import { readSetting, writeSetting } from './settings-storage';

export {
  buildDownloaderUrl,
  detectSocialPlatform,
  emptyDownloaderSettings,
  createEmptyDownloaderSettings,
  getDefaultDownloaderUrl,
  socialPlatforms,
  validateDownloaderSettings,
} from './social-platforms';
export type {
  DownloaderSettings,
  DownloaderWebsite,
  PlatformDownloaderSettings,
  SocialPlatform,
  SocialPlatformId,
} from './social-platforms';

const storageKey = 'smd.downloader-settings.v2';
const legacyStorageKey = 'smd.downloader-settings.v1';

function websiteId(platformId: string, index: number) {
  return `${platformId}-${index + 1}`;
}

export function getDownloaderSettings(): DownloaderSettings {
  try {
    const stored = readSetting(storageKey);
    if (stored) return { ...createEmptyDownloaderSettings(), ...JSON.parse(stored) };

    const legacyStored = readSetting(legacyStorageKey);
    if (!legacyStored) return createEmptyDownloaderSettings();
    const legacy = JSON.parse(legacyStored) as Partial<Record<string, string>>;
    return Object.fromEntries(
      socialPlatforms.map((platform) => {
        const url = legacy[platform.id]?.trim();
        const id = websiteId(platform.id, 0);
        return [platform.id, url ? { websites: [{ id, url }], defaultWebsiteId: id } : { websites: [] }];
      }),
    ) as DownloaderSettings;
  } catch {
    return createEmptyDownloaderSettings();
  }
}

export function saveDownloaderSettings(settings: DownloaderSettings) {
  const trimmed = Object.fromEntries(socialPlatforms.map((platform) => {
    const setting = settings[platform.id];
    const websites = setting.websites
      .map((website) => ({ ...website, url: website.url.trim() }))
      .filter((website) => website.url.length > 0);
    const defaultWebsiteId = websites.some(({ id }) => id === setting.defaultWebsiteId)
      ? setting.defaultWebsiteId
      : websites[0]?.id;
    return [platform.id, {
      websites,
      defaultWebsiteId,
    }];
  })) as DownloaderSettings;
  validateDownloaderSettings(trimmed);
  writeSetting(storageKey, JSON.stringify(trimmed));
  return trimmed;
}
