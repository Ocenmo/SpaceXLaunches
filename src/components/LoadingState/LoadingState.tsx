import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

interface LoadingStateProps {
    message?: string;
    size?: 'small' | 'large';
    color?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
    message = "Cargando...",
    size = "large",
    color = "#3B82F6"
}) => {
    return (
        <View className="flex-1 bg-gradient-to-b from-blue-50 to-blue-100 justify-center items-center px-8">
        <View className="items-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
            <ActivityIndicator size={size} color={color} />
            <Text className="text-gray-700 mt-6 text-xl font-medium text-center">
            {message}
            </Text>
            <View className="mt-4 flex-row items-center space-x-2">
            <View className="w-2 h-2 bg-blue-400 rounded-full" />
            <View className="w-2 h-2 bg-blue-500 rounded-full" />
            <View className="w-2 h-2 bg-blue-600 rounded-full" />
            </View>
        </View>
        </View>
    );
};
