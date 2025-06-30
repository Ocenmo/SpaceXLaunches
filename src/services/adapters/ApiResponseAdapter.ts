import { Launch, RocketDetail, LaunchpadDetail } from '@/types/launch.types';

/**
 * Adapter para diferentes versiones de la API de SpaceX
 * Permite compatibilidad entre v4, v5 o futuras versiones
 */
export class ApiResponseAdapter {
    /**
     * Adapta respuesta de lanzamientos de diferentes versiones de API
     */
    static adaptLaunchResponse(rawData: any, apiVersion: 'v4' | 'v5' = 'v4'): any {
        switch (apiVersion) {
            case 'v4':
                return this.adaptV4Launch(rawData);
            case 'v5':
                return this.adaptV5Launch(rawData);
            default:
                return rawData;
        }
    }

    private static adaptV4Launch(data: any): any {
        // La estructura actual es v4, así que devolvemos tal como está
        return {
            ...data,
            // Asegurar que ciertos campos existan
            upcoming: data.upcoming ?? false,
            success: data.success ?? null,
            details: data.details ?? null,
            links: {
                ...data.links,
                patch: {
                    small: data.links?.patch?.small ?? null,
                    large: data.links?.patch?.large ?? null,
                },
                flickr: {
                    small: data.links?.flickr?.small ?? [],
                    original: data.links?.flickr?.original ?? [],
                }
            }
        };
    }

    private static adaptV5Launch(data: any): any {
        // Estructura hipotética para v5 - adaptar según sea necesario
        return {
            id: data.id,
            name: data.mission_name || data.name,
            date_utc: data.launch_date_utc || data.date_utc,
            upcoming: data.upcoming ?? false,
            success: data.launch_success ?? data.success,
            details: data.details || data.mission_description,
            // ... más adaptaciones según la estructura de v5
        };
    }

    /**
     * Normaliza errores de API a formato consistente
     */
    static normalizeApiError(error: any): {
        message: string;
        code: string;
        isNetworkError: boolean;
        isServerError: boolean;
        retryable: boolean;
    } {
        const isNetworkError = !error.response;
        const isServerError = error.response?.status >= 500;
        const isClientError = error.response?.status >= 400 && error.response?.status < 500;

        let message = 'Error desconocido';
        let code = 'UNKNOWN_ERROR';
        let retryable = false;

        if (isNetworkError) {
            message = 'Error de conexión. Verifica tu internet.';
            code = 'NETWORK_ERROR';
            retryable = true;
        } else if (isServerError) {
            message = 'Error del servidor. Intenta más tarde.';
            code = 'SERVER_ERROR';
            retryable = true;
        } else if (isClientError) {
            message = error.response?.data?.message || 'Solicitud inválida';
            code = 'CLIENT_ERROR';
            retryable = false;
        }

        return {
            message,
            code,
            isNetworkError,
            isServerError,
            retryable
        };
    }

    /**
     * Adapta respuesta de cohetes para consistencia
     */
    static adaptRocketResponse(data: any): RocketDetail {
        return {
            id: data.id,
            name: data.name,
            type: data.type || 'Rocket',
            description: data.description,
            height: data.height ? {
                meters: data.height.meters,
                feet: data.height.feet
            } : undefined,
            diameter: data.diameter ? {
                meters: data.diameter.meters,
                feet: data.diameter.feet
            } : undefined
        };
    }

    /**
     * Adapta respuesta de plataformas de lanzamiento
     */
    static adaptLaunchpadResponse(data: any): LaunchpadDetail {
        return {
            id: data.id,
            name: data.name,
            full_name: data.full_name,
            locality: data.locality,
            region: data.region,
            timezone: data.timezone,
            latitude: data.latitude,
            longitude: data.longitude,
            launch_attempts: data.launch_attempts,
            launch_successes: data.launch_successes,
            status: data.status
        };
    }
}
