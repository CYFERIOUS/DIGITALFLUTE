"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let DataService = class DataService {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async getEduData() {
        try {
            const data = this.databaseService.getAllEducation();
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
        }
        catch (error) {
            console.error('Error loading education data from database:', error);
            throw new common_1.NotFoundException('Could not load education data');
        }
    }
    async getFunData() {
        try {
            const data = this.databaseService.getAllEntertainment();
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
        }
        catch (error) {
            console.error('Error loading entertainment data from database:', error);
            throw new common_1.NotFoundException('Could not load entertainment data');
        }
    }
    async getInfoData() {
        try {
            const data = this.databaseService.getAllInformation();
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
        }
        catch (error) {
            console.error('Error loading information data from database:', error);
            throw new common_1.NotFoundException('Could not load information data');
        }
    }
    async updateInformation(id, data) {
        try {
            if (!data || typeof data !== 'object') {
                throw new common_1.BadRequestException('Request body must be a valid JSON object');
            }
            const existing = this.databaseService.getInformationById(id);
            if (!existing) {
                throw new common_1.NotFoundException(`Information item with id ${id} not found`);
            }
            const success = this.databaseService.updateInformation(id, data);
            if (success) {
                return { success: true, message: 'Information item updated successfully' };
            }
            else {
                throw new common_1.BadRequestException('No fields to update');
            }
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error('Error updating information data:', error);
            throw new common_1.BadRequestException('Could not update information data');
        }
    }
    async updateEducation(id, data) {
        try {
            if (!data || typeof data !== 'object') {
                throw new common_1.BadRequestException('Request body must be a valid JSON object');
            }
            const existing = this.databaseService.getEducationById(id);
            if (!existing) {
                throw new common_1.NotFoundException(`Education item with id ${id} not found`);
            }
            const success = this.databaseService.updateEducation(id, data);
            if (success) {
                return { success: true, message: 'Education item updated successfully' };
            }
            else {
                throw new common_1.BadRequestException('No fields to update');
            }
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error('Error updating education data:', error);
            throw new common_1.BadRequestException('Could not update education data');
        }
    }
    async updateEntertainment(id, data) {
        try {
            if (!data || typeof data !== 'object') {
                throw new common_1.BadRequestException('Request body must be a valid JSON object');
            }
            const existing = this.databaseService.getEntertainmentById(id);
            if (!existing) {
                throw new common_1.NotFoundException(`Entertainment item with id ${id} not found`);
            }
            const success = this.databaseService.updateEntertainment(id, data);
            if (success) {
                return { success: true, message: 'Entertainment item updated successfully' };
            }
            else {
                throw new common_1.BadRequestException('No fields to update');
            }
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error('Error updating entertainment data:', error);
            throw new common_1.BadRequestException('Could not update entertainment data');
        }
    }
};
exports.DataService = DataService;
exports.DataService = DataService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], DataService);
//# sourceMappingURL=data.service.js.map