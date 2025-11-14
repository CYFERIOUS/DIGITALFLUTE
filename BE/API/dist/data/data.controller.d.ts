import { DataService } from './data.service';
import type { UpdateDataItemDto } from './data.service';
export declare class DataController {
    private readonly dataService;
    constructor(dataService: DataService);
    getEduData(): Promise<unknown>;
    getFunData(): Promise<unknown>;
    getInfoData(): Promise<unknown>;
    updateInformation(id: number, data: UpdateDataItemDto): Promise<{
        success: boolean;
        message: string;
    }>;
    updateEducation(id: number, data: UpdateDataItemDto): Promise<{
        success: boolean;
        message: string;
    }>;
    updateEntertainment(id: number, data: UpdateDataItemDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
