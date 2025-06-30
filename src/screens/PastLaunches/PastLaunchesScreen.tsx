import React, { useState, useEffect } from 'react';
import {
    View,
    FlatList,
} from 'react-native';
import { LaunchCard } from '@/components/LaunchCard/LaunchCard';
import { SearchBar } from '@/components/SearchBar';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { Launch, SortOption, FilterOption } from '@/types/launch.types';
import { PastLaunchesNavigationProp } from '@/types/navigation.types';
import { useLaunchService } from '@/hooks/useLaunchService';
import { FilterSortModal } from '@/components/FilterSortModal/FilterSortModal';

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
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'filter' | 'sort'>('filter');

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
        navigation.navigate('LaunchDetail', { launchId: launch.id });
    };

    const handleFilterPress = () => {
        setModalType('filter');
        setModalVisible(true);
    };

    const handleSortPress = () => {
        setModalType('sort');
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
    };

    if (loading) {
        return (
            <LoadingState message="🚀 Cargando lanzamientos de SpaceX..." />
        );
    }

    return (
        <View className="flex-1 bg-gradient-to-b from-blue-50 to-blue-100">
            {/* SearchBar Component */}
            <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Buscar por nombre de misión..."
                showFilters={true}
                onFilterPress={handleFilterPress}
                onSortPress={handleSortPress}
                resultsCount={filteredLaunches.length}
            />

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
                className="flex-1 pt-2"
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <EmptyState
                        icon="�"
                        title="No se encontraron lanzamientos"
                        description="Intenta ajustar tu búsqueda o filtros para encontrar los lanzamientos que buscas"
                        actionText="Limpiar búsqueda"
                        onActionPress={() => setSearchQuery('')}
                    />
                )}
            />

            {/* FilterSort Modal */}
            <FilterSortModal
                visible={modalVisible}
                onClose={handleModalClose}
                currentFilter={filterOption}
                currentSort={sortOption}
                onFilterChange={setFilterOption}
                onSortChange={setSortOption}
                type={modalType}
            />
        </View>
    );
}