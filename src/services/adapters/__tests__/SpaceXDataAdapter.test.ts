import { SpaceXDataAdapter } from '../SpaceXDataAdapter';
import { Launch } from '@/types/launch.types';

// Mock de datos de lanzamiento para pruebas
const mockLaunch: Launch = {
    id: 'test-launch-1',
    name: 'Test Mission',
    date_utc: new Date('2025-12-25T15:30:00.000Z'),
    upcoming: true,
    success: null,
    flight_number: 100,
    details: 'Test mission details',
    links: {
        webcast: 'https://youtube.com/watch?v=test',
        article: 'https://example.com/article',
        wikipedia: 'https://wikipedia.org/test',
        patch: {
            small: 'https://example.com/patch-small.png',
            large: 'https://example.com/patch-large.png'
        },
        flickr: {
            small: [],
            original: ['https://flickr.com/photo1.jpg']
        },
        presskit: null,
        youtube_id: 'test123',
        reddit: {
            campaign: 'https://reddit.com/campaign',
            launch: null,
            media: null,
            recovery: null
        }
    },
    cores: [],
    failures: [],
    fairings: null,
    crew: [],
    ships: [],
    capsules: [],
    payloads: [],
    launchpad: '5e9e4502f509094188566f88',
    rocket: '5e9d0d95eda69955f709d1eb',
    date_unix: 1735139400,
    date_local: new Date('2025-12-25T10:30:00.000-05:00'),
    date_precision: 'hour',
    auto_update: true,
    tbd: false,
    launch_library_id: null,
    net: false,
    window: 3600,
    static_fire_date_utc: null,
    static_fire_date_unix: null
};

