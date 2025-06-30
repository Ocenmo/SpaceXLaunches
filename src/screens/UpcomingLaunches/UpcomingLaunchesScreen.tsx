import React, { useState, useEffect } from 'react';
import {
    View,
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from 'react-native';
import { LaunchCard } from '@/components/LaunchCard/LaunchCard';
import { Launch, SortOption } from '@/types/launch.types';
import { useLaunchService } from '@/hooks/useLaunchService';
import { SpaceXDataAdapter, UIFormatAdapter } from '@/services/adapters';

interface UpcomingLaunchesScreenProps {
    navigation: any;
}

export const UpcomingLaunchesScreen: React.FC<UpcomingLaunchesScreenProps> = ({
    navigation
}) => {
    const [launches, setLaunches] = useState<Launch[]>([]);
    const [filteredLaunches, setFilteredLaunches] = useState<Launch[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState<SortOption>('date_asc');
    const [showSortModal, setShowSortModal] = useState(false);

    const launchService = useLaunchService();

    useEffect(() => {
        loadUpcomingLaunches();
    }, []);

    useEffect(() => {
        applyFiltersAndSort();
    }, [launches, searchQuery, sortOption]);

    const loadUpcomingLaunches = async () => {
        try {
        setLoading(true);
        const upcomingLaunches = await launchService.getUpcomingLaunches();
        setLaunches(upcomingLaunches);
        } catch (error) {
        console.error('Error loading upcoming launches:', error);
        Alert.alert(
            'Error',
            'Failed to load upcoming launches. Please try again.',
            [{ text: 'OK' }]
        );
        } finally {
        setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadUpcomingLaunches();
        setRefreshing(false);
    };

    const applyFiltersAndSort = () => {
        let result = launches;

        // Apply search
        result = launchService.searchLaunches(result, searchQuery);

        // Apply sort
        result = launchService.sortLaunches(result, sortOption);

        setFilteredLaunches(result);
    };

    const handleLaunchPress = (launch: Launch) => {
        navigation.navigate('LaunchDetail', { launchId: launch.id });
    };

    const handleSortOptionPress = (option: SortOption) => {
        setSortOption(option);
        setShowSortModal(false);
    };

    const getSortButtonText = () => {
        switch (sortOption) {
        case 'date_asc':
            return 'Fecha ↑';
        case 'date_desc':
            return 'Fecha ↓';
        case 'name_asc':
            return 'Nombre ↑';
        case 'name_desc':
            return 'Nombre ↓';
        default:
            return 'Ordenar';
        }
    };

    const getCountdownText = (launch: Launch) => {
        const relativeTime = SpaceXDataAdapter.getRelativeTime(launch);
        return relativeTime.timeText;
    };

    const renderLaunchCard = ({ item }: { item: Launch }) => (
        <View className="bg-white rounded-lg shadow-md p-4 m-2">
        <LaunchCard
            launch={item}
            onPress={() => handleLaunchPress(item)}
        />

        {/* Countdown Timer */}
        <View className="mt-3 pt-3 border-t border-gray-200">
            <Text className="text-sm text-gray-600 mb-1">
            Tiempo restante:
            </Text>
            <Text className="text-lg font-bold text-blue-600">
            {getCountdownText(item)}
            </Text>
        </View>

        {/* TBD Indicator */}
        {item.tbd && (
            <View className="mt-2">
            <View className="bg-yellow-100 px-2 py-1 rounded-full self-start">
                <Text className="text-yellow-800 text-xs font-medium">
                Date TBD
                </Text>
            </View>
            </View>
        )}

        {/* NET Indicator */}
        {item.net && !item.tbd && (
            <View className="mt-2">
            <View className="bg-orange-100 px-2 py-1 rounded-full self-start">
                <Text className="text-orange-800 text-xs font-medium">
                No Earlier Than (NET)
                </Text>
            </View>
            </View>
        )}
        </View>
    );

    const renderSortModal = () => {
        if (!showSortModal) return null;

        return (
        <View className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <View className="bg-white rounded-lg p-6 mx-4 w-80">
            <Text className="text-lg font-bold mb-4 text-gray-800">
                Ordenar lanzamientos
            </Text>

            <TouchableOpacity
                className="py-3 border-b border-gray-200"
                onPress={() => handleSortOptionPress('date_asc')}
            >
                <Text className={`text-base ${sortOption === 'date_asc' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                Fecha (Más reciente)
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="py-3 border-b border-gray-200"
                onPress={() => handleSortOptionPress('date_desc')}
            >
                <Text className={`text-base ${sortOption === 'date_desc' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                Fecha (Más antigua)
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="py-3 border-b border-gray-200"
                onPress={() => handleSortOptionPress('name_asc')}
            >
                <Text className={`text-base ${sortOption === 'name_asc' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                Nombre (A-Z)
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="py-3 border-b border-gray-200"
                onPress={() => handleSortOptionPress('name_desc')}
            >
                <Text className={`text-base ${sortOption === 'name_desc' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                Nombre (Z-A)
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="mt-4 bg-gray-500 px-4 py-2 rounded-lg"
                onPress={() => setShowSortModal(false)}
            >
                <Text className="text-white text-center font-medium">
                Cancelar
                </Text>
            </TouchableOpacity>
            </View>
        </View>
        );
    };

    const renderEmptyState = () => (
        <View className="flex-1 justify-center items-center p-8">
        <Text className="text-xl text-gray-600 mb-2">
            🚀
        </Text>
        <Text className="text-lg font-medium text-gray-800 mb-2">
            No hay lanzamientos próximos
        </Text>
        <Text className="text-gray-600 text-center">
            {searchQuery ?
            `No se encontraron lanzamientos para "${searchQuery}"` :
            'No hay lanzamientos programados en este momento.'
            }
        </Text>
        {searchQuery && (
            <TouchableOpacity
            className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
            onPress={() => setSearchQuery('')}
            >
            <Text className="text-white font-medium">Clear Search</Text>
            </TouchableOpacity>
        )}
        </View>
    );

    if (loading) {
        return (
        <View className="flex-1 justify-center items-center bg-gray-100">
            <ActivityIndicator size="large" color="#0000ff" />
            <Text className="mt-2 text-gray-600">Cargando lanzamientos próximos...</Text>
        </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-100">
        {/* Search Bar */}
        <View className="bg-white p-4 shadow-sm">
            <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2 text-base"
            placeholder="Buscar lanzamientos próximos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            />
        </View>

        {/* Controls */}
        <View className="bg-white px-4 pb-4 flex-row justify-between items-center shadow-sm">
            <View className="flex-row items-center">
            <Text className="text-gray-600 mr-2">
                {filteredLaunches.length} Lanzamientos proximos
            </Text>
            </View>

            <TouchableOpacity
            className="bg-blue-500 px-4 py-2 rounded-lg"
            onPress={() => setShowSortModal(true)}
            >
            <Text className="text-white font-medium">
                {getSortButtonText()}
            </Text>
            </TouchableOpacity>
        </View>

        {/* Launch List */}
        {filteredLaunches.length === 0 && !loading ? (
            renderEmptyState()
        ) : (
            <FlatList
            data={filteredLaunches}
            keyExtractor={(item) => item.id}
            renderItem={renderLaunchCard}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
                <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#0000ff']}
                />
            }
            showsVerticalScrollIndicator={false}
            />
        )}

        {/* Sort Modal */}
        {renderSortModal()}
        </View>
    );
};