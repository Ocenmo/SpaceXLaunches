import axios, { AxiosInstance } from 'axios';
import {
    Launch,
    RocketDetail,
    LaunchpadDetail,
    LaunchSchema,
    RocketDetailSchema,
    LaunchpadDetailSchema
} from '@/types/launch.types';

export interface IApiService {
    getLaunches(): Promise<Launch[]>;
    getLaunchById(id: string): Promise<Launch>;
    getRocketById(id: string): Promise<RocketDetail>;
    getLaunchpadById(id: string): Promise<LaunchpadDetail>;
}

export class SpaceXApiService implements IApiService {
    private Client: AxiosInstance;

    constructor() {
        this.Client = axios.create({
            baseURL: 'https://api.spacexdata.com/v4',
            timeout: 10000, // 10 seconds timeout
        });
    }

    async getLaunches(): Promise<Launch[]> {
        try {
            const response = await this.Client.get('/launches');
            return response.data.map((launch: any) => LaunchSchema.parse(launch));
        } catch (error) {;
            throw new Error(`Error fetching launches: ${error}`);
        }
    }

    async getLaunchById(id: string): Promise<Launch> {
        try {
            const response = await this.Client.get(`/launches/${id}`);
            return LaunchSchema.parse(response.data);
        } catch (error) {
            throw new Error(`Error fetching launch by ID ${id}: ${error}`);
        }
    }

    async getRocketById(id: string): Promise<RocketDetail> {
        try {
            const response = await this.Client.get(`/rockets/${id}`);
            return RocketDetailSchema.parse(response.data);
        } catch (error) {
            throw new Error(`Error fetching rocket by ID ${id}: ${error}`);
        }
    }

    async getLaunchpadById(id: string): Promise<LaunchpadDetail> {
        try {
            const response = await this.Client.get(`/launchpads/${id}`);
            return LaunchpadDetailSchema.parse(response.data);
        } catch (error) {
            throw new Error(`Error fetching launchpad by ID ${id}: ${error}`);
        }
    }
}