import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity } from 'react-native';

// Importar NativeWind CSS
import './global.css';

import { RootStackParamList, TabParamList } from '@/types/navigation.types';
import { PastLaunchesScreen } from '@/screens/PastLaunches/PastLaunchesScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Componente temporal para UpcomingLaunches
const UpcomingLaunchesScreen = () => (
  <View className="flex-1 bg-gradient-to-b from-blue-50 to-blue-100">
    <View className="p-6">
      <Text className="text-3xl font-bold text-gray-800 mb-2">
        🚀 Próximos Lanzamientos
      </Text>
      <Text className="text-lg text-gray-600 mb-6">
        Mantente al día con los próximos lanzamientos de SpaceX
      </Text>

      <View className="bg-white rounded-xl p-6 shadow-lg mb-4">
        <Text className="text-xl font-semibold text-gray-800 mb-3">
          ⚡ Función en Desarrollo
        </Text>
        <Text className="text-gray-600 mb-4">
          Esta sección mostrará todos los lanzamientos programados de SpaceX con detalles completos,
          cronometradores en tiempo real y notificaciones.
        </Text>
        <TouchableOpacity className="bg-blue-500 px-6 py-3 rounded-lg">
          <Text className="text-white font-semibold text-center">
            Próximamente
          </Text>
        </TouchableOpacity>
      </View>

      <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <Text className="text-yellow-800 font-medium">
          💡 Por ahora, puedes explorar los lanzamientos pasados en la pestaña anterior
        </Text>
      </View>
    </View>
  </View>
);

// Componente temporal para LaunchDetails
const LaunchDetailsScreen = () => (
  <View className="flex-1 bg-gray-50 p-6">
    <View className="bg-white rounded-xl p-6 shadow-lg">
      <Text className="text-2xl font-bold text-gray-800 mb-4">
        📄 Detalles del Lanzamiento
      </Text>
      <Text className="text-gray-600 mb-4">
        Esta pantalla mostrará información detallada sobre el lanzamiento seleccionado,
        incluyendo:
      </Text>
      <View className="space-y-2">
        <Text className="text-gray-700">• 🚀 Información completa de la misión</Text>
        <Text className="text-gray-700">• 📅 Fecha y hora detallada</Text>
        <Text className="text-gray-700">• 🎯 Estado del lanzamiento</Text>
        <Text className="text-gray-700">• 🎥 Enlaces a videos y recursos</Text>
        <Text className="text-gray-700">• 📊 Datos técnicos del cohete</Text>
      </View>
    </View>
  </View>
);

// Navegador de pestañas
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        },
      }}
    >
      <Tab.Screen
        name="PastLaunches"
        component={PastLaunchesScreen}
        options={{
          title: 'Lanzamientos Pasados',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>🚀</Text>
          )
        }}
      />
      <Tab.Screen
        name="UpcomingLaunches"
        component={UpcomingLaunchesScreen}
        options={{
          title: 'Próximos Lanzamientos',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>⏰</Text>
          )
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainTabs">
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LaunchDetails"
          component={LaunchDetailsScreen}
          options={{ title: 'Detalles del Lanzamiento' }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
