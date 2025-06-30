import { LaunchService } from '../LaunchService';
import { ILaunchRepository } from '../repositories/LaunchRepositorie';
import { Launch } from '@/types/launch.types';

const mockRepository: jest.Mocked<ILaunchRepository> = {
    getAllLaunches: jest.fn(),
    getPastLaunches: jest.fn(),
    getUpcomingLaunches: jest.fn(),
    getLaunchById: jest.fn(),
    getRocketById: jest.fn(),
    getLaunchpadById: jest.fn(),
};

const createMockLaunch = (overrides: Partial<Launch>): Launch => ({
    fairings: null,
    links: {
        patch: {
            small: 'https://example.com/patch.png',
            large: null,
        },
        reddit: {
            campaign: null,
            launch: null,
            media: null,
            recovery: null,
        },
        flickr: {
            small: [],
            original: [],
        },
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

const mockLaunches: Launch[] = [
    createMockLaunch({
        id: '1',
        name: 'Mission Alpha',
        date_utc: new Date('2023-01-01T00:00:00Z'),
        date_unix: 1672531200,
        success: true,
        details: 'Test mission A with specific details',
        flight_number: 1,
    }),
    createMockLaunch({
        id: '2',
        name: 'Mission Beta',
        date_utc: new Date('2023-02-01T00:00:00Z'),
        date_unix: 1675209600,
        success: false,
        details: 'Test mission B with failure details',
        flight_number: 2,
        launchpad: '5e9e4502f509092b78566f87',
    }),
    createMockLaunch({
        id: '3',
        name: 'Falcon Heavy Demo',
        date_utc: new Date('2023-03-15T10:30:00Z'),
        date_unix: 1678875000,
        success: true,
        details: 'Demo flight with payload to Mars orbit',
        flight_number: 3,
        rocket: '5e9d0d95eda69973a809d1ec',
        launchpad: '5e9e4502f509094188566f88',
    }),
    createMockLaunch({
        id: '4',
        name: 'Starlink Mission',
        date_utc: new Date('2022-12-01T05:00:00Z'),
        date_unix: 1669870800,
        success: true,
        details: 'Starlink satellite deployment mission',
        flight_number: 4,
        rocket: '5e9d0d95eda69974db09d1ed',
        launchpad: '5e9e4502f5090995de566f86',
    }),
];

describe('LaunchService', () => {
    let launchService: LaunchService;

    beforeEach(() => {
        launchService = new LaunchService(mockRepository);
        jest.clearAllMocks();
    });

    describe('filterLaunches', () => {
        it('should return all launches when filter is "all"', () => {
            const result = launchService.filterLaunches(mockLaunches, 'all');
            expect(result).toHaveLength(4);
            expect(result).toEqual(mockLaunches);
        });

        it('should return only successful launches when filter is "success"', () => {
            const result = launchService.filterLaunches(mockLaunches, 'success');
            expect(result).toHaveLength(3);
            expect(result.every(launch => launch.success === true)).toBe(true);
            expect(result.map(l => l.name)).toEqual(['Mission Alpha', 'Falcon Heavy Demo', 'Starlink Mission']);
        });

        it('should return only failed launches when filter is "failed"', () => {
            const result = launchService.filterLaunches(mockLaunches, 'failed');
            expect(result).toHaveLength(1);
            expect(result[0].success).toBe(false);
            expect(result[0].name).toBe('Mission Beta');
        });

        it('should handle empty launch array', () => {
            const result = launchService.filterLaunches([], 'success');
            expect(result).toHaveLength(0);
        });

        it('should handle launches with null success values', () => {
            const launchesWithNull = [
                createMockLaunch({ id: '5', name: 'Unknown Mission', success: null }),
                ...mockLaunches
            ];

            const successResult = launchService.filterLaunches(launchesWithNull, 'success');
            expect(successResult).toHaveLength(3); // Only true successes

            const failedResult = launchService.filterLaunches(launchesWithNull, 'failed');
            expect(failedResult).toHaveLength(1); // Only false failures
        });
    });

    describe('sortLaunches', () => {
        it('should sort launches by date ascending (oldest first)', () => {
            const result = launchService.sortLaunches(mockLaunches, 'date_asc');
            expect(result[0].name).toBe('Starlink Mission'); // 2022-12-01
            expect(result[1].name).toBe('Mission Alpha');    // 2023-01-01
            expect(result[2].name).toBe('Mission Beta');     // 2023-02-01
            expect(result[3].name).toBe('Falcon Heavy Demo'); // 2023-03-15

            // Verificar que el orden es correcto
            for (let i = 0; i < result.length - 1; i++) {
                expect(new Date(result[i].date_utc).getTime())
                    .toBeLessThanOrEqual(new Date(result[i + 1].date_utc).getTime());
            }
        });

        it('should sort launches by date descending (newest first)', () => {
            const result = launchService.sortLaunches(mockLaunches, 'date_desc');
            expect(result[0].name).toBe('Falcon Heavy Demo'); // 2023-03-15
            expect(result[1].name).toBe('Mission Beta');      // 2023-02-01
            expect(result[2].name).toBe('Mission Alpha');     // 2023-01-01
            expect(result[3].name).toBe('Starlink Mission');  // 2022-12-01

            // Verificar que el orden es correcto
            for (let i = 0; i < result.length - 1; i++) {
                expect(new Date(result[i].date_utc).getTime())
                    .toBeGreaterThanOrEqual(new Date(result[i + 1].date_utc).getTime());
            }
        });

        it('should sort launches by name ascending (A-Z)', () => {
            const result = launchService.sortLaunches(mockLaunches, 'name_asc');
            expect(result.map(l => l.name)).toEqual([
                'Falcon Heavy Demo',
                'Mission Alpha',
                'Mission Beta',
                'Starlink Mission'
            ]);
        });

        it('should sort launches by name descending (Z-A)', () => {
            const result = launchService.sortLaunches(mockLaunches, 'name_desc');
            expect(result.map(l => l.name)).toEqual([
                'Starlink Mission',
                'Mission Beta',
                'Mission Alpha',
                'Falcon Heavy Demo'
            ]);
        });

        it('should not modify the original array', () => {
            const originalOrder = [...mockLaunches];
            const result = launchService.sortLaunches(mockLaunches, 'name_asc');

            expect(mockLaunches).toEqual(originalOrder);
            expect(result).not.toBe(mockLaunches); // Diferentes referencias
        });

        it('should handle empty array', () => {
            const result = launchService.sortLaunches([], 'date_asc');
            expect(result).toHaveLength(0);
        });

        it('should handle single item array', () => {
            const singleLaunch = [mockLaunches[0]];
            const result = launchService.sortLaunches(singleLaunch, 'name_desc');
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(mockLaunches[0]);
        });

        it('should return unchanged array for invalid sort option', () => {
            // @ts-expect-error - Testing invalid sort option
            const result = launchService.sortLaunches(mockLaunches, 'invalid_sort');
            expect(result.map(l => l.name)).toEqual(mockLaunches.map(l => l.name));
        });
    });

    describe('searchLaunches', () => {
        it('should return filtered launches based on search query in name', () => {
            const result = launchService.searchLaunches(mockLaunches, 'Mission Alpha');
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Mission Alpha');
        });

        it('should return filtered launches based on partial name match', () => {
            const result = launchService.searchLaunches(mockLaunches, 'Mission');
            expect(result).toHaveLength(3);
            expect(result.map(l => l.name)).toEqual(['Mission Alpha', 'Mission Beta', 'Starlink Mission']);
        });

        it('should return filtered launches based on search query in details', () => {
            const result = launchService.searchLaunches(mockLaunches, 'Mars orbit');
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Falcon Heavy Demo');
        });

        it('should be case insensitive', () => {
            const result = launchService.searchLaunches(mockLaunches, 'FALCON HEAVY');
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Falcon Heavy Demo');
        });

        it('should return all launches when search query is empty', () => {
            const result = launchService.searchLaunches(mockLaunches, '');
            expect(result).toHaveLength(4);
            expect(result).toEqual(mockLaunches);
        });

        it('should return all launches when search query is only whitespace', () => {
            const result = launchService.searchLaunches(mockLaunches, '   ');
            expect(result).toHaveLength(4);
            expect(result).toEqual(mockLaunches);
        });

        it('should return empty array when no matches found', () => {
            const result = launchService.searchLaunches(mockLaunches, 'NonExistentMission');
            expect(result).toHaveLength(0);
        });

        it('should handle launches with null details', () => {
            const launchesWithNullDetails = [
                createMockLaunch({ id: '5', name: 'Mission Gamma', details: null })
            ];
            const result = launchService.searchLaunches(launchesWithNullDetails, 'Gamma');
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Mission Gamma');
        });

        it('should search in both name and details', () => {
            const result = launchService.searchLaunches(mockLaunches, 'specific');
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Mission Alpha');
        });
    });

    describe('Combined filtering, sorting and searching', () => {
        it('should apply search, filter and sort in sequence', () => {
            // Primero aplicar búsqueda
            let result = launchService.searchLaunches(mockLaunches, 'Mission');
            expect(result).toHaveLength(3);

            // Luego aplicar filtro (solo exitosos)
            result = launchService.filterLaunches(result, 'success');
            expect(result).toHaveLength(2); // Mission Alpha y Starlink Mission

            // Finalmente aplicar ordenamiento
            result = launchService.sortLaunches(result, 'name_desc');
            expect(result.map(l => l.name)).toEqual(['Starlink Mission', 'Mission Alpha']);
        });

        it('should handle edge case with empty results after filtering', () => {
            // Buscar algo que solo existe en misiones fallidas
            let result = launchService.searchLaunches(mockLaunches, 'failure');
            expect(result).toHaveLength(1);

            // Filtrar solo exitosos (debería resultar en array vacío)
            result = launchService.filterLaunches(result, 'success');
            expect(result).toHaveLength(0);

            // Ordenar array vacío
            result = launchService.sortLaunches(result, 'name_asc');
            expect(result).toHaveLength(0);
        });        it('should maintain data integrity through multiple operations', () => {
            const originalLength = mockLaunches.length;
            const firstLaunchName = mockLaunches[0].name;
            const lastLaunchName = mockLaunches[mockLaunches.length - 1].name;

            // Realizar múltiples operaciones
            launchService.searchLaunches(mockLaunches, 'Mission');
            launchService.filterLaunches(mockLaunches, 'success');
            launchService.sortLaunches(mockLaunches, 'date_desc');

            // Verificar que los datos originales no se modificaron
            expect(mockLaunches).toHaveLength(originalLength);
            expect(mockLaunches[0].name).toBe(firstLaunchName);
            expect(mockLaunches[mockLaunches.length - 1].name).toBe(lastLaunchName);
        });
    });
});