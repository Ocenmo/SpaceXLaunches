/**
 * Hook personalizado para gestión de favoritos con persistencia local
 *
 * Este hook encapsula toda la lógica relacionada con el sistema de favoritos:
 * - Estado reactivo que se sincroniza automáticamente con AsyncStorage
 * - Operaciones CRUD completas (crear, leer, actualizar, eliminar)
 * - Manejo de errores robusto que no afecta la experiencia del usuario
 * - API simple y consistente para los componentes
 *
 * Beneficios del diseño:
 * - Reutilizable en cualquier componente que necesite favoritos
 * - Estado centralizado evita inconsistencias
 * - Persistencia automática e invisible para el usuario
 * - Loading states para UX fluida
 * - Error handling que permite recovery graceful
 */

import { useState, useEffect } from 'react';
import { StorageAdapter } from '@/services/adapters';

export const useFavorites = () => {
    // ===== ESTADO LOCAL =====
    const [favorites, setFavorites] = useState<string[]>([]);     // IDs de lanzamientos favoritos
    const [loading, setLoading] = useState(true);                 // Estado de carga inicial

    // ===== INICIALIZACIÓN =====

    /**
     * Carga favoritos desde AsyncStorage al montar el hook
     * Se ejecuta solo una vez al inicializar el componente
     */
    useEffect(() => {
        loadFavorites();
    }, []);

    /**
     * Carga favoritos desde persistencia local
     * Maneja errores sin romper la UI - si falla, simplemente no hay favoritos
     */
    const loadFavorites = async () => {
        try {
            setLoading(true);
            const savedFavorites = await StorageAdapter.getFavorites();
            setFavorites(savedFavorites);
        } catch (error) {
            console.error('Error loading favorites:', error);
            // No propagar error - la app funciona sin favoritos previos
        } finally {
            setLoading(false);
        }
    };

    // ===== OPERACIONES CRUD =====

    /**
     * Agrega un lanzamiento a favoritos
     * Persiste inmediatamente y actualiza el estado
     *
     * @param launchId - ID único del lanzamiento
     * @returns true si se agregó exitosamente, false si hubo error
     */
    const addToFavorites = async (launchId: string) => {
        try {
            // Crear nueva lista con el elemento agregado
            const newFavorites = [...favorites, launchId];

            // Persistir primero - si falla, no actualizamos el estado
            await StorageAdapter.saveFavorites(newFavorites);

            // Solo actualizar estado si la persistencia fue exitosa
            setFavorites(newFavorites);
            return true;
        } catch (error) {
            console.error('Error adding to favorites:', error);
            return false; // Permite que la UI maneje el error (ej: mostrar toast)
        }
    };

    /**
     * Remueve un lanzamiento de favoritos
     * Usa filtrado para crear nueva lista sin el elemento
     *
     * @param launchId - ID del lanzamiento a remover
     * @returns true si se removió exitosamente, false si hubo error
     */
    const removeFromFavorites = async (launchId: string) => {
        try {
            // Filtrar el elemento a remover
            const newFavorites = favorites.filter(id => id !== launchId);

            // Patrón consistente: persistir primero, luego actualizar estado
            await StorageAdapter.saveFavorites(newFavorites);
            setFavorites(newFavorites);
            return true;
        } catch (error) {
            console.error('Error removing from favorites:', error);
            return false;
        }
    };

    /**
     * Cambia el estado de favorito (toggle)
     * Método de conveniencia que combina add/remove automáticamente
     *
     * @param launchId - ID del lanzamiento
     * @returns resultado de la operación subyacente
     */
    const toggleFavorite = async (launchId: string) => {
        // Lógica inteligente: detectar estado actual y aplicar operación opuesta
        if (isFavorite(launchId)) {
            return await removeFromFavorites(launchId);
        } else {
            return await addToFavorites(launchId);
        }
    };

    // ===== UTILIDADES DE CONSULTA =====

    /**
     * Verifica si un lanzamiento está en favoritos
     * Método rápido para UI condicional (botones, iconos, etc.)
     *
     * @param launchId - ID del lanzamiento a verificar
     * @returns true si está en favoritos
     */
    const isFavorite = (launchId: string) => {
        return favorites.includes(launchId);
    };

    /**
     * Limpia todos los favoritos
     * Útil para configuraciones o reset de datos
     */
    const clearAllFavorites = async () => {
        try {
            await StorageAdapter.saveFavorites([]);
            setFavorites([]);
            return true;
        } catch (error) {
            console.error('Error clearing favorites:', error);
            return false;
        }
    };

    // ===== API PÚBLICA DEL HOOK =====
    return {
        // Estado
        favorites,                                          // Array de IDs de favoritos
        loading,                                            // Estado de carga inicial

        // Operaciones
        addToFavorites,                                     // Agregar a favoritos
        removeFromFavorites,                                // Remover de favoritos
        toggleFavorite,                                     // Toggle estado de favorito
        clearAllFavorites,                                  // Limpiar todos

        // Consultas
        isFavorite,                                         // Verificar si es favorito
        totalFavorites: favorites.length                    // Computed: cantidad total
    };
};
