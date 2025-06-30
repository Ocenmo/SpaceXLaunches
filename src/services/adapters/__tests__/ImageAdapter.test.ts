import { ImageAdapter } from '../ImageAdapter';

describe('ImageAdapter', () => {
    describe('getImageWithFallback', () => {
        it('should return original URL for valid images', () => {
            const validUrl = 'https://example.com/image.jpg';
            const result = ImageAdapter.getImageWithFallback(validUrl);

            expect(result).toBe(validUrl);
        });

        it('should return fallback for invalid URLs', () => {
            const invalidUrl = 'not-a-url';
            const result = ImageAdapter.getImageWithFallback(invalidUrl, 'patch');

            expect(result).toContain('placeholder');
            expect(result).toContain('SpaceX');
        });

        it('should return fallback for null/undefined', () => {
            const result1 = ImageAdapter.getImageWithFallback(null);
            const result2 = ImageAdapter.getImageWithFallback(undefined);

            expect(result1).toContain('placeholder');
            expect(result2).toContain('placeholder');
        });
    });

    describe('isValidImageUrl', () => {
        it('should validate image URLs correctly', () => {
            const validUrls = [
                'https://example.com/image.jpg',
                'https://example.com/image.png',
                'https://flickr.com/photo123',
                'https://imgur.com/abc123'
            ];

            validUrls.forEach(url => {
                expect(ImageAdapter.isValidImageUrl(url)).toBe(true);
            });
        });

        it('should reject invalid URLs', () => {
            const invalidUrls = [
                'not-a-url',
                '',
                null,
                undefined,
                'https://example.com/document.pdf'
            ];

            invalidUrls.forEach(url => {
                expect(ImageAdapter.isValidImageUrl(url as any)).toBe(false);
            });
        });
    });

    describe('optimizeImageUrl', () => {
        it('should optimize Flickr URLs', () => {
            const flickrUrl = 'https://flickr.com/photo_o.jpg';

            const small = ImageAdapter.optimizeImageUrl(flickrUrl, 'small');
            const medium = ImageAdapter.optimizeImageUrl(flickrUrl, 'medium');
            const large = ImageAdapter.optimizeImageUrl(flickrUrl, 'large');

            expect(small).toContain('_m.jpg');
            expect(medium).toContain('_c.jpg');
            expect(large).toContain('_b.jpg');
        });

        it('should handle non-Flickr URLs', () => {
            const regularUrl = 'https://example.com/image.jpg';
            const result = ImageAdapter.optimizeImageUrl(regularUrl, 'medium');

            expect(result).toBe(regularUrl);
        });
    });

    describe('getPatchImages', () => {
        it('should generate patch images with fallbacks', () => {
            const patchData = {
                small: 'https://example.com/patch-small.png',
                large: 'https://example.com/patch-large.png'
            };

            const result = ImageAdapter.getPatchImages(patchData);

            expect(result.small).toBe(patchData.small);
            expect(result.large).toBe(patchData.large);
            expect(result.medium).toContain('example.com');
        });

        it('should handle missing patch data', () => {
            const emptyPatchData = { small: null, large: null };
            const result = ImageAdapter.getPatchImages(emptyPatchData);

            expect(result.small).toContain('placeholder');
            expect(result.medium).toContain('placeholder');
            expect(result.large).toContain('placeholder');
        });
    });

    describe('processImageGallery', () => {
        it('should process valid image arrays', () => {
            const images = [
                'https://example.com/image1.jpg',
                'https://example.com/image2.png'
            ];

            const result = ImageAdapter.processImageGallery(images);

            expect(result).toHaveLength(2);
            expect(result[0].original).toBe(images[0]);
            expect(result[0].alt).toContain('Imagen de misión 1');
        });

        it('should handle empty arrays with fallback', () => {
            const result = ImageAdapter.processImageGallery([]);

            expect(result).toHaveLength(1);
            expect(result[0].original).toContain('placeholder');
            expect(result[0].alt).toContain('por defecto');
        });

        it('should filter invalid URLs', () => {
            const mixedImages = [
                'https://example.com/valid.jpg',
                'invalid-url',
                'https://example.com/another-valid.png'
            ];

            const result = ImageAdapter.processImageGallery(mixedImages);

            expect(result).toHaveLength(2);
            expect(result.every(img => img.original.includes('example.com'))).toBe(true);
        });
    });

    describe('calculateAspectRatio', () => {
        it('should calculate video aspect ratio', () => {
            const result = ImageAdapter.calculateAspectRatio(1920, 1080);

            expect(result.className).toBe('aspect-video');
            expect(result.description).toBe('Panorámica');
            expect(result.ratio).toBeCloseTo(1.78);
        });

        it('should calculate square aspect ratio', () => {
            const result = ImageAdapter.calculateAspectRatio(500, 500);

            expect(result.className).toBe('aspect-square');
            expect(result.description).toBe('Cuadrada');
            expect(result.ratio).toBe(1);
        });

        it('should calculate portrait aspect ratio', () => {
            const result = ImageAdapter.calculateAspectRatio(300, 400);

            expect(result.className).toBe('aspect-[3/4]');
            expect(result.description).toBe('Retrato');
            expect(result.ratio).toBe(0.75);
        });
    });

    describe('getResponsiveImageSize', () => {
        it('should return correct size for different container widths', () => {
            expect(ImageAdapter.getResponsiveImageSize(300)).toBe('small');
            expect(ImageAdapter.getResponsiveImageSize(600)).toBe('medium');
            expect(ImageAdapter.getResponsiveImageSize(1200)).toBe('large');
        });
    });

    describe('generatePlaceholderSvg', () => {
        it('should generate valid SVG data URL', () => {
            const result = ImageAdapter.generatePlaceholderSvg(400, 300, 'Test');

            expect(result).toMatch(/^data:image\/svg\+xml;base64,/);
            expect(result.length).toBeGreaterThan(100);
        });
    });
});
