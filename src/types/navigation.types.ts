/**
 * Tipos de navegación para React Navigation
 *
 * Este archivo define la estructura de navegación de la aplicación usando TypeScript
 * para garantizar type safety en todas las transiciones entre pantallas.
 *
 * Estructura de navegación:
 * - RootStack: Navegador principal que contiene las pestañas y pantallas modales
 * - TabNavigator: Navegador de pestañas para las pantallas principales
 * - Pantallas individuales con sus parámetros específicos
 *
 * El uso de tipos estrictos nos ayuda a:
 * - Prevenir errores de navegación en tiempo de compilación
 * - Autocompletar parámetros de navegación
 * - Refactorizar de forma segura
 */

import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';

// ===== DEFINICIÓN DE RUTAS DEL STACK PRINCIPAL =====

/**
 * Parámetros del navegador principal (Stack)
 * Define todas las pantallas accesibles desde cualquier punto de la app
 */
export type RootStackParamList = {
  MainTabs: undefined;                                   // Navegador de pestañas (sin parámetros)
  LaunchDetail: { launchId: string };                    // Pantalla de detalle (requiere ID del lanzamiento)
};

// ===== DEFINICIÓN DE RUTAS DE PESTAÑAS =====

/**
 * Parámetros del navegador de pestañas (Bottom Tabs)
 * Define las pantallas principales de la aplicación
 */
export type TabParamList = {
  NativeWindTest: undefined;                             // Pantalla de prueba (temporal para desarrollo)
  PastLaunches: undefined;                               // Lista de lanzamientos pasados
  UpcomingLaunches: undefined;                           // Lista de lanzamientos futuros
};

// ===== TIPOS DE NAVEGACIÓN ESPECÍFICOS =====

/**
 * Tipo de navegación básico para pantallas de pestañas
 * Permite navegar entre pestañas del TabNavigator
 */
export type TabNavigationProp = BottomTabNavigationProp<TabParamList>;

/**
 * Navegación compuesta para pantallas que necesitan acceso tanto a tabs como al stack
 * Esto permite que las pantallas de lanzamientos naveguen a LaunchDetail (stack)
 * y también cambien de pestaña si es necesario
 */
export type PastLaunchesNavigationProp = CompositeNavigationProp<
  TabNavigationProp,
  StackNavigationProp<RootStackParamList>
>;

export type UpcomingLaunchesNavigationProp = CompositeNavigationProp<
  TabNavigationProp,
  StackNavigationProp<RootStackParamList>
>;

/**
 * Tipo de navegación para pantallas del stack principal
 * Usado principalmente en LaunchDetailScreen para regresar al stack anterior
 */
export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
