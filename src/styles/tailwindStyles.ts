/**
 * Sistema de estilos inspirado en Tailwind CSS para React Native
 *
 * Este archivo proporciona un sistema de design consistente basado en las convenciones
 * de Tailwind CSS, adaptado para React Native. La idea es mantener coherencia visual
 * en toda la aplicación y facilitar el desarrollo con estilos predefinidos.
 *
 * Beneficios de este enfoque:
 * - Consistencia en colores, espaciado y tipografía
 * - Desarrollo más rápido con estilos reutilizables
 * - Fácil mantenimiento y actualización del tema
 * - Familiar para desarrolladores que conocen Tailwind CSS
 *
 * Estructura:
 * 1. Paleta de colores completa
 * 2. Sistema de espaciado
 * 3. Tipografía y tamaños de fuente
 * 4. Estilos comunes para componentes
 */

import { StyleSheet } from 'react-native';

// ===== PALETA DE COLORES =====
// Colores exactos de Tailwind CSS para mantener consistencia con diseños web
export const colors = {
  // Escala de grises - fundamentales para la interfaz
  gray50: '#f9fafb',    // Backgrounds muy claros
  gray100: '#f3f4f6',   // Backgrounds de secciones
  gray200: '#e5e7eb',   // Bordes sutiles
  gray300: '#d1d5db',   // Bordes visibles
  gray400: '#9ca3af',   // Texto deshabilitado
  gray500: '#6b7280',   // Texto secundario
  gray600: '#4b5563',   // Texto principal claro
  gray700: '#374151',   // Texto principal
  gray800: '#1f2937',   // Texto enfatizado
  gray900: '#111827',   // Texto muy enfatizado

  // Azules - para acciones primarias y enlaces
  blue50: '#eff6ff',    // Background hover azul muy sutil
  blue100: '#dbeafe',   // Background azul claro
  blue200: '#bfdbfe',   // Bordes azul claro
  blue300: '#93c5fd',   // Botones secundarios
  blue400: '#60a5fa',   // Hover de botones primarios
  blue500: '#3b82f6',   // Botones primarios (color principal de la app)
  blue600: '#2563eb',   // Botones primarios pressed
  blue700: '#1d4ed8',   // Enlaces importantes
  blue800: '#1e40af',   // Texto azul oscuro
  blue900: '#1e3a8a',   // Texto azul muy oscuro

  // Rojos - para errores, fallos y acciones destructivas
  red50: '#fef2f2',     // Background de errores muy sutil
  red100: '#fee2e2',    // Background de errores
  red200: '#fecaca',    // Bordes de error
  red300: '#fca5a5',    // Texto de error claro
  red400: '#f87171',    // Iconos de error
  red500: '#ef4444',    // Errores principales
  red600: '#dc2626',    // Botones de eliminar
  red700: '#b91c1c',    // Errores importantes
  red800: '#991b1b',    // Texto de error oscuro
  red900: '#7f1d1d',    // Errores críticos

  // Verdes - para éxito, lanzamientos exitosos
  green50: '#f0fdf4',   // Background de éxito muy sutil
  green100: '#dcfce7',  // Background de éxito
  green200: '#bbf7d0',  // Bordes de éxito
  green300: '#86efac',  // Texto de éxito claro
  green400: '#4ade80',  // Iconos de éxito
  green500: '#22c55e',  // Éxito principal
  green600: '#16a34a',  // Botones de confirmación
  green700: '#15803d',  // Éxito importante
  green800: '#166534',  // Texto de éxito oscuro
  green900: '#14532d',  // Éxito enfatizado

  // Colores base esenciales
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
};

// ===== SISTEMA DE ESPACIADO =====
// Sistema de espaciado de 4px como unidad base (multiplos de 4 para alineación pixel-perfect)
export const spacing = {
  0: 0,      // Sin espaciado
  1: 4,      // Espaciado mínimo para separaciones sutiles
  2: 8,      // Espaciado pequeño para elementos relacionados
  3: 12,     // Espaciado medio para separar grupos pequeños
  4: 16,     // Espaciado estándar (más usado)
  5: 20,     // Espaciado grande para separar secciones relacionadas
  6: 24,     // Espaciado extra para separar secciones
  7: 28,     // Espaciado grande
  8: 32,     // Espaciado muy grande para separar secciones importantes
  10: 40,    // Espaciado extra grande
  12: 48,    // Espaciado masivo para separar secciones principales
  16: 64,    // Espaciado enorme
  20: 80,    // Espaciado gigante
  24: 96,    // Para headers grandes
  32: 128,   // Para espacios muy grandes
};

