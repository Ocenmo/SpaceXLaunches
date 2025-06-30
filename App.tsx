import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';

// Importar NativeWind CSS
import './global.css';

import { RootStackParamList, TabParamList } from '@/types/navigation.types';
import { PastLaunchesScreen } from '@/screens/PastLaunches/PastLaunchesScreen';
import { UpcomingLaunchesScreen } from '@/screens/UpcomingLaunches';
import { LaunchDetailScreen } from '@/screens/LaunchDetail';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

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
          name="LaunchDetail"
          component={LaunchDetailScreen}
          options={{ title: 'Detalles del Lanzamiento' }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
