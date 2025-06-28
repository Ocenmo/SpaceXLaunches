import { useMemo } from 'react';
import { LaunchService } from '@/services/LaunchService';
import { LaunchRepository } from '@/services/repositories/LaunchRepositorie';
import { SpaceXApiService } from '@/services/api/ApiService';

export const useLaunchService = () => {
    return useMemo(() => {
        const apiService = new SpaceXApiService();
        const repository = new LaunchRepository(apiService);
        return new LaunchService(repository);
    }, []);
};