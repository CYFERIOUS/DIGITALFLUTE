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
}

