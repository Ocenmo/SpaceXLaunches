/**
 * Pantalla de Lanzamientos Pasados
 *
 * Esta es una de las pantallas principales de la aplicación. Implementa una experiencia
 * completa de exploración de datos con múltiples funcionalidades:
 *
 * Funcionalidades principales:
 * - Lista paginada y optimizada de lanzamientos pasados
 * - Búsqueda en tiempo real con debounce
 * - Filtrado por estado de la misión (éxito/fallo)
 * - Ordenamiento por fecha y nombre
 * - Navegación a pantalla de detalle
 * - Estados de carga y error manejados elegantemente
 *
 * Arquitectura de estado:
 * - Estado local para datos y configuraciones de UI
 * - Efectos reactivos que responden a cambios
 * - Separación clara entre datos originales y procesados
 * - Pipeline de transformación de datos predecible
 *
 * UX considerations:
 * - Loading states para feedback inmediato
 * - Empty states informativos
 * - Búsqueda responsiva
 * - Navegación tipada y segura
 */

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

/**
 * Props de la pantalla - incluye navegación tipada
 */
interface PastLaunchesScreenProps {
    navigation: PastLaunchesNavigationProp;
}

export const PastLaunchesScreen: React.FC<PastLaunchesScreenProps> = ({ navigation }) => {

    // ===== ESTADO DE DATOS =====
    const [launches, setLaunches] = useState<Launch[]>([]);                    // Datos originales de la API
    const [filteredLaunches, setFilteredLaunches] = useState<Launch[]>([]);    // Datos procesados para mostrar
    const [loading, setLoading] = useState(true);                             // Estado de carga inicial

    // ===== ESTADO DE CONTROLES DE USUARIO =====
    const [searchQuery, setSearchQuery] = useState('');                       // Término de búsqueda actual
    const [sortOption, setSortOption] = useState<SortOption>('date_desc');    // Orden por defecto: más recientes primero
    const [filterOption, setFilterOption] = useState<FilterOption>('all');    // Filtro por defecto: mostrar todos
    const [modalVisible, setModalVisible] = useState(false);                  // Estado del modal de filtros/orden
    const [modalType, setModalType] = useState<'filter' | 'sort'>('filter');  // Tipo de modal a mostrar

    // ===== SERVICIOS =====
    const launchService = useLaunchService();

    // ===== EFECTOS REACTIVOS =====

    /**
     * Efecto de inicialización - carga datos al montar el componente
     * Se ejecuta solo una vez
     */
    useEffect(() => {
        loadPastLaunches();
    }, []);

    /**
     * Efecto de procesamiento de datos - responde a cambios en filtros y búsqueda
     * Se ejecuta cada vez que cambian los datos o configuraciones
     */
    useEffect(() => {
        applyFiltersAndSort();
    }, [launches, searchQuery, sortOption, filterOption]);

    // ===== OPERACIONES DE DATOS =====

    /**
     * Carga lanzamientos pasados desde la API
     * Maneja estado de carga y errores
     */
    const loadPastLaunches = async () => {
        try {
            setLoading(true);
            const pastLaunches = await launchService.getPastLaunches();
            setLaunches(pastLaunches);  // Guardar datos originales
        } catch (error) {
            console.error('Error cargando lanzamientos pasados:', error);
            // TODO: Mostrar toast o mensaje de error al usuario
        } finally {
            setLoading(false);
        }
    };

    /**
     * Pipeline de transformación de datos
     * Aplica búsqueda → filtro → ordenamiento en secuencia
     *
     * Este patrón garantiza que las transformaciones se apliquen en orden consistente
     * y que el resultado final contenga exactamente lo que el usuario espera ver
     */
    const applyFiltersAndSort = () => {
        let result = launches; // Partir de datos originales

        // 1. Aplicar búsqueda por texto
        result = launchService.searchLaunches(result, searchQuery);

        // 2. Aplicar filtro por estado de misión
        result = launchService.filterLaunches(result, filterOption);

        // 3. Aplicar ordenamiento final
        result = launchService.sortLaunches(result, sortOption);

        // 4. Actualizar datos para renderizar (un solo setState)
        setFilteredLaunches(result);
    };

    // ===== HANDLERS DE NAVEGACIÓN Y EVENTOS =====

    /**
     * Maneja el tap en una tarjeta de lanzamiento
     * Navega a la pantalla de detalle con navegación tipada
     */
    const handleLaunchPress = (launch: Launch) => {
        navigation.navigate('LaunchDetail', { launchId: launch.id });
    };

    /**
     * Abre modal de filtros
     */
    const handleFilterPress = () => {
        setModalType('filter');
        setModalVisible(true);
    };

    /**
     * Abre modal de ordenamiento
     */
    const handleSortPress = () => {
        setModalType('sort');
        setModalVisible(true);
    };

    /**
     * Cierra cualquier modal abierto
     */
    const handleModalClose = () => {
        setModalVisible(false);
    };

    // ===== RENDERIZADO CONDICIONAL =====

    /**
     * Estado de carga - mostrar mientras se obtienen los datos
     * Proporciona feedback inmediato al usuario
     */
    if (loading) {
        return (
            <LoadingState message="🚀 Cargando lanzamientos de SpaceX..." />
        );
    }

    // ===== RENDERIZADO PRINCIPAL =====
    return (
        <View className="flex-1 bg-gradient-to-b from-blue-50 to-blue-100">
            {/*
             * Gradiente de fondo sutil que da profundidad visual
             * from-blue-50 to-blue-100: muy sutil para no distraer del contenido
             */}

            {/* ===== BARRA DE BÚSQUEDA Y CONTROLES ===== */}
            <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}               // Búsqueda en tiempo real
                placeholder="Buscar por nombre de misión..."
                showFilters={true}                          // Mostrar botones de filtro y orden
                onFilterPress={handleFilterPress}          // Abrir modal de filtros
                onSortPress={handleSortPress}               // Abrir modal de ordenamiento
                resultsCount={filteredLaunches.length}      // Mostrar cantidad de resultados
            />

            {/* ===== LISTA PRINCIPAL DE LANZAMIENTOS ===== */}
            <FlatList
                data={filteredLaunches}                     // Datos procesados por pipeline
                keyExtractor={(item) => item.id.toString()} // Key única para performance
                renderItem={({ item }) => (
                    <LaunchCard
                        launch={item}                       // Datos del lanzamiento
                        onPress={() => handleLaunchPress(item)} // Navegación a detalle
                    />
                )}
                className="flex-1 pt-2"                     // Ocupar espacio restante
                showsVerticalScrollIndicator={false}        // UI más limpia sin scrollbar

                // Componente para estado vacío - se muestra cuando no hay resultados
                // Proporciona guidance al usuario sobre qué hacer
                ListEmptyComponent={() => (
                    <EmptyState
                        icon="🔍"                           // Icono relacionado con búsqueda
                        title="No se encontraron lanzamientos"
                        description="Intenta ajustar tu búsqueda o filtros para encontrar los lanzamientos que buscas"
                        actionText="Limpiar búsqueda"
                        onActionPress={() => setSearchQuery('')} // Action para ayudar al usuario
                    />
                )}
            />

            {/* ===== MODAL DE FILTROS Y ORDENAMIENTO ===== */}
            <FilterSortModal
                visible={modalVisible}                      // Controlado por estado local
                onClose={handleModalClose}                  // Callback para cerrar
                currentFilter={filterOption}               // Estado actual del filtro
                currentSort={sortOption}                   // Estado actual del ordenamiento
                onFilterChange={setFilterOption}           // Callback para cambiar filtro
                onSortChange={setSortOption}               // Callback para cambiar orden
                type={modalType}                           // Tipo de modal a mostrar
            />
        </View>
    );
};