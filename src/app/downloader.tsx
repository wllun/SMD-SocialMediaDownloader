import { Stack, useLocalSearchParams } from 'expo-router';

import { DownloaderScreen } from '@/screens/downloader';

export default function DownloaderRoute() {
  const { platform, url } = useLocalSearchParams<{ platform?: string; url?: string }>();
  const title = platform ? `${platform} Downloader` : 'Downloader';

  return (
    <>
      <Stack.Screen options={{ title }} />
      <DownloaderScreen platform={platform} url={url} />
    </>
  );
}

