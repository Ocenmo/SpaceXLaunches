import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';

// Definir las rutas del Stack principal
export type RootStackParamList = {
  MainTabs: undefined;
  LaunchDetails: { launchId: string };
};

// Definir las rutas de las pestañas
export type TabParamList = {
  PastLaunches: undefined;
  UpcomingLaunches: undefined;
};

// Tipos de navegación para las pantallas de pestañas
export type TabNavigationProp = BottomTabNavigationProp<TabParamList>;

// Tipos de navegación para pantallas que pueden navegar tanto en tabs como en stack
export type PastLaunchesNavigationProp = CompositeNavigationProp<
  TabNavigationProp,
  StackNavigationProp<RootStackParamList>
>;

export type UpcomingLaunchesNavigationProp = CompositeNavigationProp<
  TabNavigationProp,
  StackNavigationProp<RootStackParamList>
>;

// Tipo de navegación para pantallas del stack principal
export type RootStackNavigationProp = StackNavigationProp<RootStackParamList>;
