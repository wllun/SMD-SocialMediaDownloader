import 'expo-sqlite/localStorage/install';

import {
  emptyDownloaderSettings,
  socialPlatforms,
  validateDownloaderSettings,
  type DownloaderSettings,
} from './social-platforms';

export {
  buildDownloaderUrl,
  detectSocialPlatform,
  emptyDownloaderSettings,
  socialPlatforms,
  validateDownloaderSettings,
} from './social-platforms';
export type { DownloaderSettings, SocialPlatform, SocialPlatformId } from './social-platforms';

const storageKey = 'smd.downloader-settings.v1';

export function getDownloaderSettings(): DownloaderSettings {
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return { ...emptyDownloaderSettings };
    return { ...emptyDownloaderSettings, ...JSON.parse(stored) };
  } catch {
    return { ...emptyDownloaderSettings };
  }
}

export function saveDownloaderSettings(settings: DownloaderSettings) {
  const trimmed = Object.fromEntries(
    socialPlatforms.map((platform) => [platform.id, settings[platform.id].trim()]),
  ) as DownloaderSettings;
  validateDownloaderSettings(trimmed);
  localStorage.setItem(storageKey, JSON.stringify(trimmed));
  return trimmed;
}
