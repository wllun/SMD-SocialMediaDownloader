import { Text, type TextProps } from 'react-native';

import { typography } from '@/theme';

export type AppTextVariant = keyof typeof typography;

export function AppText({
  variant = 'body',
  style,
  ...props
}: TextProps & { variant?: AppTextVariant }) {
  return <Text selectable style={[typography[variant], style]} {...props} />;
}
