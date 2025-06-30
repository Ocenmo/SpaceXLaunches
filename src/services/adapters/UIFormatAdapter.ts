import { Launch } from '@/types/launch.types';

/**
 * Adapter para formatear datos para visualización en la UI
 */
export class UIFormatAdapter {
    /**
     * Formatea números grandes con separadores
     */
    static formatNumber(num: number): string {
        return new Intl.NumberFormat('es-ES').format(num);
    }

    /**
     * Formatea fechas en diferentes estilos
     */
    static formatDate(date: Date, style: 'short' | 'medium' | 'long' | 'relative' = 'medium'): string {
        switch (style) {
            case 'short':
                return date.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                });
            case 'medium':
                return date.toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            case 'long':
                return date.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            case 'relative':
                return this.getRelativeDate(date);
            default:
                return date.toLocaleDateString('es-ES');
        }
    }

    /**
     * Calcula tiempo relativo más detallado (hace X días, en X días)
     */
    private static getRelativeDate(date: Date): string {
        const now = new Date();
        const diffMs = date.getTime() - now.getTime();
        const absDiffMs = Math.abs(diffMs);
        const diffDays = Math.floor(absDiffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(absDiffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor(absDiffMs / (1000 * 60));

        // Fechas futuras
        if (diffMs > 0) {
            if (diffDays === 0) {
                if (diffHours === 0) {
                    return diffMinutes <= 1 ? 'En un momento' : `En ${diffMinutes} minutos`;
                }
                return diffHours === 1 ? 'En 1 hora' : `En ${diffHours} horas`;
            }
            if (diffDays === 1) return 'Mañana';
            if (diffDays < 7) return `En ${diffDays} días`;
            if (diffDays < 30) {
                const weeks = Math.floor(diffDays / 7);
                return weeks === 1 ? 'En 1 semana' : `En ${weeks} semanas`;
            }
            if (diffDays < 365) {
                const months = Math.floor(diffDays / 30);
                return months === 1 ? 'En 1 mes' : `En ${months} meses`;
            }
            const years = Math.floor(diffDays / 365);
            return years === 1 ? 'En 1 año' : `En ${years} años`;
        }

        // Fechas pasadas
        if (diffMs < 0) {
            if (diffDays === 0) {
                if (diffHours === 0) {
                    return diffMinutes <= 1 ? 'Hace un momento' : `Hace ${diffMinutes} minutos`;
                }
                return diffHours === 1 ? 'Hace 1 hora' : `Hace ${diffHours} horas`;
            }
            if (diffDays === 1) return 'Ayer';
            if (diffDays < 7) return `Hace ${diffDays} días`;
            if (diffDays < 30) {
                const weeks = Math.floor(diffDays / 7);
                return weeks === 1 ? 'Hace 1 semana' : `Hace ${weeks} semanas`;
            }
            if (diffDays < 365) {
                const months = Math.floor(diffDays / 30);
                return months === 1 ? 'Hace 1 mes' : `Hace ${months} meses`;
            }
            const years = Math.floor(diffDays / 365);
            return years === 1 ? 'Hace 1 año' : `Hace ${years} años`;
        }

        // Fecha exacta
        return 'Ahora mismo';
    }

    /**
     * Trunca texto con elipsis
     */
    static truncateText(text: string, maxLength: number = 100): string {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }

    /**
     * Genera colores consistentes para estados
     */
    static getStatusColor(status: string): {
        background: string;
        text: string;
        border: string;
    } {
        const colors = {
            success: {
                background: '#dcfce7',
                text: '#166534',
                border: '#bbf7d0'
            },
            failed: {
                background: '#fef2f2',
                text: '#dc2626',
                border: '#fecaca'
            },
            upcoming: {
                background: '#dbeafe',
                text: '#1d4ed8',
                border: '#bfdbfe'
            },
            unknown: {
                background: '#f3f4f6',
                text: '#374151',
                border: '#d1d5db'
            }
        };

        return colors[status as keyof typeof colors] || colors.unknown;
    }

    /**
     * Convierte bytes a formato legible
     */
    static formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    }

    /**
     * Genera iniciales de un nombre
     */
    static getInitials(name: string): string {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    }

    /**
     * Formatea URLs para mostrar solo el dominio
     */
    static formatUrl(url: string): string {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.replace('www.', '');
        } catch {
            return url;
        }
    }

    /**
     * Calcula progreso como porcentaje
     */
    static calculateProgress(current: number, total: number): {
        percentage: number;
        formatted: string;
    } {
        const percentage = total > 0 ? (current / total) * 100 : 0;
        return {
            percentage: Math.min(Math.max(percentage, 0), 100),
            formatted: `${Math.round(percentage)}%`
        };
    }
}
