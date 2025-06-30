import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LaunchCard } from '../LaunchCard';
import { Launch } from '@/types/launch.types';

const mockLaunch: Launch = {
    id: '1',
    name: 'Test Mission',
    date_utc: new Date('2023-01-01T00:00:00Z'),
    date_unix: 1672531200,
    date_local: new Date('2023-01-01T00:00:00Z'),
    date_precision: 'hour',
    success: true,
    upcoming: false,
    rocket: '5e9d0d95eda69955f709d1eb',
    details: 'Test details',
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
    launchpad: '5e9e4501f509094ba4566f84',
    payloads: ['payload1'],
    fairings: null,
    static_fire_date_utc: null,
    static_fire_date_unix: null,
    net: false,
    window: null,
    failures: [],
    crew: [],
    ships: [],
    capsules: [],
    flight_number: 1,
    cores: [],
    auto_update: false,
    tbd: false,
    launch_library_id: null,
};

describe('LaunchCard', () => {
    const mockOnPress = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render launch information correctly', () => {
        const { toJSON } = render(
        <LaunchCard launch={mockLaunch} onPress={mockOnPress} />
        );

        // Verificar que el componente se renderiza correctamente
        expect(toJSON()).toMatchSnapshot();
    });

    it('should call onPress when pressed', () => {
        const { UNSAFE_root } = render(
        <LaunchCard launch={mockLaunch} onPress={mockOnPress} />
        );

        // Usar UNSAFE_root para acceder al componente principal
        fireEvent.press(UNSAFE_root);
        expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should display correct status for failed launch', () => {
        const failedLaunch = { ...mockLaunch, success: false };
        const { toJSON } = render(
        <LaunchCard launch={failedLaunch} onPress={mockOnPress} />
        );

        // Verificar que el componente se renderiza con el estado correcto
        const snapshot = toJSON();
        expect(snapshot).toMatchSnapshot();
    });

    it('should display correct status for upcoming launch', () => {
        const upcomingLaunch = { ...mockLaunch, success: null, upcoming: true };
        const { toJSON } = render(
        <LaunchCard launch={upcomingLaunch} onPress={mockOnPress} />
        );

        // Verificar que el componente se renderiza con el estado correcto
        const snapshot = toJSON();
        expect(snapshot).toMatchSnapshot();
    });
});