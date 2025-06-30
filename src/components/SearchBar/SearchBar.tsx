import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    showFilters?: boolean;
    onFilterPress?: () => void;
    onSortPress?: () => void;
    resultsCount?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChangeText,
    placeholder = "Buscar...",
    showFilters = false,
    onFilterPress,
    onSortPress,
    resultsCount
}) => {
    return (
        <View className="bg-white" testID="search-bar">
        {/* Header con título */}
        <View className="pt-12 pb-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-b-3xl">
            <Text className="text-3xl font-bold text-black mb-2">
            🚀 SpaceX Launches
            </Text>
            {/* Barra de búsqueda */}
            <View className="relative">
            <TextInput
                className="bg-white/90 backdrop-blur-sm p-4 pr-12 border border-white/20 rounded-xl text-gray-800 placeholder-gray-500 shadow-lg"
                placeholder={placeholder}
                placeholderTextColor="#6B7280"
                value={value}
                onChangeText={onChangeText}
                testID="search-input"
            />
            <View className="absolute right-4 top-1/2 -translate-y-1/2">
                <Text className="text-gray-400 text-lg">🔍</Text>
            </View>
            </View>
        </View>

        {/* Controles de filtrado */}
        {showFilters && (
            <View className="px-6 py-4 flex-row justify-between items-center">
            <TouchableOpacity
                className="bg-blue-500 px-6 py-3 rounded-xl flex-row items-center shadow-sm active:bg-blue-600"
                onPress={onFilterPress}
                testID="filter-button"
            >
                <Text className="text-white font-semibold mr-2">🔍</Text>
                <Text className="text-white font-semibold">Filtrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="bg-green-500 px-6 py-3 rounded-xl flex-row items-center shadow-sm active:bg-green-600"
                onPress={onSortPress}
                testID="sort-button"
            >
                <Text className="text-white font-semibold mr-2">📊</Text>
                <Text className="text-white font-semibold">Ordenar</Text>
            </TouchableOpacity>
            </View>
        )}

        {/* Contador de resultados */}
        {resultsCount !== undefined && (
            <View className="px-6 pb-2">
            <Text className="text-gray-600 text-sm" testID="results-count">
                {resultsCount} lanzamientos encontrados
            </Text>
            </View>
        )}
        </View>
    );
};
