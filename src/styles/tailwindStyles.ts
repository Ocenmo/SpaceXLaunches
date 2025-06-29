import { StyleSheet } from 'react-native';

// Colores basados en Tailwind CSS
export const colors = {
  // Grays
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',

  // Blues
  blue50: '#eff6ff',
  blue100: '#dbeafe',
  blue200: '#bfdbfe',
  blue300: '#93c5fd',
  blue400: '#60a5fa',
  blue500: '#3b82f6',
  blue600: '#2563eb',
  blue700: '#1d4ed8',
  blue800: '#1e40af',
  blue900: '#1e3a8a',

  // Reds
  red50: '#fef2f2',
  red100: '#fee2e2',
  red200: '#fecaca',
  red300: '#fca5a5',
  red400: '#f87171',
  red500: '#ef4444',
  red600: '#dc2626',
  red700: '#b91c1c',
  red800: '#991b1b',
  red900: '#7f1d1d',

  // Greens
  green50: '#f0fdf4',
  green100: '#dcfce7',
  green200: '#bbf7d0',
  green300: '#86efac',
  green400: '#4ade80',
  green500: '#22c55e',
  green600: '#16a34a',
  green700: '#15803d',
  green800: '#166534',
  green900: '#14532d',

  // Others
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
};

// Espaciado basado en Tailwind CSS (en px)
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
};

// Tamaños de fuente basados en Tailwind CSS
export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

// Border radius
export const borderRadius = {
  none: 0,
  sm: 2,
  base: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
};

// Estilos comunes que imitan Tailwind
export const commonStyles = StyleSheet.create({
  // Layout
  flex1: { flex: 1 },
  flexRow: { flexDirection: 'row' },
  flexCol: { flexDirection: 'column' },
  itemsCenter: { alignItems: 'center' },
  itemsStart: { alignItems: 'flex-start' },
  itemsEnd: { alignItems: 'flex-end' },
  justifyCenter: { justifyContent: 'center' },
  justifyBetween: { justifyContent: 'space-between' },
  justifyAround: { justifyContent: 'space-around' },
  selfStart: { alignSelf: 'flex-start' },
  selfCenter: { alignSelf: 'center' },
  selfEnd: { alignSelf: 'flex-end' },

  // Background colors
  bgWhite: { backgroundColor: colors.white },
  bgGray100: { backgroundColor: colors.gray100 },
  bgGray200: { backgroundColor: colors.gray200 },
  bgGray800: { backgroundColor: colors.gray800 },
  bgBlue500: { backgroundColor: colors.blue500 },
  bgRed500: { backgroundColor: colors.red500 },
  bgGreen500: { backgroundColor: colors.green500 },

  // Text colors
  textWhite: { color: colors.white },
  textBlack: { color: colors.black },
  textGray600: { color: colors.gray600 },
  textGray800: { color: colors.gray800 },
  textBlue600: { color: colors.blue600 },

  // Font weights
  fontNormal: { fontWeight: 'normal' },
  fontMedium: { fontWeight: '500' },
  fontSemibold: { fontWeight: '600' },
  fontBold: { fontWeight: 'bold' },

  // Font sizes
  textXs: { fontSize: fontSize.xs },
  textSm: { fontSize: fontSize.sm },
  textBase: { fontSize: fontSize.base },
  textLg: { fontSize: fontSize.lg },
  textXl: { fontSize: fontSize.xl },
  text2xl: { fontSize: fontSize['2xl'] },

  // Text alignment
  textCenter: { textAlign: 'center' },
  textLeft: { textAlign: 'left' },
  textRight: { textAlign: 'right' },

  // Padding
  p1: { padding: spacing[1] },
  p2: { padding: spacing[2] },
  p3: { padding: spacing[3] },
  p4: { padding: spacing[4] },
  p6: { padding: spacing[6] },
  px2: { paddingHorizontal: spacing[2] },
  px4: { paddingHorizontal: spacing[4] },
  py2: { paddingVertical: spacing[2] },
  py4: { paddingVertical: spacing[4] },
  pb4: { paddingBottom: spacing[4] },

  // Margin
  m1: { margin: spacing[1] },
  m2: { margin: spacing[2] },
  m4: { margin: spacing[4] },
  mx2: { marginHorizontal: spacing[2] },
  my2: { marginVertical: spacing[2] },
  mt1: { marginTop: spacing[1] },
  mt2: { marginTop: spacing[2] },
  mt4: { marginTop: spacing[4] },
  mb2: { marginBottom: spacing[2] },
  mb4: { marginBottom: spacing[4] },

  // Border radius
  rounded: { borderRadius: borderRadius.base },
  roundedLg: { borderRadius: borderRadius.lg },
  roundedFull: { borderRadius: borderRadius.full },

  // Border
  border: { borderWidth: 1 },
  borderGray200: { borderColor: colors.gray200 },

  // Shadow (similar a shadow-lg de Tailwind)
  shadowLg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  // Dimensiones
  w12: { width: 48 },
  h12: { height: 48 },
  wFull: { width: '100%' },
  hFull: { height: '100%' },
});

// Función helper para combinar estilos
export const combineStyles = (...styles: any[]) => {
  return StyleSheet.flatten(styles);
};
