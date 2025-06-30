/**
 * Hook de inyección de dependencias para LaunchService
 *
 * Este hook implementa el patrón de Dependency Injection y Factory Method,
 * configurando automáticamente toda la cadena de dependencias necesaria
 * para el servicio de lanzamientos.
 *
 * Arquitectura que configura:
 * SpaceXApiService → LaunchRepository → LaunchService
 *
 * Beneficios del diseño:
 * - Inyección automática de dependencias
 * - Singleton per component lifecycle (useMemo)
 * - Facilita testing con mock implementations
 * - Separa concerns entre configuración y uso
 * - Abstrae la complejidad de inicialización
 *
 * Uso típico:
 * const launchService = useLaunchService();
 * const launches = await launchService.getPastLaunches();
 */

import { useMemo } from 'react';
import { LaunchService } from '@/services/LaunchService';
import { LaunchRepository } from '@/services/repositories/LaunchRepositorie';
import { SpaceXApiService } from '@/services/api/ApiService';

export const useLaunchService = () => {
    return useMemo(() => {
        // Capa de datos: configurar cliente API con timeout y validación
        const apiService = new SpaceXApiService();

        // Capa de acceso: conectar repositorio con servicio de API
        const repository = new LaunchRepository(apiService);

        // Capa de lógica: crear servicio principal con repositorio configurado
        return new LaunchService(repository);
    }, []); // Array vacío: crear una sola vez por componente

    /**
     * ¿Por qué useMemo?
     * - Evita recrear servicios en cada render (performance)
     * - Mantiene instancia consistente durante vida del componente
     * - Permite cache interno en servicios si se implementa
     * - Patrón singleton a nivel de componente
     */
};