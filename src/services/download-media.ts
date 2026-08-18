import { File, Paths } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

import type { DownloadMedia } from './download-media.types';

const libraryExtensions = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'mov', 'm4v']);

function getFileName(url: string) {
  const parsed = new URL(url);
  const originalName = decodeURIComponent(parsed.pathname.split('/').pop() || 'media');
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${Date.now()}-${safeName}`;
}

function getExtension(fileName: string) {
  return fileName.split('.').pop()?.toLowerCase() ?? '';
}

export const downloadMedia: DownloadMedia = async (url, onProgress) => {
  const fileName = getFileName(url);
  const destination = new File(Paths.cache, fileName);
  const task = File.createDownloadTask(url, destination, {
    onProgress: ({ bytesWritten, totalBytes }) => {
      if (totalBytes > 0) {
        onProgress(Math.max(1, Math.min(99, Math.round((bytesWritten / totalBytes) * 100))));
      }
    },
  });

  const file = await task.downloadAsync();
  if (!file) throw new Error('The download was interrupted.');

  onProgress(100);

  if (libraryExtensions.has(getExtension(fileName))) {
    const permission = await MediaLibrary.requestPermissionsAsync(true, ['photo', 'video']);
    if (permission.granted) {
      await MediaLibrary.saveToLibraryAsync(file.uri);
      return { fileName, savedTo: 'device-library' };
    }
  }

  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('The file downloaded, but this device cannot open a save dialog.');
  }

  await Sharing.shareAsync(file.uri, { dialogTitle: `Save ${fileName}` });
  return { fileName, savedTo: 'share-sheet' };
};

