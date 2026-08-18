import type { DownloadMedia } from './download-media.types';

function getFileName(url: string, disposition: string | null) {
  const dispositionMatch = disposition?.match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)/i);
  const candidate = dispositionMatch?.[1] || new URL(url).pathname.split('/').pop() || 'media';
  return decodeURIComponent(candidate).replace(/[^a-zA-Z0-9._-]/g, '_');
}

export const downloadMedia: DownloadMedia = async (url, onProgress) => {
  onProgress(5);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`The media server returned HTTP ${response.status}.`);
  }

  const blob = await response.blob();
  const fileName = getFileName(url, response.headers.get('content-disposition'));
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
  onProgress(100);

  return { fileName, savedTo: 'browser' };
};

