import AsyncStorage from '@react-native-async-storage/async-storage';
import { Launch } from '@/types/launch.types';

/**
 * Adapter para diferentes sistemas de almacenamiento local
 * Abstrae AsyncStorage, SecureStore, etc.
 */
export class StorageAdapter {
    private static readonly KEYS = {
        FAVORITES: 'user_favorites',
        CACHE_LAUNCHES: 'cached_launches',
        USER_PREFERENCES: 'user_preferences',
        LAST_UPDATE: 'last_update'
    } as const;

    /**
     * Guarda favoritos del usuario
     */
    static async saveFavorites(launchIds: string[]): Promise<void> {
        try {
            await AsyncStorage.setItem(
                this.KEYS.FAVORITES,
                JSON.stringify(launchIds)
            );
        } catch (error) {
            console.error('Error saving favorites:', error);
            throw new Error('No se pudieron guardar los favoritos');
        }
    }

    /**
     * Obtiene favoritos del usuario
     */
    static async getFavorites(): Promise<string[]> {
        try {
            const favoritesJson = await AsyncStorage.getItem(this.KEYS.FAVORITES);
            return favoritesJson ? JSON.parse(favoritesJson) : [];
        } catch (error) {
            console.error('Error loading favorites:', error);
            return [];
        }
    }

    /**
     * Guarda cache de lanzamientos
     */
    static async cacheLaunches(launches: Launch[]): Promise<void> {
        try {
            const cacheData = {
                timestamp: Date.now(),
                data: launches
            };
            await AsyncStorage.setItem(
                this.KEYS.CACHE_LAUNCHES,
                JSON.stringify(cacheData)
            );
        } catch (error) {
            console.error('Error caching launches:', error);
        }
    }

    /**
     * Obtiene cache de lanzamientos si es válido
     */
    static async getCachedLaunches(maxAge: number = 5 * 60 * 1000): Promise<Launch[] | null> {
        try {
            const cacheJson = await AsyncStorage.getItem(this.KEYS.CACHE_LAUNCHES);
            if (!cacheJson) return null;

            const cacheData = JSON.parse(cacheJson);
            const age = Date.now() - cacheData.timestamp;

            if (age > maxAge) {
                // Cache expirado
                await AsyncStorage.removeItem(this.KEYS.CACHE_LAUNCHES);
                return null;
            }

            return cacheData.data;
        } catch (error) {
            console.error('Error loading cached launches:', error);
            return null;
        }
    }

    /**
     * Guarda preferencias del usuario
     */
    static async saveUserPreferences(preferences: {
        sortOption?: string;
        filterOption?: string;
        notifications?: boolean;
        theme?: 'light' | 'dark';
    }): Promise<void> {
        try {
            await AsyncStorage.setItem(
                this.KEYS.USER_PREFERENCES,
                JSON.stringify(preferences)
            );
        } catch (error) {
            console.error('Error saving preferences:', error);
            throw new Error('No se pudieron guardar las preferencias');
        }
    }

    /**
     * Obtiene preferencias del usuario
     */
    static async getUserPreferences(): Promise<{
        sortOption: string;
        filterOption: string;
        notifications: boolean;
        theme: 'light' | 'dark';
    }> {
        try {
            const preferencesJson = await AsyncStorage.getItem(this.KEYS.USER_PREFERENCES);
            const defaultPreferences = {
                sortOption: 'date_desc',
                filterOption: 'all',
                notifications: true,
                theme: 'light' as const
            };

            return preferencesJson
                ? { ...defaultPreferences, ...JSON.parse(preferencesJson) }
                : defaultPreferences;
        } catch (error) {
            console.error('Error loading preferences:', error);
            return {
                sortOption: 'date_desc',
                filterOption: 'all',
                notifications: true,
                theme: 'light'
            };
        }
    }

    /**
     * Limpia todos los datos almacenados
     */
    static async clearAllData(): Promise<void> {
        try {
            await AsyncStorage.multiRemove([
                this.KEYS.FAVORITES,
                this.KEYS.CACHE_LAUNCHES,
                this.KEYS.USER_PREFERENCES,
                this.KEYS.LAST_UPDATE
            ]);
        } catch (error) {
            console.error('Error clearing data:', error);
            throw new Error('No se pudieron limpiar los datos');
        }
    }

    /**
     * Obtiene estadísticas de almacenamiento
     */
    static async getStorageStats(): Promise<{
        totalKeys: number;
        estimatedSize: string;
        lastUpdate: Date | null;
    }> {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const appKeys = keys.filter(key =>
                Object.values(this.KEYS).includes(key as any)
            );

            // Estimación de tamaño (no exacta, pero útil)
            let estimatedBytes = 0;
            for (const key of appKeys) {
                const value = await AsyncStorage.getItem(key);
                if (value) {
                    estimatedBytes += value.length * 2; // UTF-16 aprox
                }
            }

            const lastUpdateStr = await AsyncStorage.getItem(this.KEYS.LAST_UPDATE);
            const lastUpdate = lastUpdateStr ? new Date(lastUpdateStr) : null;

            return {
                totalKeys: appKeys.length,
                estimatedSize: this.formatBytes(estimatedBytes),
                lastUpdate
            };
        } catch (error) {
            console.error('Error getting storage stats:', error);
            return {
                totalKeys: 0,
                estimatedSize: '0 B',
                lastUpdate: null
            };
        }
    }

    private static formatBytes(bytes: number): string {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}
