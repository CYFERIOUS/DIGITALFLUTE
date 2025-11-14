import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

@Injectable()
export class DataService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getEduData(): Promise<unknown> {
    try {
      const data = this.databaseService.getAllEducation();
      // Transform database results to match JSON format (index_value -> index)
      return data.map(item => ({
        media: item.media,
        index: item.index_value,
        image: item.image,
        thumb: item.thumb,
        name: item.name,
        description: item.description,
        company: item.company,
        productDescription: item.productDescription,
        technology: item.technology
      }));
    } catch (error) {
      console.error('Error loading education data from database:', error);
      throw new NotFoundException('Could not load education data');
    }
  }

  async getFunData(): Promise<unknown> {
    try {
      const data = this.databaseService.getAllEntertainment();
      // Transform database results to match JSON format (index_value -> index)
      return data.map(item => ({
        media: item.media,
        index: item.index_value,
        image: item.image,
        thumb: item.thumb,
        name: item.name,
        description: item.description,
        company: item.company,
        productDescription: item.productDescription,
        technology: item.technology
      }));
    } catch (error) {
      console.error('Error loading entertainment data from database:', error);
      throw new NotFoundException('Could not load entertainment data');
    }
  }

  async getInfoData(): Promise<unknown> {
    try {
      const data = this.databaseService.getAllInformation();
      // Transform database results to match JSON format (index_value -> index)
      return data.map(item => ({
        media: item.media,
        index: item.index_value,
        image: item.image,
        thumb: item.thumb,
        name: item.name,
        description: item.description,
        company: item.company,
        productDescription: item.productDescription,
        technology: item.technology
      }));
    } catch (error) {
      console.error('Error loading information data from database:', error);
      throw new NotFoundException('Could not load information data');
    }
  }

  async updateInformation(id: number, data: UpdateDataItemDto): Promise<{ success: boolean; message: string }> {
    try {
      // Validate data
      if (!data || typeof data !== 'object') {
        throw new BadRequestException('Request body must be a valid JSON object');
      }

      // Verify item exists
      const existing = this.databaseService.getInformationById(id);
      if (!existing) {
        throw new NotFoundException(`Information item with id ${id} not found`);
      }

      const success = this.databaseService.updateInformation(id, data);
      if (success) {
        return { success: true, message: 'Information item updated successfully' };
      } else {
        throw new BadRequestException('No fields to update');
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error updating information data:', error);
      throw new BadRequestException('Could not update information data');
    }
  }

  async updateEducation(id: number, data: UpdateDataItemDto): Promise<{ success: boolean; message: string }> {
    try {
      // Validate data
      if (!data || typeof data !== 'object') {
        throw new BadRequestException('Request body must be a valid JSON object');
      }

      // Verify item exists
      const existing = this.databaseService.getEducationById(id);
      if (!existing) {
        throw new NotFoundException(`Education item with id ${id} not found`);
      }

      const success = this.databaseService.updateEducation(id, data);
      if (success) {
        return { success: true, message: 'Education item updated successfully' };
      } else {
        throw new BadRequestException('No fields to update');
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error updating education data:', error);
      throw new BadRequestException('Could not update education data');
    }
  }

  async updateEntertainment(id: number, data: UpdateDataItemDto): Promise<{ success: boolean; message: string }> {
    try {
      // Validate data
      if (!data || typeof data !== 'object') {
        throw new BadRequestException('Request body must be a valid JSON object');
      }

      // Verify item exists
      const existing = this.databaseService.getEntertainmentById(id);
      if (!existing) {
        throw new NotFoundException(`Entertainment item with id ${id} not found`);
      }

      const success = this.databaseService.updateEntertainment(id, data);
      if (success) {
        return { success: true, message: 'Entertainment item updated successfully' };
      } else {
        throw new BadRequestException('No fields to update');
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error updating entertainment data:', error);
      throw new BadRequestException('Could not update entertainment data');
    }
  }
}
