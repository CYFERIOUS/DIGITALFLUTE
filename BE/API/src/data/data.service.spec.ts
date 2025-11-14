import { Test, TestingModule } from '@nestjs/testing';
import { DataService } from './data.service';
import { promises as fs } from 'fs';
import * as path from 'path';

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
  },
}));

describe('DataService', () => {
  let service: DataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataService],
    }).compile();

    service = module.get<DataService>(DataService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getEduData', () => {
    it('should return educational data', async () => {
      const eduData = [{ id: 1, title: 'Educational Project 1' }];
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(eduData));
      
      const result = await service.getEduData();
      expect(result).toEqual(eduData);
      expect(fs.readFile).toHaveBeenCalledWith(path.join(__dirname, 'edu.json'), 'utf-8');
    });
  });

  describe('getFunData', () => {
    it('should return fun data', async () => {
      const funData = [{ id: 1, title: 'Fun Project 1' }];
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(funData));
      
      const result = await service.getFunData();
      expect(result).toEqual(funData);
      expect(fs.readFile).toHaveBeenCalledWith(path.join(__dirname, 'fun.json'), 'utf-8');
    });
  });

  describe('getInfoData', () => {
    it('should return info data', async () => {
      const infoData = [{ id: 1, title: 'Project Alpha' }];
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(infoData));
      
      const result = await service.getInfoData();
      expect(result).toEqual(infoData);
      expect(fs.readFile).toHaveBeenCalledWith(path.join(__dirname, 'info.json'), 'utf-8');
    });
  });
});
