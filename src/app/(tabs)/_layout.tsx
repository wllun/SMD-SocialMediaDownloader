import AppTabs from '@/components/app-tabs';
import { DownloadQueueProvider } from '@/providers/download-queue-provider';

export default function TabsLayout() {
  return (
    <DownloadQueueProvider>
      <AppTabs />
    </DownloadQueueProvider>
  );
}

