import { Tabs } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { colors, radius, shadows, sizes, spacing } from '@/theme';

const tabLabels: Record<string, string> = {
  index: 'Home',
  queue: 'Queue',
  settings: 'Settings',
};

const tabButtonHeight = process.env.EXPO_OS === 'android' ? 48 : sizes.minimumTouch;

export default function AppTabs() {
  return (
    <Tabs
      initialRouteName="index"
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarHideOnKeyboard: false,
      }}
      tabBar={({ state, descriptors, navigation, insets }) => (
        <View
          style={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.sm,
            paddingBottom: Math.max(insets.bottom, spacing.md),
            backgroundColor: colors.background,
          }}
        >
          <View
            style={{
              width: '100%',
              maxWidth: 296,
              minHeight: 60,
              alignSelf: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.sm,
              padding: spacing.sm,
              backgroundColor: colors.surface,
              borderColor: colors.borderSoft,
              borderWidth: 1,
              borderRadius: radius.full,
              borderCurve: 'continuous',
              boxShadow: shadows.raised,
            }}
          >
            {state.routes.map((route, index) => {
              const isFocused = state.index === index;
              const label = tabLabels[route.name] ?? route.name;
              const options = descriptors[route.key].options;

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              };

              return (
                <Pressable
                  key={route.key}
                  accessibilityRole="tab"
                  accessibilityLabel={options.tabBarAccessibilityLabel ?? `${label} tab`}
                  accessibilityState={{ selected: isFocused }}
                  onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
                  onPress={onPress}
                  style={({ pressed }) => ({
                    minWidth: 0,
                    minHeight: tabButtonHeight,
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: radius.full,
                    backgroundColor: isFocused ? colors.accentSoft : colors.transparent,
                    opacity: pressed ? 0.65 : 1,
                  })}
                >
                  <AppText
                    variant="caption"
                    style={{ color: isFocused ? colors.accent : colors.inkMuted }}
                  >
                    {label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarAccessibilityLabel: 'Home tab',
        }}
      />

      <Tabs.Screen
        name="queue"
        options={{
          title: 'Queue',
          tabBarAccessibilityLabel: 'Download queue tab',
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarAccessibilityLabel: 'Settings tab',
        }}
      />
    </Tabs>
  );
}