describe('SpaceXDataAdapter', () => {
    describe('getLaunchStatusDisplay', () => {
        it('should return upcoming status for upcoming launches', () => {
            const result = SpaceXDataAdapter.getLaunchStatusDisplay(mockLaunch);

            expect(result.status).toBe('upcoming');
            expect(result.displayText).toBe('Próximo');
            expect(result.color).toBe('#3B82F6');
        });

        it('should return success status for successful launches', () => {
            const successfulLaunch = { ...mockLaunch, upcoming: false, success: true };
            const result = SpaceXDataAdapter.getLaunchStatusDisplay(successfulLaunch);

            expect(result.status).toBe('success');
            expect(result.displayText).toBe('Exitoso');
            expect(result.color).toBe('#10B981');
        });

        it('should return failed status for failed launches', () => {
            const failedLaunch = { ...mockLaunch, upcoming: false, success: false };
            const result = SpaceXDataAdapter.getLaunchStatusDisplay(failedLaunch);

            expect(result.status).toBe('failed');
            expect(result.displayText).toBe('Fallido');
            expect(result.color).toBe('#EF4444');
        });

        it('should return unknown status for launches with null success', () => {
            const unknownLaunch = { ...mockLaunch, upcoming: false, success: null };
            const result = SpaceXDataAdapter.getLaunchStatusDisplay(unknownLaunch);

            expect(result.status).toBe('unknown');
            expect(result.displayText).toBe('Desconocido');
            expect(result.color).toBe('#6B7280');
        });
    });

    describe('getRelativeTime', () => {
        // Usamos una fecha fija para hacer tests predecibles
        const mockCurrentDate = new Date('2025-12-20T12:00:00.000Z');

        beforeEach(() => {
            jest.useFakeTimers();
            jest.setSystemTime(mockCurrentDate);
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('should calculate countdown for future launches', () => {
            // Usar una fecha fija en el futuro
            const futureLaunch = { ...mockLaunch, date_utc: new Date('2026-01-01T12:00:00.000Z') };
            const result = SpaceXDataAdapter.getRelativeTime(futureLaunch);

            expect(result.isCountdown).toBe(true);
            expect(result.isPast).toBe(false);
            // El nuevo formato debería decir "En X días" en lugar de "T-"
            expect(result.timeText).toMatch(/En \d+ días/);
        });

        it('should calculate time elapsed for past launches', () => {
            // Usar una fecha fija en el pasado
            const pastLaunch = { ...mockLaunch, date_utc: new Date('2024-12-15T12:00:00.000Z') };
            const result = SpaceXDataAdapter.getRelativeTime(pastLaunch);

            expect(result.isCountdown).toBe(false);
            expect(result.isPast).toBe(true);
            // El nuevo formato debería decir "Hace X años/meses/días" en lugar de "T+"
            expect(result.timeText).toMatch(/Hace/);
        });

        it('should handle recent past launches (days)', () => {
            // Hace 5 días desde 2025-12-20
            const recentPastLaunch = { ...mockLaunch, date_utc: new Date('2025-12-15T12:00:00.000Z') };
            const result = SpaceXDataAdapter.getRelativeTime(recentPastLaunch);

            expect(result.isPast).toBe(true);
            expect(result.timeText).toBe('Hace 5 días');
        });

        it('should handle very recent past launches (hours)', () => {
            // Hace 2 horas desde 2025-12-20 12:00
            const veryRecentLaunch = { ...mockLaunch, date_utc: new Date('2025-12-20T10:00:00.000Z') };
            const result = SpaceXDataAdapter.getRelativeTime(veryRecentLaunch);

            expect(result.isPast).toBe(true);
            expect(result.timeText).toBe('Hace 2 horas');
        });

        it('should handle near future launches (days)', () => {
            // En 3 días desde 2025-12-20
            const nearFutureLaunch = { ...mockLaunch, date_utc: new Date('2025-12-23T12:00:00.000Z') };
            const result = SpaceXDataAdapter.getRelativeTime(nearFutureLaunch);

            expect(result.isCountdown).toBe(true);
            expect(result.timeText).toBe('En 3 días');
        });

        it('should handle near future launches (hours)', () => {
            // En 5 horas desde 2025-12-20 12:00
            const nearFutureLaunch = { ...mockLaunch, date_utc: new Date('2025-12-20T17:00:00.000Z') };
            const result = SpaceXDataAdapter.getRelativeTime(nearFutureLaunch);

            expect(result.isCountdown).toBe(true);
            expect(result.timeText).toBe('En 5 horas');
        });
    });

    describe('processLaunchLinks', () => {
        it('should categorize links correctly', () => {
            const result = SpaceXDataAdapter.processLaunchLinks(mockLaunch);

            expect(result.media).toHaveLength(1);
            expect(result.media[0]).toEqual({
                type: 'webcast',
                url: 'https://youtube.com/watch?v=test',
                label: 'Ver Transmisión'
            });

            expect(result.primary).toHaveLength(2);
            expect(result.primary).toContainEqual({
                type: 'article',
                url: 'https://example.com/article',
                label: 'Leer Artículo'
            });

            expect(result.social).toHaveLength(1);
            expect(result.social[0]).toEqual({
                type: 'reddit',
                url: 'https://reddit.com/campaign',
                label: 'Reddit Campaign'
            });
        });

        it('should handle missing links gracefully', () => {
            const launchWithoutLinks = {
                ...mockLaunch,
                links: {
                    patch: { small: null, large: null },
                    reddit: { campaign: null, launch: null, media: null, recovery: null },
                    flickr: { small: [], original: [] },
                    presskit: null,
                    webcast: null,
                    youtube_id: null,
                    article: null,
                    wikipedia: null
                }
            };
            const result = SpaceXDataAdapter.processLaunchLinks(launchWithoutLinks);

            expect(result.media).toHaveLength(0);
            expect(result.primary).toHaveLength(0);
            expect(result.social).toHaveLength(0);
        });
    });

    describe('normalizeDate', () => {
        it('should convert string to Date object', () => {
            const dateString = '2025-12-25T15:30:00.000Z';
            const result = SpaceXDataAdapter.normalizeDate(dateString);

            expect(result).toBeInstanceOf(Date);
            expect(result.getTime()).toBe(new Date(dateString).getTime());
        });        it('should return Date object as is', () => {
            const date = new Date('2025-12-25T15:30:00.000Z');
            const result = SpaceXDataAdapter.normalizeDate(date);

            expect(result).toStrictEqual(date);
        });
    });
});
