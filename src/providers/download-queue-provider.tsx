import { createContext, use, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { Alert } from 'react-native';

import { downloadMedia } from '@/services/download-media';
import { readSetting, writeSetting } from '@/services/settings-storage';

const storageKey = 'smd.download-queue.v1';

export type DownloadQueueItem = {
  id: string;
  title: string;
  meta: string;
  url: string;
  status: 'downloading' | 'failed';
  error?: string;
  progress?: number;
};

type DownloadQueueValue = {
  downloads: DownloadQueueItem[];
  isDownloading: boolean;
  removeDownload: (id: string) => void;
  runDirectDownload: (url: string, existingId?: string) => Promise<boolean>;
};

const DownloadQueueContext = createContext<DownloadQueueValue | null>(null);

function isDownloadQueueItem(value: unknown): value is DownloadQueueItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<DownloadQueueItem>;
  return (
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    typeof item.meta === 'string' &&
    typeof item.url === 'string' &&
    item.status === 'failed'
  );
}

function readDownloadQueue() {
  try {
    const saved = readSetting(storageKey);
    if (!saved) return [];
    const parsed: unknown = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.filter(isDownloadQueueItem) : [];
  } catch {
    return [];
  }
}

function getDownloadError(error: unknown) {
  const rawMessage = error instanceof Error ? error.message : 'The download failed.';
  return rawMessage.includes('Network request failed') || rawMessage.includes('Failed to fetch')
    ? 'Could not reach that file. On web, the source must allow cross-origin downloads.'
    : rawMessage;
}

export function DownloadQueueProvider({ children }: PropsWithChildren) {
  const [downloads, setDownloads] = useState<DownloadQueueItem[]>(readDownloadQueue);
  const [isDownloading, setIsDownloading] = useState(false);
  const failedDownloadsSnapshot = useMemo(
    () => JSON.stringify(downloads.filter((item) => item.status === 'failed')),
    [downloads],
  );

  useEffect(() => {
    try {
      writeSetting(storageKey, failedDownloadsSnapshot);
    } catch {
      // The Queue still works for this session when local storage is unavailable.
    }
  }, [failedDownloadsSnapshot]);

  async function runDirectDownload(downloadUrl: string, existingId?: string) {
    const hostname = new URL(downloadUrl).hostname.replace(/^www\./, '');
    const id = existingId ?? String(Date.now());
    const pendingItem: DownloadQueueItem = {
      id,
      title: `Media from ${hostname}`,
      meta: 'Direct file',
      url: downloadUrl,
      status: 'downloading',
      progress: 0,
    };

    setIsDownloading(true);
    setDownloads((current) =>
      existingId
        ? current.map((item) => (item.id === id ? pendingItem : item))
        : [pendingItem, ...current],
    );

    try {
      const result = await downloadMedia(downloadUrl, (progress) => {
        setDownloads((current) =>
          current.map((item) => (item.id === id ? { ...item, progress } : item)),
        );
      });

      const location =
        result.savedTo === 'device-library'
          ? 'Saved to your device library'
          : result.savedTo === 'browser'
            ? 'Saved by your browser'
            : 'Opened the device save menu';

      setDownloads((current) => current.filter((item) => item.id !== id));
      Alert.alert('Download complete', location);
      return true;
    } catch (error) {
      setDownloads((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                error: getDownloadError(error),
                progress: undefined,
                status: 'failed',
              }
            : item,
        ),
      );
      return false;
    } finally {
      setIsDownloading(false);
    }
  }

  const value = useMemo<DownloadQueueValue>(
    () => ({
      downloads,
      isDownloading,
      removeDownload: (id) =>
        setDownloads((current) => current.filter((item) => item.id !== id)),
      runDirectDownload,
    }),
    [downloads, isDownloading],
  );

  return <DownloadQueueContext.Provider value={value}>{children}</DownloadQueueContext.Provider>;
}

export function useDownloadQueue() {
  const value = use(DownloadQueueContext);
  if (!value) throw new Error('useDownloadQueue must be used inside DownloadQueueProvider.');
  return value;
}
