import { View } from 'react-native';

import { AppText } from '@/components/app-text';
import { colors, radius, sizes, spacing } from '@/theme';

export function SourceChip({ symbol, label }: { symbol: string; label: string }) {
  return (
    <View style={{ alignItems: 'center', gap: spacing.sm, flex: 1 }}>
      <View
        style={{
          width: sizes.sourceChip,
          height: sizes.sourceChip,
          borderRadius: radius.lg,
          borderCurve: 'continuous',
          backgroundColor: colors.mintSoft,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AppText variant="glyph">{symbol}</AppText>
      </View>
      <AppText variant="caption">{label}</AppText>
    </View>
  );
}
