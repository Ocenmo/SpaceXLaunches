/**
 * Servicio principal para gestión de lanzamientos SpaceX
 *
 * Esta clase actúa como el punto central de la lógica de negocio para todo lo relacionado
 * con lanzamientos. Implementa el patrón Service Layer, separando la lógica de negocio
 * de los detalles de implementación del repositorio y proporcionando una API limpia
 * para los componentes de React.
 *
 * Responsabilidades:
 * - Coordinar operaciones entre repositorios y adapters
 * - Implementar lógica de filtrado y ordenamiento
 * - Enriquecer datos con información adicional
 * - Proporcionar métodos de búsqueda segura
 * - Mantener una interfaz consistente para la UI
 */

import { ILaunchRepository } from "./repositories/LaunchRepositorie";
import { Launch, SortOption, FilterOption } from "@/types/launch.types";
import { SpaceXDataAdapter, UIFormatAdapter } from "./adapters";

export class LaunchService {
    /**
     * Constructor que recibe una implementación del repositorio
     * Esto permite inyección de dependencias y facilita el testing
     */
    constructor(private repository: ILaunchRepository) {}

    // ===== MÉTODOS DE OBTENCIÓN DE DATOS =====

    /**
     * Obtiene todos los lanzamientos pasados
     * Delega al repositorio la responsabilidad de la obtención de datos
     */
    async getPastLaunches(): Promise<Launch[]> {
        return this.repository.getPastLaunches();
    }

    /**
     * Obtiene todos los lanzamientos futuros programados
     * Incluye tanto fechas confirmadas como tentativas (TBD)
     */
    async getUpcomingLaunches(): Promise<Launch[]> {
        return this.repository.getUpcomingLaunches();
    }

    /**
     * Obtiene detalles completos de un lanzamiento específico
     * Enriquece los datos básicos con información de cohetes y plataformas
     *
     * @param id - ID único del lanzamiento
     * @returns Objeto combinado con datos del lanzamiento, cohete y plataforma
     */
    async getLaunchDetails(id: string) {
        // Obtener datos base del lanzamiento
        const launch = await this.repository.getLaunchById(id);

        // Enriquecer con datos relacionados usando las referencias
        const rocket = await this.repository.getRocketById(launch.rocket);
        const launchpad = await this.repository.getLaunchpadById(launch.launchpad);

        return {
            launch,     // Datos completos del lanzamiento
            rocket,     // Información técnica del cohete utilizado
            launchpad   // Detalles de la ubicación de lanzamiento
        };
    }

    // ===== MÉTODOS DE FILTRADO Y ORDENAMIENTO =====

    /**
     * Filtra lanzamientos según el resultado de la misión
     * Proporciona una interfaz simple para mostrar diferentes vistas al usuario
     *
     * @param launches - Array de lanzamientos a filtrar
     * @param filter - Tipo de filtro: 'all', 'success', 'failed'
     * @returns Array filtrado según el criterio especificado
     */
    filterLaunches(launches: Launch[], filter: FilterOption): Launch[] {
        if (filter === 'all') {
            return launches; // Mostrar todos sin filtrar
        }

        return launches.filter(launch => {
            if (filter === 'success') {
                return launch.success === true; // Solo misiones exitosas
            } else if (filter === 'failed') {
                return launch.success === false; // Solo misiones fallidas
            }
            return true; // Fallback (no debería ocurrir con tipos estrictos)
        });
    }

    /**
     * Ordena lanzamientos según diferentes criterios
     * Crea una nueva copia para evitar mutaciones del estado original
     *
     * @param launches - Array de lanzamientos a ordenar
     * @param sort - Criterio de ordenamiento
     * @returns Nuevo array ordenado según el criterio especificado
     */
    sortLaunches(launches: Launch[], sort: SortOption): Launch[] {
        // Crear copia para evitar mutaciones del array original
        return [...launches].sort((a, b) => {
            switch (sort) {
                case 'date_asc':
                    // Cronológico: más antiguos primero (útil para ver el historial)
                    return new Date(a.date_utc).getTime() - new Date(b.date_utc).getTime();

                case 'date_desc':
                    // Cronológico inverso: más recientes primero (vista por defecto)
                    return new Date(b.date_utc).getTime() - new Date(a.date_utc).getTime();

                case 'name_asc':
                    // Alfabético A-Z: útil para buscar misiones específicas
                    return a.name.localeCompare(b.name);

                case 'name_desc':
                    // Alfabético Z-A: menos común pero disponible por completitud
                    return b.name.localeCompare(a.name);

                default:
                    // Sin ordenamiento (mantener orden original)
                    return 0;
            }
        });
    }

    // ===== MÉTODOS DE ENRIQUECIMIENTO DE DATOS =====

    /**
     * Obtiene lanzamientos con datos enriquecidos usando adapters
     * Combina datos base con información procesada para la UI
     *
     * Esta función demuestra cómo los adapters agregan valor:
     * - statusDisplay: Estado legible para el usuario ("Éxito", "Fallo", "Próximo")
     * - relativeTime: Tiempo relativo ("hace 2 días", "en 3 semanas")
     * - formattedDate: Fecha formateada según preferencias locales
     *
     * @param type - Tipo de lanzamientos: 'past' o 'upcoming'
     * @returns Array de lanzamientos con datos adicionales para la UI
     */
    async getEnrichedLaunches(type: 'past' | 'upcoming'): Promise<Array<Launch & {
        statusDisplay: ReturnType<typeof SpaceXDataAdapter.getLaunchStatusDisplay>;
        relativeTime: ReturnType<typeof SpaceXDataAdapter.getRelativeTime>;
        formattedDate: string;
    }>> {
        // Obtener datos base según el tipo solicitado
        const launches = type === 'past'
            ? await this.getPastLaunches()
            : await this.getUpcomingLaunches();

        // Enriquecer cada lanzamiento con datos procesados
        return launches.map(launch => ({
            ...launch,                                                           // Datos originales del lanzamiento
            statusDisplay: SpaceXDataAdapter.getLaunchStatusDisplay(launch),     // Estado formateado para UI
            relativeTime: SpaceXDataAdapter.getRelativeTime(launch),             // Tiempo relativo legible
            formattedDate: UIFormatAdapter.formatDate(launch.date_utc, 'long')   // Fecha completa formateada
        }));
    }

    // ===== MÉTODOS DE BÚSQUEDA =====

    /**
     * Busca lanzamientos con entrada sanitizada
     * Implementa búsqueda case-insensitive en nombre y descripción
     *
     * @param launches - Array de lanzamientos donde buscar
     * @param query - Término de búsqueda (se sanitiza automáticamente)
     * @returns Array filtrado con coincidencias
     */
    searchLaunches(launches: Launch[], query: string): Launch[] {
        // Sanitizar entrada del usuario para evitar problemas
        const cleanQuery = query.trim().toLowerCase();

        // Si no hay término de búsqueda válido, retornar todo
        if (!cleanQuery) return launches;

        // Buscar en campos relevantes del lanzamiento
        return launches.filter(launch => {
            return (
                // Búsqueda en el nombre de la misión (campo principal)
                launch.name.toLowerCase().includes(cleanQuery) ||
                // Búsqueda en la descripción detallada (si existe)
                (launch.details && launch.details.toLowerCase().includes(cleanQuery))
            );
        });
    }

    /**
     * Alias para compatibilidad hacia atrás
     * Mantiene la interfaz anterior mientras se migra el código
     * @deprecated Usar searchLaunches() directamente
     */
    searchLaunchesSecure(launches: Launch[], query: string): Launch[] {
        return this.searchLaunches(launches, query);
    }
}
