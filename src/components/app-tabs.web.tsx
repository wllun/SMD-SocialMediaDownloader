import {
  TabList,
  TabSlot,
  Tabs,
  TabTrigger,
  type TabTriggerSlotProps,
} from 'expo-router/ui';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { colors, radius, shadows, spacing } from '@/theme';

function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable
      {...props}
      style={({ pressed }) => ({
        minHeight: 44,
        minWidth: 88,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: radius.full,
        backgroundColor: isFocused ? colors.accentSoft : colors.transparent,
        opacity: pressed ? 0.65 : 1,
      })}
    >
      <AppText
        variant="caption"
        style={{ color: isFocused ? colors.accent : colors.inkMuted }}
      >
        {children}
      </AppText>
    </Pressable>
  );
}

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <View
          style={{
            position: 'absolute',
            bottom: spacing.lg,
            alignSelf: 'center',
            flexDirection: 'row',
            gap: spacing.sm,
            padding: spacing.sm,
            backgroundColor: colors.surface,
            borderRadius: radius.full,
            borderWidth: 1,
            borderColor: colors.borderSoft,
            boxShadow: shadows.raised,
          }}
        >
          <TabTrigger name="home" href="/" asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>
          <TabTrigger name="queue" href="/queue" asChild>
            <TabButton>Queue</TabButton>
          </TabTrigger>
          <TabTrigger name="settings" href="/settings" asChild>
            <TabButton>Settings</TabButton>
          </TabTrigger>
        </View>
      </TabList>
    </Tabs>
  );
}
