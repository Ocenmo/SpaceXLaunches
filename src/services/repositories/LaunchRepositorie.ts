import { Launch, RocketDetail, LaunchpadDetail } from '@/types/launch.types';
import { IApiService } from '../api/ApiService';

export interface ILaunchRepository {
    getAllLaunches(): Promise<Launch[]>;
    getPastLaunches(): Promise<Launch[]>;
    getUpcomingLaunches(): Promise<Launch[]>;
    getLaunchById(id: string): Promise<Launch>;
    getRocketById(id: string): Promise<RocketDetail>;
    getLaunchpadById(id: string): Promise<LaunchpadDetail>;
}

export class LaunchRepository implements ILaunchRepository {
    constructor(private apiService: IApiService) {}

    async getAllLaunches(): Promise<Launch[]> {
        return this.apiService.getLaunches();
    }

    async getPastLaunches(): Promise<Launch[]> {
        const launches = await this.apiService.getLaunches();
        return launches.filter((launch: Launch) => !launch.upcoming);
    }

    async getUpcomingLaunches(): Promise<Launch[]> {
        const launches = await this.apiService.getLaunches();
        return launches.filter((launch: Launch) => launch.upcoming);
    }

    async getLaunchById(id: string): Promise<Launch> {
        return this.apiService.getLaunchById(id);
    }

    async getRocketById(id: string): Promise<RocketDetail> {
        return this.apiService.getRocketById(id);
    }

    async getLaunchpadById(id: string): Promise<LaunchpadDetail> {
        return this.apiService.getLaunchpadById(id);
    }
    // Métodos adicionales según sea necesario
    // Por ejemplo, para obtener lanzamientos por fecha, por éxito, etc.
    // async getLaunchesByDate(date: string): Promise<Launch[]> {
    //     const launches = await this.apiService.getLaunches();
    //     return launches.filter(launch => new Date(launch.date_utc).toISOString().startsWith(date));
    // }
}