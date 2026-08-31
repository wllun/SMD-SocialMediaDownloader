export type SocialPlatformId =
  | 'instagram'
  | 'tiktok'
  | 'facebook'
  | 'xhs'
  | 'x'
  | 'douyin';

export type DownloaderWebsite = {
  id: string;
  url: string;
};

export type PlatformDownloaderSettings = {
  websites: DownloaderWebsite[];
  defaultWebsiteId?: string;
};

export type DownloaderSettings = Record<SocialPlatformId, PlatformDownloaderSettings>;

export type SocialPlatform = {
  id: SocialPlatformId;
  label: string;
  hosts: readonly string[];
};

export const socialPlatforms: readonly SocialPlatform[] = [
  { id: 'instagram', label: 'Instagram', hosts: ['instagram.com'] },
  { id: 'tiktok', label: 'TikTok', hosts: ['tiktok.com'] },
  { id: 'facebook', label: 'Facebook', hosts: ['facebook.com', 'fb.watch', 'fb.com'] },
  { id: 'xhs', label: 'XHS / Xiaohongshu', hosts: ['xiaohongshu.com', 'xhslink.com'] },
  { id: 'x', label: 'X / Twitter', hosts: ['x.com', 'twitter.com'] },
  { id: 'douyin', label: 'Douyin', hosts: ['douyin.com', 'iesdouyin.com'] },
] as const;

export const emptyDownloaderSettings: DownloaderSettings = {
  instagram: { websites: [] },
  tiktok: { websites: [] },
  facebook: { websites: [] },
  xhs: { websites: [] },
  x: { websites: [] },
  douyin: { websites: [] },
};

export function createEmptyDownloaderSettings(): DownloaderSettings {
  return {
    instagram: { websites: [] },
    tiktok: { websites: [] },
    facebook: { websites: [] },
    xhs: { websites: [] },
    x: { websites: [] },
    douyin: { websites: [] },
  };
}

function matchesHost(hostname: string, allowedHost: string) {
  return hostname === allowedHost || hostname.endsWith(`.${allowedHost}`);
}

export function detectSocialPlatform(value: string): SocialPlatform | undefined {
  try {
    const url = new URL(value.trim());
    if (!['https:', 'http:'].includes(url.protocol)) return undefined;
    const hostname = url.hostname.toLowerCase();
    return socialPlatforms.find((platform) =>
      platform.hosts.some((host) => matchesHost(hostname, host)),
    );
  } catch {
    return undefined;
  }
}

export function validateDownloaderSettings(settings: DownloaderSettings) {
  for (const platform of socialPlatforms) {
    const setting = settings[platform.id];
    if (setting.websites.length > 0 && !setting.websites.some(({ id }) => id === setting.defaultWebsiteId)) {
      throw new Error(`Choose a default downloader for ${platform.label}.`);
    }

    for (const website of setting.websites) {
      let url;
      try {
        url = new URL(website.url.replace('{url}', 'https%3A%2F%2Fexample.com%2Fpost'));
      } catch {
        throw new Error(`${platform.label} downloader URL is invalid.`);
      }
      if (url.protocol !== 'https:') {
        throw new Error(`${platform.label} downloader must use HTTPS.`);
      }
    }
  }
}

export function getDefaultDownloaderUrl(setting: PlatformDownloaderSettings) {
  return setting.websites.find(({ id }) => id === setting.defaultWebsiteId)?.url;
}

export function buildDownloaderUrl(template: string, postUrl: string) {
  const value = template.includes('{url}')
    ? template.replaceAll('{url}', encodeURIComponent(postUrl))
    : template;
  const url = new URL(value);
  if (url.protocol !== 'https:') throw new Error('Downloader website must use HTTPS.');
  return url.toString();
}

