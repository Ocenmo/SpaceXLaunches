/**
 * Adapter para manejo y optimización de imágenes
 */
export class ImageAdapter {
    /**
     * URLs por defecto para imágenes faltantes
     */
    private static readonly DEFAULT_IMAGES = {
        patch: 'https://via.placeholder.com/300x300/1f2937/ffffff?text=SpaceX',
        rocket: 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Rocket',
        launchpad: 'https://via.placeholder.com/800x400/1f2937/ffffff?text=Launchpad',
        mission: 'https://via.placeholder.com/600x400/1f2937/ffffff?text=Mission'
    };

    /**
     * Obtiene la URL de imagen con fallback
     */
    static getImageWithFallback(
        imageUrl: string | null | undefined,
        type: keyof typeof ImageAdapter.DEFAULT_IMAGES = 'mission'
    ): string {
        if (!imageUrl || !this.isValidImageUrl(imageUrl)) {
            return this.DEFAULT_IMAGES[type];
        }
        return imageUrl;
    }

    /**
     * Valida si una URL es una imagen válida
     */
    static isValidImageUrl(url: string): boolean {
        if (!url || typeof url !== 'string') return false;

        try {
            new URL(url);
            // Verificar extensiones de imagen comunes
            const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
            return imageExtensions.test(url) || url.includes('imgur') || url.includes('flickr');
        } catch {
            return false;
        }
    }

    /**
     * Optimiza URL de imagen según el tamaño requerido
     */
    static optimizeImageUrl(url: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
        if (!url) return url;

        // Para Flickr, podemos cambiar el sufijo para diferentes tamaños
        if (url.includes('flickr.com')) {
            const sizeMap = {
                small: '_m.jpg',    // 240px
                medium: '_c.jpg',   // 800px
                large: '_b.jpg'     // 1024px
            };

            // Reemplazar el sufijo existente
            return url.replace(/_[a-z]\.jpg$/i, sizeMap[size]);
        }

        // Para otras APIs que soporten parámetros de tamaño
        if (url.includes('spacexdata.com')) {
            const sizeParam = {
                small: '?w=300',
                medium: '?w=600',
                large: '?w=1200'
            };

            return url + (url.includes('?') ? '&' : '') + sizeParam[size].substring(1);
        }

        return url;
    }

    /**
     * Genera URLs de diferentes tamaños para patches de misión
     */
    static getPatchImages(patchData: { small?: string | null; large?: string | null }) {
        return {
            small: this.getImageWithFallback(patchData.small, 'patch'),
            medium: this.optimizeImageUrl(
                this.getImageWithFallback(patchData.large || patchData.small, 'patch'),
                'medium'
            ),
            large: this.getImageWithFallback(patchData.large, 'patch')
        };
    }

    /**
     * Procesa galería de imágenes con fallbacks
     */
    static processImageGallery(images: string[]): Array<{
        original: string;
        thumbnail: string;
        alt: string;
    }> {
        if (!Array.isArray(images) || images.length === 0) {
            return [{
                original: this.DEFAULT_IMAGES.mission,
                thumbnail: this.optimizeImageUrl(this.DEFAULT_IMAGES.mission, 'small'),
                alt: 'Imagen por defecto de misión SpaceX'
            }];
        }

        return images
            .filter(this.isValidImageUrl)
            .map((url, index) => ({
                original: url,
                thumbnail: this.optimizeImageUrl(url, 'small'),
                alt: `Imagen de misión ${index + 1}`
            }));
    }

    /**
     * Calcula aspect ratio de una imagen
     */
    static calculateAspectRatio(width: number, height: number): {
        ratio: number;
        className: string;
        description: string;
    } {
        const ratio = width / height;

        if (ratio > 1.5) {
            return {
                ratio,
                className: 'aspect-video', // 16:9
                description: 'Panorámica'
            };
        } else if (ratio > 1.1) {
            return {
                ratio,
                className: 'aspect-[4/3]', // 4:3
                description: 'Landscape'
            };
        } else if (ratio > 0.9) {
            return {
                ratio,
                className: 'aspect-square', // 1:1
                description: 'Cuadrada'
            };
        } else {
            return {
                ratio,
                className: 'aspect-[3/4]', // 3:4
                description: 'Retrato'
            };
        }
    }

    /**
     * Genera srcSet para imágenes responsivas
     */
    static generateSrcSet(baseUrl: string): string {
        if (!baseUrl) return '';

        const sizes = [
            { width: 300, suffix: 'small' },
            { width: 600, suffix: 'medium' },
            { width: 1200, suffix: 'large' }
        ];

        return sizes
            .map(size => `${this.optimizeImageUrl(baseUrl, size.suffix as any)} ${size.width}w`)
            .join(', ');
    }

    /**
     * Determina el tamaño de imagen apropiado según el dispositivo
     */
    static getResponsiveImageSize(containerWidth: number): 'small' | 'medium' | 'large' {
        if (containerWidth <= 400) return 'small';
        if (containerWidth <= 800) return 'medium';
        return 'large';
    }

    /**
     * Extrae colores dominantes de una URL de imagen (simulado)
     */
    static extractDominantColors(imageUrl: string): {
        primary: string;
        secondary: string;
        accent: string;
    } {
        // En una implementación real, usarías una librería como color-thief
        // Para este ejemplo, devolvemos colores de SpaceX
        const spaceXColors = [
            { primary: '#000000', secondary: '#ffffff', accent: '#005288' },
            { primary: '#1a1a1a', secondary: '#f5f5f5', accent: '#0066cc' },
            { primary: '#2d3748', secondary: '#edf2f7', accent: '#3182ce' }
        ];

        // Simular extracción basada en hash de URL
        const hash = imageUrl.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);

        return spaceXColors[Math.abs(hash) % spaceXColors.length];
    }

    /**
     * Genera placeholder SVG con texto
     */
    static generatePlaceholderSvg(
        width: number = 400,
        height: number = 300,
        text: string = 'SpaceX'
    ): string {
        return `data:image/svg+xml;base64,${btoa(`
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#1f2937"/>
                <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24"
                      fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
                    ${text}
                </text>
            </svg>
        `)}`;
    }
}
