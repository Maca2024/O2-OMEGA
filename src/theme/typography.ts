import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const Typography = {
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
    fontFamily,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const,
    fontFamily,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
    fontFamily,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
    fontFamily,
  },
  bodyBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
    fontFamily,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
    fontFamily,
  },
  timer: {
    fontSize: 64,
    lineHeight: 72,
    fontWeight: '300' as const,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
  },
  timerSmall: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '300' as const,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
    fontFamily,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
} as const;
