import { ILaunchRepository } from "./repositories/LaunchRepositorie";
import { Launch, SortOption, FilterOption } from "@/types/launch.types";

export class LaunchService {
    constructor(private repository: ILaunchRepository) {}

    async getPastLaunches(): Promise<Launch[]> {
        return this.repository.getPastLaunches();
    }

    async getUpcomingLaunches(): Promise<Launch[]> {
        return this.repository.getUpcomingLaunches();
    }

    async getLaunchesDetails(id: string) {
        const launch = await this.repository.getLaunchById(id);
        const rocket = await this.repository.getRocketById(launch.rocket);
        const launchpad = await this.repository.getLaunchpadById(launch.launchpad);

        return {
            ...launch,
            rocket,
            launchpad
        };
    }

    filterLaunches(launches: Launch[], filter: FilterOption): Launch[] {
        if (filter === 'all') {
            return launches;
        }

            return launches.filter(launch => {
                if (filter === 'success') {
                    return launch.success === true;
                } else if (filter === 'failed') {
                    return launch.success === false;
                }
                return true; // Default case, should not happen
            });
        }

    sortLaunches(launches: Launch[], sort: SortOption): Launch[] {
        return [...launches].sort((a, b) => {
            switch (sort) {
                case 'date_asc':
                    return new Date(a.date_utc).getTime() - new Date(b.date_utc).getTime();
                case 'date_desc':
                    return new Date(b.date_utc).getTime() - new Date(a.date_utc).getTime();
                case 'name_asc':
                    return a.name.localeCompare(b.name);
                case 'name_desc':
                    return b.name.localeCompare(a.name);
                default:
                    return 0; // No sorting
            }
        });
    }

    searchLaunches(launches: Launch[], query: string): Launch[] {
        if (!query.trim()) return launches;

        const searchTerm = query.toLowerCase();
        return launches.filter(launch => {
            return (
                launch.name.toLowerCase().includes(searchTerm) ||
                (launch.details && launch.details.toLowerCase().includes(searchTerm))
            );
        });
    }
}
