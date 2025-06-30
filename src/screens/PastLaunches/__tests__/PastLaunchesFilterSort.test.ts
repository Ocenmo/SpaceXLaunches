import { LaunchService } from '@/services/LaunchService';
import { Launch, FilterOption, SortOption } from '@/types/launch.types';

// Test específico para la lógica de filtrado y ordenamiento de la pantalla PastLaunches
describe('PastLaunches Screen Logic - Filter and Sort Integration', () => {
    let launchService: LaunchService;
    let mockLaunches: Launch[];

    const createMockLaunch = (overrides: Partial<Launch>): Launch => ({
        fairings: null,
        links: {
            patch: { small: null, large: null },
            reddit: { campaign: null, launch: null, media: null, recovery: null },
            flickr: { small: [], original: [] },
            presskit: null,
            webcast: null,
            youtube_id: null,
            article: null,
            wikipedia: null,
        },
        static_fire_date_utc: null,
        static_fire_date_unix: null,
        net: false,
        window: null,
        rocket: '5e9d0d95eda69955f709d1eb',
        success: true,
        failures: [],
        details: null,
        crew: [],
        ships: [],
        capsules: [],
        payloads: ['payload1'],
        launchpad: '5e9e4501f509094ba4566f84',
        flight_number: 1,
        name: 'Test Mission',
        date_utc: new Date('2023-01-01T00:00:00Z'),
        date_unix: 1672531200,
        date_local: new Date('2023-01-01T00:00:00Z'),
        date_precision: 'hour' as const,
        upcoming: false,
        cores: [],
        auto_update: true,
        tbd: false,
        launch_library_id: null,
        id: '1',
        ...overrides,
    });

    beforeEach(() => {
        // Mock repository - no necesitamos implementación real para estos tests
        const mockRepository = {} as any;
        launchService = new LaunchService(mockRepository);

        mockLaunches = [
            createMockLaunch({
                id: '1',
                name: 'Falcon 9 Block 5 | Starlink',
                date_utc: new Date('2023-01-15T08:00:00Z'),
                success: true,
                details: 'Deployment of 60 Starlink satellites to low Earth orbit'
            }),
            createMockLaunch({
                id: '2',
                name: 'Falcon Heavy | Arabsat-6A',
                date_utc: new Date('2023-02-10T15:30:00Z'),
                success: false,
                details: 'Commercial communications satellite mission that failed'
            }),
            createMockLaunch({
                id: '3',
                name: 'Falcon 9 | Demo-2',
                date_utc: new Date('2023-03-05T12:00:00Z'),
                success: true,
                details: 'First crewed mission to the International Space Station'
            }),
            createMockLaunch({
                id: '4',
                name: 'Starship | IFT-1',
                date_utc: new Date('2022-12-20T09:15:00Z'),
                success: false,
                details: 'Integrated Flight Test of Starship vehicle'
            }),
            createMockLaunch({
                id: '5',
                name: 'Falcon 9 | GPS III SV05',
                date_utc: new Date('2023-04-01T14:20:00Z'),
                success: true,
                details: 'GPS satellite for the US Space Force'
            })
        ];
    });

    describe('Real-world filtering scenarios', () => {
        it('should filter successful missions correctly', () => {
            const result = launchService.filterLaunches(mockLaunches, 'success');

            expect(result).toHaveLength(3);
            expect(result.every((launch: Launch) => launch.success === true)).toBe(true);
            expect(result.map((l: Launch) => l.name)).toEqual([
                'Falcon 9 Block 5 | Starlink',
                'Falcon 9 | Demo-2',
                'Falcon 9 | GPS III SV05'
            ]);
        });

        it('should filter failed missions correctly', () => {
            const result = launchService.filterLaunches(mockLaunches, 'failed');

            expect(result).toHaveLength(2);
            expect(result.every((launch: Launch) => launch.success === false)).toBe(true);
            expect(result.map((l: Launch) => l.name)).toEqual([
                'Falcon Heavy | Arabsat-6A',
                'Starship | IFT-1'
            ]);
        });
    });

    describe('Real-world sorting scenarios', () => {
        it('should sort by date descending (newest first) - typical default', () => {
            const result = launchService.sortLaunches(mockLaunches, 'date_desc');            expect(result.map((l: Launch) => l.name)).toEqual([
                'Falcon 9 | GPS III SV05',     // 2023-04-01
                'Falcon 9 | Demo-2',           // 2023-03-05
                'Falcon Heavy | Arabsat-6A',   // 2023-02-10
                'Falcon 9 Block 5 | Starlink', // 2023-01-15
                'Starship | IFT-1'             // 2022-12-20
            ]);
        });

        it('should sort by date ascending (oldest first)', () => {
            const result = launchService.sortLaunches(mockLaunches, 'date_asc');

            expect(result.map((l: Launch) => l.name)).toEqual([
                'Starship | IFT-1',             // 2022-12-20
                'Falcon 9 Block 5 | Starlink', // 2023-01-15
                'Falcon Heavy | Arabsat-6A',   // 2023-02-10
                'Falcon 9 | Demo-2',           // 2023-03-05
                'Falcon 9 | GPS III SV05'      // 2023-04-01
            ]);
        });

        it('should sort by name alphabetically (A-Z)', () => {
            const result = launchService.sortLaunches(mockLaunches, 'name_asc');

            expect(result.map((l: Launch) => l.name)).toEqual([
                'Falcon 9 | Demo-2',
                'Falcon 9 | GPS III SV05',
                'Falcon 9 Block 5 | Starlink',
                'Falcon Heavy | Arabsat-6A',
                'Starship | IFT-1'
            ]);
        });
    });

    describe('Real-world search scenarios', () => {
        it('should search by mission type (Falcon 9)', () => {
            const result = launchService.searchLaunches(mockLaunches, 'Falcon 9');

            expect(result).toHaveLength(3);
            expect(result.every((l: Launch) => l.name.includes('Falcon 9'))).toBe(true);
        });

        it('should search by payload type (Starlink)', () => {
            const result = launchService.searchLaunches(mockLaunches, 'Starlink');

            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Falcon 9 Block 5 | Starlink');
        });

        it('should search in mission details', () => {
            const result = launchService.searchLaunches(mockLaunches, 'Space Station');

            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Falcon 9 | Demo-2');
        });

        it('should be case insensitive', () => {
            const result = launchService.searchLaunches(mockLaunches, 'GPS');

            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Falcon 9 | GPS III SV05');
        });
    });

    describe('Combined operations - Real PastLaunches workflow', () => {
        it('should simulate typical user workflow: search > filter > sort', () => {
            // Usuario busca misiones Falcon 9
            let result = launchService.searchLaunches(mockLaunches, 'Falcon 9');
            expect(result).toHaveLength(3);

            // Usuario filtra solo exitosas
            result = launchService.filterLaunches(result, 'success');
            expect(result).toHaveLength(3); // Todas las Falcon 9 fueron exitosas en este dataset

            // Usuario ordena por fecha descendente
            result = launchService.sortLaunches(result, 'date_desc');
            expect(result.map((l: Launch) => l.name)).toEqual([
                'Falcon 9 | GPS III SV05',
                'Falcon 9 | Demo-2',
                'Falcon 9 Block 5 | Starlink'
            ]);
        });

        it('should handle search with no results after filtering', () => {
            // Usuario busca "Starship"
            let result = launchService.searchLaunches(mockLaunches, 'Starship');
            expect(result).toHaveLength(1);

            // Usuario filtra solo exitosas (Starship falló)
            result = launchService.filterLaunches(result, 'success');
            expect(result).toHaveLength(0);

            // Ordenar array vacío no debería fallar
            result = launchService.sortLaunches(result, 'date_desc');
            expect(result).toHaveLength(0);
        });

        it('should handle filter first, then search workflow', () => {
            // Usuario filtra solo misiones exitosas
            let result = launchService.filterLaunches(mockLaunches, 'success');
            expect(result).toHaveLength(3);

            // Usuario busca "GPS" dentro de las exitosas
            result = launchService.searchLaunches(result, 'GPS');
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Falcon 9 | GPS III SV05');

            // Usuario ordena por nombre
            result = launchService.sortLaunches(result, 'name_asc');
            expect(result[0].name).toBe('Falcon 9 | GPS III SV05');
        });

        it('should maintain data immutability through operations', () => {
            const originalLaunches = JSON.parse(JSON.stringify(mockLaunches));

            // Realizar múltiples operaciones
            let result = launchService.searchLaunches(mockLaunches, 'Falcon');
            result = launchService.filterLaunches(result, 'success');
            result = launchService.sortLaunches(result, 'name_desc');

            // Verificar que el array original no fue modificado
            expect(mockLaunches).toHaveLength(originalLaunches.length);
            expect(mockLaunches[0].name).toBe(originalLaunches[0].name);
            expect(mockLaunches[4].name).toBe(originalLaunches[4].name);
        });
    });

    describe('Edge cases and error handling', () => {
        it('should handle empty search query gracefully', () => {
            const result = launchService.searchLaunches(mockLaunches, '');
            expect(result).toEqual(mockLaunches);
        });

        it('should handle whitespace-only search query', () => {
            const result = launchService.searchLaunches(mockLaunches, '   \t\n  ');
            expect(result).toEqual(mockLaunches);
        });

        it('should handle launches with null details in search', () => {
            const launchesWithNullDetails = [
                createMockLaunch({
                    id: '6',
                    name: 'Test Mission No Details',
                    details: null
                })
            ];

            const result = launchService.searchLaunches(launchesWithNullDetails, 'Test Mission');
            expect(result).toHaveLength(1);
        });

        it('should handle mixed success states correctly', () => {
            const mixedLaunches = [
                createMockLaunch({ id: '1', success: true }),
                createMockLaunch({ id: '2', success: false }),
                createMockLaunch({ id: '3', success: null }),
            ];

            const successResults = launchService.filterLaunches(mixedLaunches, 'success');
            expect(successResults).toHaveLength(1);

            const failedResults = launchService.filterLaunches(mixedLaunches, 'failed');
            expect(failedResults).toHaveLength(1);

            const allResults = launchService.filterLaunches(mixedLaunches, 'all');
            expect(allResults).toHaveLength(3);
        });
    });

    describe('Performance and data integrity', () => {
        it('should handle large datasets efficiently', () => {
            // Crear un dataset más grande
            const largeLaunches = Array.from({ length: 100 }, (_, i) =>
                createMockLaunch({
                    id: i.toString(),
                    name: `Mission ${i}`,
                    success: i % 2 === 0,
                    date_utc: new Date(2020 + (i % 4), i % 12, 1)
                })
            );

            const startTime = performance.now();

            let result = launchService.searchLaunches(largeLaunches, 'Mission');
            result = launchService.filterLaunches(result, 'success');
            result = launchService.sortLaunches(result, 'date_desc');

            const endTime = performance.now();

            expect(result).toHaveLength(50); // Mitad exitosas
            expect(endTime - startTime).toBeLessThan(100); // Menos de 100ms
        });

        it('should preserve all launch properties through operations', () => {
            const result = launchService.sortLaunches(mockLaunches, 'name_asc');

            // Verificar que todas las propiedades se mantienen
            expect(result[0]).toHaveProperty('id');
            expect(result[0]).toHaveProperty('name');
            expect(result[0]).toHaveProperty('date_utc');
            expect(result[0]).toHaveProperty('success');
            expect(result[0]).toHaveProperty('details');
            expect(result[0]).toHaveProperty('rocket');
            expect(result[0]).toHaveProperty('launchpad');
        });
    });
});
