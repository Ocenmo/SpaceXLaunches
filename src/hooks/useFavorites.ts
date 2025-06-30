import { useState, useEffect } from 'react';
import { StorageAdapter } from '@/services/adapters';

/**
 * Hook personalizado para manejar favoritos
 */
export const useFavorites = () => {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // Cargar favoritos al inicializar
    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            setLoading(true);
            const savedFavorites = await StorageAdapter.getFavorites();
            setFavorites(savedFavorites);
        } catch (error) {
            console.error('Error loading favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToFavorites = async (launchId: string) => {
        try {
            const newFavorites = [...favorites, launchId];
            await StorageAdapter.saveFavorites(newFavorites);
            setFavorites(newFavorites);
            return true;
        } catch (error) {
            console.error('Error adding to favorites:', error);
            return false;
        }
    };

    const removeFromFavorites = async (launchId: string) => {
        try {
            const newFavorites = favorites.filter(id => id !== launchId);
            await StorageAdapter.saveFavorites(newFavorites);
            setFavorites(newFavorites);
            return true;
        } catch (error) {
            console.error('Error removing from favorites:', error);
            return false;
        }
    };

    const toggleFavorite = async (launchId: string) => {
        if (isFavorite(launchId)) {
            return await removeFromFavorites(launchId);
        } else {
            return await addToFavorites(launchId);
        }
    };

    const isFavorite = (launchId: string) => {
        return favorites.includes(launchId);
    };

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

    return {
        favorites,
        loading,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        isFavorite,
        clearAllFavorites,
        totalFavorites: favorites.length
    };
};
