/**
 * Servicio de API para interactuar con la API oficial de SpaceX
 *
 * Este servicio implementa la capa de acceso a datos externos, manejando:
 * - Configuración de cliente HTTP con timeouts y base URL
 * - Validación de datos usando esquemas Zod
 * - Manejo de errores robusto con mensajes descriptivos
 * - Abstracción de la API externa para el resto de la aplicación
 *
 * Beneficios del diseño:
 * - Facilita testing con implementaciones mock
 * - Centraliza configuración de la API
 * - Proporciona type safety con validación en runtime
 * - Separa concerns entre networking y lógica de negocio
 */

import axios, { AxiosInstance } from 'axios';
import {
    Launch,
    RocketDetail,
    LaunchpadDetail,
    LaunchSchema,
    RocketDetailSchema,
    LaunchpadDetailSchema
} from '@/types/launch.types';

/**
 * Interfaz que define el contrato del servicio de API
 * Permite implementaciones alternativas (mock, cache, etc.)
 */
export interface IApiService {
    getLaunches(): Promise<Launch[]>;                          // Obtener todos los lanzamientos
    getLaunchById(id: string): Promise<Launch>;                // Obtener lanzamiento específico
    getRocketById(id: string): Promise<RocketDetail>;          // Obtener detalles de cohete
    getLaunchpadById(id: string): Promise<LaunchpadDetail>;    // Obtener detalles de plataforma
}

/**
 * Implementación concreta del servicio que consume la API oficial de SpaceX
 */
export class SpaceXApiService implements IApiService {
    private Client: AxiosInstance;

    constructor() {
        // Configurar cliente HTTP con settings optimizados
        this.Client = axios.create({
            baseURL: 'https://api.spacexdata.com/v4',    // API v4 es la más estable y completa
            timeout: 10000,                              // 10 segundos - balance entre UX y reliability
        });
    }

    /**
     * Obtiene todos los lanzamientos desde la API
     * Aplica validación de esquema a cada elemento para garantizar type safety
     */
    async getLaunches(): Promise<Launch[]> {
        try {
            const response = await this.Client.get('/launches');
            // Validar y transformar cada lanzamiento con Zod para runtime safety
            return response.data.map((launch: any) => LaunchSchema.parse(launch));
        } catch (error) {
            // Error handling descriptivo para debugging
            throw new Error(`Error fetching launches: ${error}`);
        }
    }

    /**
     * Obtiene un lanzamiento específico por su ID
     * @param id - ID único del lanzamiento en la base de datos de SpaceX
     */
    async getLaunchById(id: string): Promise<Launch> {
        try {
            const response = await this.Client.get(`/launches/${id}`);
            // Validación individual - crítica para datos de detalle
            return LaunchSchema.parse(response.data);
        } catch (error) {
            throw new Error(`Error fetching launch by ID ${id}: ${error}`);
        }
    }

    /**
     * Obtiene detalles técnicos de un cohete específico
     * @param id - ID único del cohete (referenciado desde Launch.rocket)
     */
    async getRocketById(id: string): Promise<RocketDetail> {
        try {
            const response = await this.Client.get(`/rockets/${id}`);
            // Usar esquema específico para datos de cohetes
            return RocketDetailSchema.parse(response.data);
        } catch (error) {
            throw new Error(`Error fetching rocket by ID ${id}: ${error}`);
        }
    }

    /**
     * Obtiene información de una plataforma de lanzamiento
     * @param id - ID único de la plataforma (referenciado desde Launch.launchpad)
     */
    async getLaunchpadById(id: string): Promise<LaunchpadDetail> {
        try {
            const response = await this.Client.get(`/launchpads/${id}`);
            // Esquema específico para validar datos de plataformas
            return LaunchpadDetailSchema.parse(response.data);
        } catch (error) {
            throw new Error(`Error fetching launchpad by ID ${id}: ${error}`);
        }
    }
}