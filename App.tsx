/**
 * Aplicación Principal - SpaceX Launches
 *
 * Este es el punto de entrada de la aplicación que configura la estructura
 * de navegación completa usando React Navigation v6.
 *
 * Arquitectura de navegación implementada:
 * Stack Navigator (raíz)
 * ├── MainTabs (Tab Navigator)
 * │   ├── PastLaunches (Lista de lanzamientos pasados)
 * │   └── UpcomingLaunches (Lista de lanzamientos futuros)
 * └── LaunchDetail (Pantalla de detalle modal)
 *
 * Características del diseño:
 * - Navegación híbrida Stack + Tabs para máxima flexibilidad
 * - Tipado estricto de rutas con TypeScript
 * - Configuración de tema consistente
 * - StatusBar automática según el sistema
 * - NativeWind configurado globalmente
 *
 * UX Decisions:
 * - Tabs para funciones principales (fácil switching)
 * - Stack para detalles (preserva contexto con back)
 * - Iconos emoji para claridad universal
 * - Colores que siguen el design system (blue-500, gray-500)
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';

// Importar estilos globales de NativeWind - debe ser lo primero
import './global.css';

// Tipos de navegación tipados con TypeScript
import { RootStackParamList, TabParamList } from '@/types/navigation.types';

// Pantallas de la aplicación organizadas por feature
import { PastLaunchesScreen } from '@/screens/PastLaunches/PastLaunchesScreen';
import { UpcomingLaunchesScreen } from '@/screens/UpcomingLaunches';
import { LaunchDetailScreen } from '@/screens/LaunchDetail';

// Navigators tipados para type safety
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

/**
 * Navegador de pestañas (Tab Navigator)
 * Contiene las pantallas principales de la aplicación
 */
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        // Colores que siguen nuestro design system
        tabBarActiveTintColor: '#3B82F6',      // blue-500: color principal activo
        tabBarInactiveTintColor: '#6B7280',    // gray-500: color inactivo

        // Estilo de la barra de pestañas
        tabBarStyle: {
          backgroundColor: '#FFFFFF',          // Fondo blanco limpio
          borderTopWidth: 1,                   // Borde superior sutil
          borderTopColor: '#E5E7EB',          // gray-200: separación elegante
        },
      }}
    >
      {/* Pestaña 1: Lanzamientos Pasados */}
      <Tab.Screen
        name="PastLaunches"
        component={PastLaunchesScreen}
        options={{
          title: 'Lanzamientos Pasados',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>🚀</Text>  // Emoji universal y claro
          )
        }}
      />

      {/* Pestaña 2: Próximos Lanzamientos */}
      <Tab.Screen
        name="UpcomingLaunches"
        component={UpcomingLaunchesScreen}
        options={{
          title: 'Próximos Lanzamientos',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>⏰</Text>  // Emoji que indica tiempo futuro
          )
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * Componente principal de la aplicación
 * Configura el Stack Navigator raíz y el contenedor de navegación
 */
export default function App() {
  return (
    <NavigationContainer>
      {/* Stack Navigator principal - permite navegación modal */}
      <Stack.Navigator initialRouteName="MainTabs">

        {/* Pantalla principal: Navegador de pestañas */}
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }}     // Sin header - las tabs tienen su propia UI
        />

        {/* Pantalla modal: Detalles del lanzamiento */}
        <Stack.Screen
          name="LaunchDetail"
          component={LaunchDetailScreen}
          options={{ title: 'Detalles del Lanzamiento' }}  // Header con título descriptivo
        />
      </Stack.Navigator>

      {/* StatusBar automática que se adapta al contenido y tema del sistema */}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
