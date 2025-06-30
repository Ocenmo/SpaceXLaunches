/**
 * Adapter para transformar y normalizar datos de la API de SpaceX
 *
 * Este adapter es el corazón de la transformación de datos en la aplicación.
 * Se encarga de convertir los datos crudos de la API de SpaceX en información
 * útil y presentable para la interfaz de usuario.
 *
 * Responsabilidades principales:
 * - Normalizar estados de lanzamientos a formatos legibles
 * - Calcular tiempos relativos en español natural
 * - Formatear información técnica para mostrar al usuario
 * - Extraer y organizar datos relevantes de estructuras complejas
 * - Proporcionar colores consistentes para estados
 *
 * Este patrón Adapter nos protege de cambios en la API externa y centraliza
 * toda la lógica de transformación de datos en un solo lugar.
 */

import { Launch, RocketDetail, LaunchpadDetail } from '@/types/launch.types';

export class SpaceXDataAdapter {

    // ===== UTILIDADES DE FECHAS =====

    /**
     * Normaliza fechas de diferentes formatos a objetos Date consistentes
     * La API de SpaceX puede devolver fechas en varios formatos
     */
    static normalizeDate(dateString: string | Date): Date {
        return new Date(dateString);
    }

    // ===== TRANSFORMACIÓN DE ESTADOS =====

    /**
     * Transforma el estado de lanzamiento a formato amigable para la UI
     *
     * Convierte los valores booleanos/null de la API en:
     * - Estados legibles en español
     * - Colores consistentes para cada estado
     * - Categorización simple para filtros
     *
     * @param launch - Datos del lanzamiento
     * @returns Objeto con estado normalizado, texto y color
     */
    static getLaunchStatusDisplay(launch: Launch): {
        status: 'success' | 'failed' | 'upcoming' | 'unknown';
        displayText: string;
        color: string;
    } {
        // Lanzamientos futuros - prioridad más alta
        if (launch.upcoming) {
            return {
                status: 'upcoming',
                displayText: 'Próximo',
                color: '#3B82F6' // blue-500: color principal de la app
            };
        }

        // Lanzamientos exitosos - feedback positivo
        if (launch.success === true) {
            return {
                status: 'success',
                displayText: 'Exitoso',
                color: '#10B981' // green-500: éxito claro
            };
        }

        // Lanzamientos fallidos - feedback de error
        if (launch.success === false) {
            return {
                status: 'failed',
                displayText: 'Fallido',
                color: '#EF4444' // red-500: error evidente
            };
        }

        // Estado indeterminado - casos edge
        return {
            status: 'unknown',
            displayText: 'Desconocido',
            color: '#6B7280' // gray-500: neutral
        };
    }

    /**
     * Calcula tiempo relativo desde/hasta el lanzamiento en formato legible
     */
    static getRelativeTime(launch: Launch): {
        timeText: string;
        isCountdown: boolean;
        isPast: boolean;
    } {
        const now = new Date();
        const launchDate = new Date(launch.date_utc);
        const diffMs = launchDate.getTime() - now.getTime();
        const isCountdown = diffMs > 0;
        const isPast = diffMs < 0;

        const absDiffMs = Math.abs(diffMs);
        const days = Math.floor(absDiffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((absDiffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((absDiffMs % (1000 * 60 * 60)) / (1000 * 60));

        let timeText = '';

        if (isPast) {
            // Para lanzamientos pasados, usar formato más natural
            if (days === 0) {
                if (hours === 0) {
                    timeText = minutes === 1 ? 'Hace 1 minuto' : `Hace ${minutes} minutos`;
                } else {
                    timeText = hours === 1 ? 'Hace 1 hora' : `Hace ${hours} horas`;
                }
            } else if (days === 1) {
                timeText = 'Hace 1 día';
            } else if (days < 7) {
                timeText = `Hace ${days} días`;
            } else if (days < 30) {
                const weeks = Math.floor(days / 7);
                timeText = weeks === 1 ? 'Hace 1 semana' : `Hace ${weeks} semanas`;
            } else if (days < 365) {
                const months = Math.floor(days / 30);
                timeText = months === 1 ? 'Hace 1 mes' : `Hace ${months} meses`;
            } else {
                const years = Math.floor(days / 365);
                timeText = years === 1 ? 'Hace 1 año' : `Hace ${years} años`;
            }
        } else if (isCountdown) {
            // Para lanzamientos futuros, mantener formato de countdown pero más claro
            if (days === 0) {
                if (hours === 0) {
                    timeText = minutes === 1 ? 'En 1 minuto' : `En ${minutes} minutos`;
                } else {
                    timeText = hours === 1 ? 'En 1 hora' : `En ${hours} horas`;
                }
            } else if (days === 1) {
                timeText = 'En 1 día';
            } else {
                timeText = `En ${days} días`;
            }
        } else {
            // Caso exacto (muy raro)
            timeText = 'Ahora mismo';
        }

        return { timeText, isCountdown, isPast };
    }

    /**
     * Extrae información resumida del cohete
     */
    static getRocketSummary(rocket: RocketDetail): {
        name: string;
        heightText: string;
        description: string;
    } {
        const heightText = rocket.height?.meters
            ? `${rocket.height.meters}m (${rocket.height.feet}ft)`
            : 'Altura no disponible';

        return {
            name: rocket.name,
            heightText,
            description: rocket.description || 'Sin descripción disponible'
        };
    }

    /**
     * Procesa enlaces y los categoriza
     */
    static processLaunchLinks(launch: Launch): {
        primary: Array<{type: string, url: string, label: string}>;
        media: Array<{type: string, url: string, label: string}>;
        social: Array<{type: string, url: string, label: string}>;
    } {
        const primary = [];
        const media = [];
        const social = [];

        if (launch.links?.webcast) {
            media.push({
                type: 'webcast',
                url: launch.links.webcast,
                label: 'Ver Transmisión'
            });
        }

        if (launch.links?.article) {
            primary.push({
                type: 'article',
                url: launch.links.article,
                label: 'Leer Artículo'
            });
        }

        if (launch.links?.wikipedia) {
            primary.push({
                type: 'wikipedia',
                url: launch.links.wikipedia,
                label: 'Wikipedia'
            });
        }

        if (launch.links?.reddit?.campaign) {
            social.push({
                type: 'reddit',
                url: launch.links.reddit.campaign,
                label: 'Reddit Campaign'
            });
        }

        return { primary, media, social };
    }
}
