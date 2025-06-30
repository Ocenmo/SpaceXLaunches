import { Launch, RocketDetail, LaunchpadDetail } from '@/types/launch.types';

/**
 * Adapter para validar y limpiar datos antes de procesarlos
 */
export class DataValidationAdapter {
    /**
     * Valida y limpia datos de lanzamiento
     */
    static validateLaunch(launch: any): {
        isValid: boolean;
        cleanedData: Partial<Launch> | null;
        errors: string[];
    } {
        const errors: string[] = [];
        const cleanedData: any = {};

        // Validar campos obligatorios
        if (!launch.id || typeof launch.id !== 'string') {
            errors.push('ID de lanzamiento inválido');
        } else {
            cleanedData.id = launch.id.trim();
        }

        if (!launch.name || typeof launch.name !== 'string') {
            errors.push('Nombre de lanzamiento inválido');
        } else {
            cleanedData.name = this.cleanString(launch.name);
        }

        // Validar fecha
        if (!launch.date_utc) {
            errors.push('Fecha de lanzamiento requerida');
        } else {
            const date = new Date(launch.date_utc);
            if (isNaN(date.getTime())) {
                errors.push('Fecha de lanzamiento inválida');
            } else {
                cleanedData.date_utc = date;
            }
        }

        // Validar número de vuelo
        if (typeof launch.flight_number !== 'number' || launch.flight_number < 1) {
            errors.push('Número de vuelo inválido');
        } else {
            cleanedData.flight_number = launch.flight_number;
        }

        // Limpiar campos opcionales
        cleanedData.details = launch.details ? this.cleanString(launch.details) : null;
        cleanedData.upcoming = Boolean(launch.upcoming);
        cleanedData.success = launch.success === null ? null : Boolean(launch.success);

        return {
            isValid: errors.length === 0,
            cleanedData: errors.length === 0 ? cleanedData : null,
            errors
        };
    }

    /**
     * Limpia y normaliza strings
     */
    private static cleanString(str: string): string {
        return str
            .trim()
            .replace(/\s+/g, ' ') // Múltiples espacios -> un espacio
            .replace(/[\r\n\t]/g, ' ') // Saltos de línea -> espacios
            .substring(0, 1000); // Limitar longitud
    }

    /**
     * Valida URLs
     */
    static validateUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Limpia y valida enlaces de lanzamiento
     */
    static cleanLaunchLinks(links: any): any {
        if (!links || typeof links !== 'object') return {};

        const cleanedLinks: any = {};

        // Validar enlaces principales
        if (links.webcast && this.validateUrl(links.webcast)) {
            cleanedLinks.webcast = links.webcast;
        }

        if (links.article && this.validateUrl(links.article)) {
            cleanedLinks.article = links.article;
        }

        if (links.wikipedia && this.validateUrl(links.wikipedia)) {
            cleanedLinks.wikipedia = links.wikipedia;
        }

        // Limpiar patch images
        if (links.patch && typeof links.patch === 'object') {
            cleanedLinks.patch = {};
            if (links.patch.small && this.validateUrl(links.patch.small)) {
                cleanedLinks.patch.small = links.patch.small;
            }
            if (links.patch.large && this.validateUrl(links.patch.large)) {
                cleanedLinks.patch.large = links.patch.large;
            }
        }

        // Limpiar flickr images
        if (links.flickr && typeof links.flickr === 'object') {
            cleanedLinks.flickr = {
                small: Array.isArray(links.flickr.small)
                    ? links.flickr.small.filter(this.validateUrl)
                    : [],
                original: Array.isArray(links.flickr.original)
                    ? links.flickr.original.filter(this.validateUrl)
                    : []
            };
        }

        return cleanedLinks;
    }

    /**
     * Valida formato de email
     */
    static validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Sanitiza input del usuario para búsquedas
     */
    static sanitizeSearchInput(input: string): string {
        return input
            .trim()
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Solo letras, números, espacios y guiones
            .substring(0, 100); // Limitar longitud
    }

    /**
     * Valida rangos de fechas
     */
    static validateDateRange(startDate: Date, endDate: Date): {
        isValid: boolean;
        error?: string;
    } {
        if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
            return { isValid: false, error: 'Fechas inválidas' };
        }

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return { isValid: false, error: 'Fechas inválidas' };
        }

        if (startDate > endDate) {
            return { isValid: false, error: 'La fecha de inicio debe ser anterior a la fecha final' };
        }

        // Validar que no sea muy en el futuro (más de 10 años)
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 10);

        if (endDate > maxDate) {
            return { isValid: false, error: 'Fecha demasiado lejana en el futuro' };
        }

        return { isValid: true };
    }

    /**
     * Limpia y valida números
     */
    static cleanNumber(value: any, options: {
        min?: number;
        max?: number;
        defaultValue?: number;
    } = {}): number | null {
        const num = parseFloat(value);

        if (isNaN(num)) {
            return options.defaultValue ?? null;
        }

        if (options.min !== undefined && num < options.min) {
            return options.min;
        }

        if (options.max !== undefined && num > options.max) {
            return options.max;
        }

        return num;
    }
}
