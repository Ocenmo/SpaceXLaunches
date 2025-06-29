import React, { useState, useEffect } from 'react';
import {
    View,
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
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
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Cargando lanzamientos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar lanzamientos..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            {/* Filter and Sort Controls */}
            <View style={styles.controlsContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {/* Modal Filtros */}}
                >
                    <Text style={styles.buttonText}>Filtrar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {/* Modal Ordenar */}}
                >
                    <Text style={styles.buttonText}>Ordenar</Text>
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
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
    },
    loadingText: {
        marginTop: 8,
        color: '#6b7280',
    },
    searchContainer: {
        backgroundColor: 'white',
        padding: 16,
    },
    searchInput: {
        backgroundColor: 'white',
        padding: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
    },
    controlsContainer: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
    },
    buttonText: {
        color: 'white',
    },
    listContainer: {
        padding: 16,
    },
});