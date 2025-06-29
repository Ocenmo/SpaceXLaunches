import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Launch } from "@/types/launch.types";

interface LaunchCardProps {
    launch: Launch;
    onPress: () => void;
}

export const LaunchCard: React.FC<LaunchCardProps> = ({ launch, onPress }) => {
    const getStatusBadgeStyle = (success: boolean | null) => {
        const baseClasses = "mt-3 px-3 py-1 rounded-full self-start";
        if (success === null) return `${baseClasses} bg-gray-500`;
        return success ? `${baseClasses} bg-green-500` : `${baseClasses} bg-red-500`;
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white rounded-xl p-5 mx-4 my-2 shadow-lg border border-gray-100 active:scale-98"
        >
            <View className="flex-row justify-between items-start">
                <View className="flex-1 pr-4">
                    <Text className="text-xl font-bold text-gray-900 mb-2">
                        {launch.name}
                    </Text>
                    <Text className="text-sm text-gray-500 mb-1">
                        📅 {formatDate(new Date(launch.date_utc))}
                    </Text>

                    {launch.details && (
                        <Text
                            className="text-sm text-gray-600 mt-2"
                            numberOfLines={2}
                        >
                            {launch.details}
                        </Text>
                    )}

                    <View className={getStatusBadgeStyle(launch.success)}>
                        <Text className="text-white text-xs font-semibold">
                            {launch.upcoming ? "🔮 Próximo" : (launch.success ? "✅ Exitoso" : "❌ Fallido")}
                        </Text>
                    </View>
                </View>

                {launch.links?.patch?.small && (
                    <View className="ml-2">
                        <Image
                            source={{ uri: launch.links.patch.small }}
                            className="w-16 h-16 rounded-lg"
                        />
                    </View>
                )}
            </View>

            {/* Indicador visual para mostrar que es clickeable */}
            <View className="mt-4 pt-3 border-t border-gray-100">
                <Text className="text-xs text-gray-400 text-center">
                    Toca para ver más detalles →
                </Text>
            </View>
        </TouchableOpacity>
    )
}