import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { colors } from '@/theme';

export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor={colors.surface}
      indicatorColor={colors.accentSoft}
      tintColor={colors.accent}
      labelStyle={{
        default: { color: colors.inkMuted },
        selected: { color: colors.accent },
      }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'house', selected: 'house.fill' }}
          md={{ default: 'home', selected: 'home' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="library">
        <NativeTabs.Trigger.Label>Library</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'folder', selected: 'folder.fill' }}
          md={{ default: 'folder', selected: 'folder' }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'gearshape', selected: 'gearshape.fill' }}
          md={{ default: 'settings', selected: 'settings' }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
