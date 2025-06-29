import React, { useState, useEffect } from 'react';
import {
    View,
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { LaunchCard } from '@/components/LaunchCard/LaunchCard';
import { Launch, SortOption, FilterOption } from '@/types/launch.types';
import { PastLaunchesNavigationProp } from '@/types/navigation.types';
import { useLaunchService } from '@/hooks/useLaunchService';

interface PastLaunchesScreenProps {
    navigation: PastLaunchesNavigationProp;
}

export const PastLaunchesScreen: React.FC<PastLaunchesScreenProps> = ({ navigation }) => {
    const [launches, setLaunches] = useState<Launch[]>([]);
    const [filteredLaunches, setFilteredLaunches] = useState<Launch[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState<SortOption>('date_desc');
    const [filterOption, setFilterOption] = useState<FilterOption>('all');

    const launchService = useLaunchService();

    useEffect(() => {
        loadPastLaunches();
    }, []);

    useEffect(() => {
        applyFiltersAndSort();
    }, [launches, searchQuery, sortOption, filterOption]);

    const loadPastLaunches = async () => {
        try {
            setLoading(true);
            const pastLaunches = await launchService.getPastLaunches();
            setLaunches(pastLaunches);
        } catch (error) {
            console.error('Error cargando lanzamientos pasados:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFiltersAndSort = () => {
        let result = launches;

        // Aplicar busqueda
        result = launchService.searchLaunches(result, searchQuery);

        // Aplicar filtro
        result = launchService.filterLaunches(result, filterOption);

        // Aplicar ordenamiento
        result = launchService.sortLaunches(result, sortOption);

        setFilteredLaunches(result);
    };

    const handleLaunchPress = (launch: Launch) => {
        navigation.navigate('LaunchDetails', { launchId: launch.id });
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-100">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="mt-2 text-gray-600">
                    Cargando lanzamientos...
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-100">
            {/* Search Bar */}
            <View className="bg-white p-4">
                <TextInput
                    className="bg-white p-4 border border-gray-200 rounded-lg"
                    placeholder="Buscar lanzamientos..."
                    placeholderTextColor="#6b7280"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            {/* Filter and Sort Controls */}
            <View className="bg-white px-4 pb-4 flex-row justify-between">
                <TouchableOpacity
                    className="bg-blue-500 px-4 py-2 rounded"
                    onPress={() => {/* Modal Filtros */}}
                >
                    <Text className="text-white">
                        Filtrar
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-blue-500 px-4 py-2 rounded"
                    onPress={() => {/* Modal Ordenar */}}
                >
                    <Text className="text-white">
                        Ordenar
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Lista de Lanzamientos */}
            <FlatList
                data={filteredLaunches}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <LaunchCard
                        launch={item}
                        onPress={() => handleLaunchPress(item)}
                    />
                )}
                contentContainerStyle={{ padding: 16 }}
            />
        </View>
    );
}