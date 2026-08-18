import type { TextStyle } from 'react-native';

export const colors = {
  background: '#FBFCFE',
  surface: '#FFFFFF',
  ink: '#0B1730',
  inkMuted: '#748099',
  inkFaint: '#98A2B3',
  accent: '#0798C7',
  accentPressed: '#087FA6',
  accentSoft: '#E7F7FB',
  mintSoft: '#EAF9F6',
  skySoft: '#EDF7FD',
  border: '#DDE4EC',
  borderSoft: '#EDF1F5',
  progressTrack: '#E8EEF3',
  success: '#0D9F79',
  danger: '#D14343',
  white: '#FFFFFF',
  transparent: 'transparent',
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 26,
  full: 9999,
} as const;

export const typography = {
  brand: { fontSize: 42, fontWeight: '800', letterSpacing: -1.5, color: colors.accent },
  display: { fontSize: 32, lineHeight: 38, fontWeight: '800', letterSpacing: -0.8, color: colors.ink },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '700', letterSpacing: -0.4, color: colors.ink },
  section: { fontSize: 20, lineHeight: 25, fontWeight: '700', color: colors.ink },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: '700', color: colors.ink },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '400', color: colors.ink },
  bodyMedium: { fontSize: 16, lineHeight: 22, fontWeight: '600', color: colors.ink },
  subhead: { fontSize: 14, lineHeight: 20, fontWeight: '400', color: colors.inkMuted },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500', color: colors.inkMuted },
  button: { fontSize: 18, lineHeight: 24, fontWeight: '700', color: colors.white },
  glyph: { fontSize: 20, lineHeight: 24, fontWeight: '700', color: colors.accent },
  glyphLarge: { fontSize: 26, lineHeight: 30, fontWeight: '700', color: colors.accent },
} as const satisfies Record<string, TextStyle>;

export const sizes = {
  minimumTouch: 44,
  input: 60,
  button: 60,
  sourceChip: 56,
  thumbnail: 76,
  progress: 6,
  maxContent: 680,
} as const;

export const shadows = {
  card: '0 4px 18px rgba(22, 47, 72, 0.06)',
  raised: '0 10px 28px rgba(0, 139, 184, 0.20)',
} as const;
