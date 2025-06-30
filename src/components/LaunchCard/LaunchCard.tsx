import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Launch } from "@/types/launch.types";
import { SpaceXDataAdapter, UIFormatAdapter, ImageAdapter } from "@/services/adapters";
import { FavoriteButton } from "@/components/FavoriteButton";

interface LaunchCardProps {
    launch: Launch;
    onPress: () => void;
    showFavorite?: boolean;
}

export const LaunchCard: React.FC<LaunchCardProps> = ({
    launch,
    onPress,
    showFavorite = true
}) => {
    // Usar adapters para obtener datos formateados
    const statusDisplay = SpaceXDataAdapter.getLaunchStatusDisplay(launch);
    const relativeTime = SpaceXDataAdapter.getRelativeTime(launch);
    const patchImages = ImageAdapter.getPatchImages(launch.links?.patch || {});
    const formattedDate = UIFormatAdapter.formatDate(launch.date_utc, 'medium');
    const truncatedDetails = launch.details
        ? UIFormatAdapter.truncateText(launch.details, 120)
        : null;

    return (
        <TouchableOpacity
            testID="launch-card"
            onPress={onPress}
            className="bg-white rounded-xl p-5 mx-4 my-2 shadow-lg border border-gray-100 active:scale-98"
        >
            <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1 pr-4">
                    <Text testID="launch-name" className="text-xl font-bold text-gray-900 mb-2">
                        {launch.name}
                    </Text>

                    {/* Información de fecha mejorada */}
                    <View className="flex-row items-center mb-2">
                        <Text className="text-sm text-gray-500">
                            📅 {formattedDate}
                        </Text>
                        {!launch.upcoming && (
                            <Text className="text-xs text-gray-400 ml-2">
                                ({relativeTime.timeText})
                            </Text>
                        )}
                    </View>

                    {/* Countdown para lanzamientos próximos */}
                    {launch.upcoming && (
                        <View className="bg-blue-50 px-3 py-2 rounded-lg mb-2">
                            <Text className="text-blue-700 text-sm font-medium">
                                ⏰ {relativeTime.timeText}
                            </Text>
                        </View>
                    )}

                    {/* Flight number */}
                    <Text className="text-xs text-gray-400 mb-2">
                        Vuelo #{UIFormatAdapter.formatNumber(launch.flight_number)}
                    </Text>
                </View>

                <View className="items-end">
                    {/* Imagen del patch con fallback */}
                    <Image
                        source={{ uri: patchImages.medium }}
                        className="w-16 h-16 rounded-lg mb-2"
                        resizeMode="contain"
                    />

                    {/* Botón de favoritos */}
                    {showFavorite && (
                        <FavoriteButton
                            launchId={launch.id}
                            size="small"
                            variant="icon"
                        />
                    )}
                </View>
            </View>

            {/* Detalles de la misión */}
            {truncatedDetails && (
                <Text className="text-sm text-gray-600 mb-3" numberOfLines={2}>
                    {truncatedDetails}
                </Text>
            )}

            {/* Status badge mejorado */}
            <View className="flex-row items-center justify-between">
                <View
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: UIFormatAdapter.getStatusColor(statusDisplay.status).background }}
                >
                    <Text
                        testID="launch-status"
                        className="text-xs font-semibold"
                        style={{ color: UIFormatAdapter.getStatusColor(statusDisplay.status).text }}
                    >
                        {statusDisplay.displayText}
                    </Text>
                </View>

                {/* Indicadores adicionales */}
                <View className="flex-row space-x-2">
                    {launch.tbd && (
                        <View className="bg-yellow-100 px-2 py-1 rounded">
                            <Text className="text-yellow-800 text-xs">TBD</Text>
                        </View>
                    )}
                    {launch.net && !launch.tbd && (
                        <View className="bg-orange-100 px-2 py-1 rounded">
                            <Text className="text-orange-800 text-xs">NET</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Indicador visual para mostrar que es clickeable */}
            <View className="mt-4 pt-3 border-t border-gray-100">
                <Text className="text-xs text-gray-400 text-center">
                    Toca para ver más detalles →
                </Text>
            </View>
        </TouchableOpacity>
    );
};