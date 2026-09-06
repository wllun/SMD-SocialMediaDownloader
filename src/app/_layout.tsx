import { DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';

import { DownloadQueueProvider } from '@/providers/download-queue-provider';
import { colors } from '@/theme';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    primary: colors.accent,
    text: colors.ink,
    border: colors.border,
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={navigationTheme}>
      <DownloadQueueProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: colors.background },
            headerBackButtonDisplayMode: 'minimal',
            headerShadowVisible: false,
            headerTintColor: colors.accent,
            headerTitleStyle: { color: colors.ink },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="downloader"
            options={{
              presentation: 'modal',
              title: 'Downloader',
            }}
          />
        </Stack>
      </DownloadQueueProvider>
    </ThemeProvider>
  );
}
