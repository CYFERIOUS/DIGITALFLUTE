import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { DataService } from './data.service';
import type { UpdateDataItemDto } from './data.service';

@Controller()
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get('edu')
  async getEduData(): Promise<unknown> {
    return this.dataService.getEduData();
  }

  @Get('fun')
  async getFunData(): Promise<unknown> {
    return this.dataService.getFunData();
  }

  @Get('info')
  async getInfoData(): Promise<unknown> {
    return this.dataService.getInfoData();
  }

  @Post('info/:id')
  async updateInformation(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateDataItemDto
  ): Promise<{ success: boolean; message: string }> {
    return this.dataService.updateInformation(id, data);
  }

  @Post('edu/:id')
  async updateEducation(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateDataItemDto
  ): Promise<{ success: boolean; message: string }> {
    return this.dataService.updateEducation(id, data);
  }

  @Post('fun/:id')
  async updateEntertainment(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateDataItemDto
  ): Promise<{ success: boolean; message: string }> {
    return this.dataService.updateEntertainment(id, data);
  }
}
