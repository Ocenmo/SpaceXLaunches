import React from 'react';
import { View, Text } from 'react-native';

export const NativeWindTest = () => {
  console.log('NativeWindTest component rendered - Testing PURE NativeWind');

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-4">
        🧪 Prueba PURA de NativeWind
      </Text>

      <View className="bg-red-500 p-4 mb-4">
        <Text className="text-white text-center font-bold">
          Prueba 1: Fondo Rojo con NativeWind PURO
        </Text>
      </View>

      <View className="bg-blue-500 p-4 rounded-lg mb-4">
        <Text className="text-white text-center">
          Prueba 2: Azul + Rounded con NativeWind PURO
        </Text>
      </View>

      <View className="bg-white p-6 rounded-lg shadow-lg mb-4 w-full">
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          Prueba 3: Tarjeta con Sombra
        </Text>
        <Text className="text-sm text-gray-600">
          Si ves esta tarjeta con fondo blanco, sombra y texto estilizado, ¡NativeWind está funcionando al 100%!
        </Text>
      </View>

      <View className="flex-row justify-between mt-4">
        <View className="bg-green-500 p-2 rounded">
          <Text className="text-white text-xs">Verde</Text>
        </View>
        <View className="bg-yellow-400 p-2 rounded">
          <Text className="text-black text-xs">Amarillo</Text>
        </View>
        <View className="bg-purple-500 p-2 rounded">
          <Text className="text-white text-xs">Púrpura</Text>
        </View>
      </View>

      <Text className="mt-4 text-base text-gray-800 text-center">
        🎯 Si ves colores = NativeWind funciona ✅
      </Text>
      <Text className="mt-2 text-sm text-gray-600 text-center">
        Si no ves colores = NativeWind NO funciona ❌
      </Text>
    </View>
  );
};