// ===== SISTEMA TIPOGRÁFICO =====
// Tamaños de fuente que escalan bien en diferentes dispositivos
export const fontSize = {
  xs: 12,    // Texto muy pequeño (metadatos, badges)
  sm: 14,    // Texto pequeño (labels, texto secundario)
  base: 16,  // Tamaño base para lectura (texto principal)
  lg: 18,    // Texto grande (subtítulos)
  xl: 20,    // Texto extra grande (títulos de sección)
  '2xl': 24, // Títulos importantes
  '3xl': 30, // Títulos de pantalla
  '4xl': 36, // Títulos principales
  '5xl': 48, // Títulos hero/landing
};

// ===== BORDER RADIUS =====
// Sistema de bordes redondeados para diferentes elementos
export const borderRadius = {
  none: 0,     // Sin redondeo
  sm: 2,       // Redondeo muy sutil
  base: 4,     // Redondeo estándar para botones y cards
  md: 6,       // Redondeo medio
  lg: 8,       // Redondeo grande para elementos importantes
  xl: 12,      // Redondeo extra grande
  '2xl': 16,   // Redondeo muy grande
  '3xl': 24,   // Redondeo masivo
  full: 9999,  // Completamente redondo (círculos, pills)
};

// ===== ESTILOS COMUNES REUTILIZABLES =====
// Estilos predefinidos que imitan las clases utility de Tailwind CSS
export const commonStyles = StyleSheet.create({
  // ===== LAYOUT Y FLEXBOX =====
  // Contenedores flexibles básicos
  flex1: { flex: 1 },                              // Ocupa todo el espacio disponible
  flexRow: { flexDirection: 'row' },               // Elementos en fila horizontal
  flexCol: { flexDirection: 'column' },            // Elementos en columna vertical (default)

  // Alineación de elementos (align-items)
  itemsCenter: { alignItems: 'center' },           // Centrar elementos en el eje transversal
  itemsStart: { alignItems: 'flex-start' },        // Alinear al inicio
  itemsEnd: { alignItems: 'flex-end' },            // Alinear al final

  // Justificación de contenido (justify-content)
  justifyCenter: { justifyContent: 'center' },     // Centrar en el eje principal
  justifyBetween: { justifyContent: 'space-between' }, // Espacio entre elementos
  justifyAround: { justifyContent: 'space-around' },   // Espacio alrededor de elementos

  // Auto-alineación de elementos individuales
  selfStart: { alignSelf: 'flex-start' },          // Auto-alinear al inicio
  selfCenter: { alignSelf: 'center' },             // Auto-alinear al centro
  selfEnd: { alignSelf: 'flex-end' },              // Auto-alinear al final

  // ===== COLORES DE FONDO =====
  // Fondos básicos más utilizados en la aplicación
  bgWhite: { backgroundColor: colors.white },      // Fondo blanco para cards y modales
  bgGray100: { backgroundColor: colors.gray100 },  // Fondo gris muy claro para secciones
  bgGray200: { backgroundColor: colors.gray200 },  // Fondo gris claro para inputs
  bgGray800: { backgroundColor: colors.gray800 },  // Fondo oscuro para modo nocturno
  bgBlue500: { backgroundColor: colors.blue500 },  // Fondo azul para botones primarios
  bgRed500: { backgroundColor: colors.red500 },    // Fondo rojo para errores y botones destructivos
  bgGreen500: { backgroundColor: colors.green500 }, // Fondo verde para éxito y confirmaciones

  // ===== COLORES DE TEXTO =====
  // Colores de texto organizados por jerarquía y uso
  textWhite: { color: colors.white },              // Texto blanco sobre fondos oscuros
  textBlack: { color: colors.black },              // Texto negro (máximo contraste)
  textGray600: { color: colors.gray600 },          // Texto secundario (subtítulos, metadatos)
  textGray800: { color: colors.gray800 },          // Texto principal (lectura primary)
  textBlue600: { color: colors.blue600 },          // Texto azul para enlaces y acciones

  // ===== PESOS DE FUENTE =====
  // Jerarquía tipográfica basada en importancia
  fontNormal: { fontWeight: 'normal' },            // Peso normal para texto corriente
  fontMedium: { fontWeight: '500' },               // Peso medio para labels importantes
  fontSemibold: { fontWeight: '600' },             // Peso semi-bold para subtítulos
  fontBold: { fontWeight: 'bold' },                // Peso bold para títulos y énfasis

  // ===== TAMAÑOS DE FUENTE =====
  // Escala tipográfica para diferentes niveles de información
  textXs: { fontSize: fontSize.xs },               // Muy pequeño: metadatos, badges, notas
  textSm: { fontSize: fontSize.sm },               // Pequeño: labels, texto secundario
  textBase: { fontSize: fontSize.base },           // Base: texto principal de lectura
  textLg: { fontSize: fontSize.lg },               // Grande: subtítulos, texto destacado
  textXl: { fontSize: fontSize.xl },               // Extra grande: títulos de sección
  text2xl: { fontSize: fontSize['2xl'] },          // 2XL: títulos importantes de pantalla

  // ===== ALINEACIÓN DE TEXTO =====
  textCenter: { textAlign: 'center' },             // Centrar texto (títulos, botones)
  textLeft: { textAlign: 'left' },                 // Alinear izquierda (default, lectura)
  textRight: { textAlign: 'right' },               // Alinear derecha (números, metadatos)

  // ===== PADDING =====
  // Sistema de espaciado interno para componentes
  p1: { padding: spacing[1] },                     // Padding mínimo
  p2: { padding: spacing[2] },                     // Padding pequeño para elementos compactos
  p3: { padding: spacing[3] },                     // Padding medio
  p4: { padding: spacing[4] },                     // Padding estándar (más usado)
  p6: { padding: spacing[6] },                     // Padding grande para secciones
  px2: { paddingHorizontal: spacing[2] },          // Padding horizontal pequeño
  px4: { paddingHorizontal: spacing[4] },          // Padding horizontal estándar
  py2: { paddingVertical: spacing[2] },            // Padding vertical pequeño
  py4: { paddingVertical: spacing[4] },            // Padding vertical estándar
  pb4: { paddingBottom: spacing[4] },              // Padding bottom específico

  // ===== MARGIN =====
  // Sistema de espaciado externo entre componentes
  m1: { margin: spacing[1] },                      // Margin mínimo
  m2: { margin: spacing[2] },                      // Margin pequeño entre elementos relacionados
  m4: { margin: spacing[4] },                      // Margin estándar entre secciones
  mx2: { marginHorizontal: spacing[2] },           // Margin horizontal pequeño
  my2: { marginVertical: spacing[2] },             // Margin vertical pequeño
  mt1: { marginTop: spacing[1] },                  // Margin top mínimo
  mt2: { marginTop: spacing[2] },                  // Margin top pequeño
  mt4: { marginTop: spacing[4] },                  // Margin top estándar
  mb2: { marginBottom: spacing[2] },               // Margin bottom pequeño
  mb4: { marginBottom: spacing[4] },               // Margin bottom estándar

  // ===== BORDER RADIUS =====
  // Esquinas redondeadas para diferentes elementos
  rounded: { borderRadius: borderRadius.base },    // Redondeo estándar para cards y botones
  roundedLg: { borderRadius: borderRadius.lg },    // Redondeo grande para elementos destacados
  roundedFull: { borderRadius: borderRadius.full }, // Completamente redondo para avatares/iconos

  // ===== BORDES =====
  // Bordes para definir límites y separaciones
  border: { borderWidth: 1 },                      // Borde estándar de 1px
  borderGray200: { borderColor: colors.gray200 },  // Color de borde sutil y elegante

  // ===== SOMBRAS =====
  // Sombra estándar para dar profundidad a elementos elevados (cards, modales)
  shadowLg: {
    shadowColor: colors.black,                      // Color de sombra negro
    shadowOffset: { width: 0, height: 4 },         // Desplazamiento vertical para profundidad
    shadowOpacity: 0.1,                            // Opacidad sutil para elegancia
    shadowRadius: 6,                               // Radio de difuminado suave
    elevation: 4,                                  // Elevación para Android
  },

  // ===== DIMENSIONES =====
  // Tamaños predefinidos para elementos comunes
  w12: { width: 48 },                             // Ancho para iconos grandes
  h12: { height: 48 },                            // Alto para iconos grandes
  wFull: { width: '100%' },                       // Ancho completo del contenedor
  hFull: { height: '100%' },                      // Alto completo del contenedor
});

// ===== FUNCIÓN UTILITARIA =====
/**
 * Combina múltiples estilos en uno solo
 * Útil para aplicar estilos condicionales o combinar estilos base con personalizados
 *
 * @param styles - Array de estilos a combinar
 * @returns Estilo combinado optimizado
 */
export const combineStyles = (...styles: any[]) => {
  return StyleSheet.flatten(styles);
};
