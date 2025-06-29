import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

// Importar NativeWind CSS
import './global.css';

import { RootStackParamList, TabParamList } from '@/types/navigation.types';
import { PastLaunchesScreen } from '@/screens/PastLaunches/PastLaunchesScreen';
import { NativeWindTest } from '@/components/NativeWindTest';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Componente temporal para UpcomingLaunches
const UpcomingLaunchesScreen = () => (
  <View className="flex-1 bg-red-500">
    <Text className="text-white text-2xl font-bold p-4">
      Test Simple - Si ves fondo rojo, NativeWind funciona
    </Text>
    <View className="bg-blue-500 m-4 p-4">
      <Text className="text-white text-center">
        Tarjeta azul
      </Text>
    </View>
  </View>
);

// Componente temporal para LaunchDetails
const LaunchDetailsScreen = () => (
  <Text>Launch Details Screen - Coming Soon</Text>
);

// Navegador de pestañas
const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="NativeWindTest"
        component={NativeWindTest}
        options={{ title: 'Test NativeWind' }}
      />
      <Tab.Screen
        name="PastLaunches"
        component={PastLaunchesScreen}
        options={{ title: 'Lanzamientos Pasados' }}
      />
      <Tab.Screen
        name="UpcomingLaunches"
        component={UpcomingLaunchesScreen}
        options={{ title: 'Próximos Lanzamientos' }}
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
