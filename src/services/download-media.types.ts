export type DownloadProgressCallback = (progress: number) => void;

export type DownloadResult = {
  fileName: string;
  savedTo: 'browser' | 'device-library' | 'share-sheet';
};

export type DownloadMedia = (
  url: string,
  onProgress: DownloadProgressCallback,
) => Promise<DownloadResult>;

