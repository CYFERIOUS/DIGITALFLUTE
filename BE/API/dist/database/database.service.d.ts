import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Database from 'better-sqlite3';
type DatabaseInstance = InstanceType<typeof Database>;
export declare class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private db;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): void;
    private initializeDatabase;
    private createTables;
    private migrateImageThumbToText;
    private populateFromJson;
    repopulateFromJson(): Promise<void>;
    restoreImageThumbUrls(): Promise<void>;
    getDatabase(): DatabaseInstance;
    getAllInformation(): any[];
    getInformationById(id: number): any;
    getInformationByIndex(index: string): any;
    getAllEducation(): any[];
    getEducationById(id: number): any;
    getEducationByIndex(index: string): any;
    getAllEntertainment(): any[];
    getEntertainmentById(id: number): any;
    getEntertainmentByIndex(index: string): any;
    updateInformation(id: number, data: Partial<{
        media: string;
        index: string;
        image: string;
        thumb: string;
        name: string;
        description: string;
        company: string;
        productDescription: string;
        technology: string;
    }>): boolean;
    updateEducation(id: number, data: Partial<{
        media: string;
        index: string;
        image: string;
        thumb: string;
        name: string;
        description: string;
        company: string;
        productDescription: string;
        technology: string;
    }>): boolean;
    updateEntertainment(id: number, data: Partial<{
        media: string;
        index: string;
        image: string;
        thumb: string;
        name: string;
        description: string;
        company: string;
        productDescription: string;
        technology: string;
    }>): boolean;
}
export {};
