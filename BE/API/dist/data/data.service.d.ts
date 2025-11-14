import { DatabaseService } from '../database/database.service';
export interface UpdateDataItemDto {
    media?: string;
    index?: string;
    image?: string;
    thumb?: string;
    name?: string;
    description?: string;
    company?: string;
    productDescription?: string;
    technology?: string;
}
export declare class DataService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
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
