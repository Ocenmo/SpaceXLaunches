import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Launch } from "@/types/launch.types";

interface LaunchCardProps {
    launch: Launch;
    onPress: () => void;
}

export const LaunchCard: React.FC<LaunchCardProps> = ({ launch, onPress }) => {
    const getStatusColor = (success: boolean | null) => {
        if (success === null) return 'bg-gray-500'; // Unknown status
        return success ? 'bg-green-500' : 'bg-red-500';
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString();
    };

    return (
        <TouchableOpacity
        onPress={onPress}
        className="bg-white rounded-lg shadow-md p-4 m-2"
        >
            <View className="flex-row justify-between items-start">
                <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-800">{launch.name}</Text>
                    <Text className="text-sm text-gray-600 mt-1">
                        {formatDate(new Date(launch.date_utc))}
                    </Text>
                    <View className={`mt-2 px-2 py-1 rounded-full self-start ${getStatusColor(launch.success)}`}>
                        <Text className="text-white text-xs font-medium">
                            {launch.upcoming ? "Upcoming" : (launch.success ? "Successful" : "Failed")}
                        </Text>
                    </View>
                </View>
            {launch.links?.patch?.small && (
                <Image
                    source={{ uri: launch.links.patch.small }}
                    className="w-12 h-12 rounded"
                />
            )}
            </View>
        </TouchableOpacity>
    )
}