import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { useFavorites } from '@/hooks/useFavorites';

interface FavoriteButtonProps {
    launchId: string;
    size?: 'small' | 'medium' | 'large';
    variant?: 'icon' | 'text' | 'full';
    onToggle?: (isFavorite: boolean) => void;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
    launchId,
    size = 'medium',
    variant = 'icon',
    onToggle
}) => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const favorite = isFavorite(launchId);

    const handlePress = async () => {
        const success = await toggleFavorite(launchId);
        if (success && onToggle) {
            onToggle(!favorite);
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return 'p-1';
            case 'large':
                return 'p-4';
            default:
                return 'p-2';
        }
    };

    const getIconSize = () => {
        switch (size) {
            case 'small':
                return 16;
            case 'large':
                return 24;
            default:
                return 20;
        }
    };

    const renderContent = () => {
        const icon = favorite ? '★' : '☆';
        const iconColor = favorite ? 'text-yellow-500' : 'text-gray-400';

        switch (variant) {
            case 'text':
                return (
                    <Text className={`${iconColor} font-medium`}>
                        {favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                    </Text>
                );

            case 'full':
                return (
                    <View className="flex-row items-center space-x-2">
                        <Text className={`${iconColor}`} style={{ fontSize: getIconSize() }}>
                            {icon}
                        </Text>
                        <Text className={`${iconColor} font-medium`}>
                            {favorite ? 'Favorito' : 'Añadir'}
                        </Text>
                    </View>
                );

            default: // icon
                return (
                    <Text className={iconColor} style={{ fontSize: getIconSize() }}>
                        {icon}
                    </Text>
                );
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            className={`${getSizeStyles()} rounded-lg ${
                favorite ? 'bg-yellow-50' : 'bg-gray-50'
            } active:opacity-70`}
            activeOpacity={0.7}
        >
            {renderContent()}
        </TouchableOpacity>
    );
};
