import { ILaunchRepository } from "./repositories/LaunchRepositorie";
import { Launch, SortOption, FilterOption } from "@/types/launch.types";

export class LaunchService { // Define una clase llamada LaunchService
    constructor(private repository: ILaunchRepository) {} // Constructor que recibe un repositorio y lo guarda como propiedad privada

    async getPastLaunches(): Promise<Launch[]> { // Método asíncrono que retorna lanzamientos pasados
        return this.repository.getPastLaunches(); // Llama al método del repositorio para obtener lanzamientos pasados
    }

    async getUpcomingLaunches(): Promise<Launch[]> { // Método asíncrono que retorna lanzamientos futuros
        return this.repository.getUpcomingLaunches(); // Llama al método del repositorio para obtener lanzamientos futuros
    }

    async getLaunchesDetails(id: string) { // Método asíncrono que retorna detalles de un lanzamiento por id
        const launch = await this.repository.getLaunchById(id); // Obtiene el lanzamiento por id
        const rocket = await this.repository.getRocketById(launch.rocket); // Obtiene detalles del cohete usando el id del lanzamiento
        const launchpad = await this.repository.getLaunchpadById(launch.launchpad); // Obtiene detalles de la plataforma de lanzamiento

        return {
            ...launch, // Copia todas las propiedades del lanzamiento
            rocket,    // Añade los detalles del cohete
            launchpad  // Añade los detalles de la plataforma
        };
    }

    filterLaunches(launches: Launch[], filter: FilterOption): Launch[] { // Filtra lanzamientos según una opción
        if (filter === 'all') { // Si el filtro es 'all', retorna todos los lanzamientos
            return launches;
        }

        return launches.filter(launch => { // Filtra el array según el filtro
            if (filter === 'success') { // Si el filtro es 'success'
                return launch.success === true; // Retorna solo los exitosos
            } else if (filter === 'failed') { // Si el filtro es 'failed'
                return launch.success === false; // Retorna solo los fallidos
            }
            return true; // Caso por defecto, retorna todos (no debería ocurrir)
        });
    }

    sortLaunches(launches: Launch[], sort: SortOption): Launch[] { // Ordena lanzamientos según una opción
        // Crea una copia del array original para no modificarlo directamente
        return [...launches].sort((a, b) => {
            // Selecciona el tipo de ordenamiento según la opción recibida
            switch (sort) {
                case 'date_asc':
                    // Ordena por fecha ascendente (más antigua primero)
                    return new Date(a.date_utc).getTime() - new Date(b.date_utc).getTime();
                case 'date_desc':
                    // Ordena por fecha descendente (más reciente primero)
                    return new Date(b.date_utc).getTime() - new Date(a.date_utc).getTime();
                case 'name_asc':
                    // Ordena por nombre en orden alfabético ascendente (A-Z)
                    return a.name.localeCompare(b.name);
                case 'name_desc':
                    // Ordena por nombre en orden alfabético descendente (Z-A)
                    return b.name.localeCompare(a.name);
                default:
                    // Si no se especifica una opción válida, no ordena
                    return 0;
            }
        });
    }

    searchLaunches(launches: Launch[], query: string): Launch[] {
        if (!query.trim()) return launches;

        const searchTerm = query.toLowerCase();
        return launches.filter(launch => {
            return (
                launch.name.toLowerCase().includes(searchTerm) ||
                (launch.details && launch.details.toLowerCase().includes(searchTerm))
            );
        });
    }
}
