import { Controller, Post } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Post('repopulate')
  async repopulate(): Promise<{ message: string; success: boolean }> {
    try {
      await this.databaseService.repopulateFromJson();
      return {
        message: 'Database repopulated successfully from JSON files',
        success: true
      };
    } catch (error) {
      return {
        message: `Error repopulating database: ${error.message}`,
        success: false
      };
    }
  }

  @Post('restore-images')
  async restoreImages(): Promise<{ message: string; success: boolean }> {
    try {
      await this.databaseService.restoreImageThumbUrls();
      return {
        message: 'Image and thumbnail URLs restored successfully from JSON files',
        success: true
      };
    } catch (error) {
      return {
        message: `Error restoring image URLs: ${error.message}`,
        success: false
      };
    }
  }
}

