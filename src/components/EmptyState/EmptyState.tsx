import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface EmptyStateProps {
    icon?: string;
    title: string;
    description: string;
    actionText?: string;
    onActionPress?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon = "🔍",
    title,
    description,
    actionText,
    onActionPress
    }) => {
    return (
        <View className="flex-1 justify-center items-center p-8">
        <View className="items-center mb-8">
            <Text className="text-8xl mb-6">{icon}</Text>
            <Text className="text-2xl font-bold text-gray-800 mb-3 text-center">
            {title}
            </Text>
            <Text className="text-gray-600 text-center text-lg leading-6 max-w-sm">
            {description}
            </Text>
        </View>

        {actionText && onActionPress && (
            <TouchableOpacity
            className="bg-blue-500 px-8 py-4 rounded-xl shadow-lg active:bg-blue-600"
            onPress={onActionPress}
            >
            <Text className="text-white font-semibold text-lg">
                {actionText}
            </Text>
            </TouchableOpacity>
        )}
        </View>
    );
};
