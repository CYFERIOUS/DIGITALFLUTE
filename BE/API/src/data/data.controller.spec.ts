import { Test, TestingModule } from '@nestjs/testing';
import { DataController } from './data.controller';
import { DataService } from './data.service';
import { NotFoundException } from '@nestjs/common';

describe('DataController', () => {
  let controller: DataController;
  let service: DataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataController],
      providers: [DataService],
    }).compile();

    controller = module.get<DataController>(DataController);
    service = module.get<DataService>(DataService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getEduData', () => {
    it('should return educational data', async () => {
      const result = [{ id: 1, title: 'Edu Project' }];
      jest.spyOn(service, 'getEduData').mockResolvedValue(result);
      expect(await controller.getEduData()).toBe(result);
    });
  });

  describe('getFunData', () => {
    it('should return fun data', async () => {
      const result = [{ id: 1, title: 'Fun Project' }];
      jest.spyOn(service, 'getFunData').mockResolvedValue(result);
      expect(await controller.getFunData()).toBe(result);
    });
  });

  describe('getInfoData', () => {
    it('should return info data', async () => {
      const result = [{ id: 1, title: 'Info Project' }];
      jest.spyOn(service, 'getInfoData').mockResolvedValue(result);
      expect(await controller.getInfoData()).toBe(result);
    });
  });
});
