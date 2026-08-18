import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { colors, radius, shadows, spacing } from '@/theme';

export function SurfaceCard({
  style,
  ...props
}: ViewProps & { style?: StyleProp<ViewStyle> }) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderColor: colors.borderSoft,
          borderWidth: 1,
          borderRadius: radius.lg,
          borderCurve: 'continuous',
          boxShadow: shadows.card,
          padding: spacing.lg,
        },
        style,
      ]}
      {...props}
    />
  );
}
