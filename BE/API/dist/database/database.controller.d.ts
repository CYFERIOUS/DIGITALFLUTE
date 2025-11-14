import { DatabaseService } from './database.service';
export declare class DatabaseController {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    repopulate(): Promise<{
        message: string;
        success: boolean;
    }>;
}
