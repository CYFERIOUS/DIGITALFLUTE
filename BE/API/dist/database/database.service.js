"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path = __importStar(require("path"));
const fs_1 = require("fs");
let DatabaseService = class DatabaseService {
    db;
    async onModuleInit() {
        await this.initializeDatabase();
    }
    onModuleDestroy() {
        if (this.db) {
            this.db.close();
        }
    }
    async initializeDatabase() {
        const dbDir = path.join(process.cwd(), '..', 'DB');
        await fs_1.promises.mkdir(dbDir, { recursive: true });
        const dbPath = path.join(dbDir, 'digitalflute.db');
        this.db = new better_sqlite3_1.default(dbPath);
        this.db.pragma('foreign_keys = ON');
        this.createTables();
        await this.populateFromJson();
    }
    createTables() {
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS information (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        media TEXT,
        index_value TEXT,
        image TEXT,
        thumb TEXT,
        name TEXT NOT NULL,
        description TEXT,
        company TEXT,
        productDescription TEXT,
        technology TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS education (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        media TEXT,
        index_value TEXT,
        image TEXT,
        thumb TEXT,
        name TEXT NOT NULL,
        description TEXT,
        company TEXT,
        productDescription TEXT,
        technology TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS entertainment (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        media TEXT,
        index_value TEXT,
        image TEXT,
        thumb TEXT,
        name TEXT NOT NULL,
        description TEXT,
        company TEXT,
        productDescription TEXT,
        technology TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('Database tables created successfully');
    }
    async populateFromJson(forceRepopulate = false) {
        try {
            const jsonMappings = [
                { table: 'information', file: 'info.json' },
                { table: 'education', file: 'edu.json' },
                { table: 'entertainment', file: 'fun.json' }
            ];
            for (const { table, file } of jsonMappings) {
                const possiblePaths = [
                    path.join(process.cwd(), 'src', 'data', file),
                    path.join(process.cwd(), 'dist', 'data', file),
                    path.join(__dirname, '..', 'data', file),
                    path.join(process.cwd(), 'API', 'src', 'data', file)
                ];
                let jsonData = [];
                let foundPath = '';
                for (const jsonPath of possiblePaths) {
                    try {
                        const fileContent = await fs_1.promises.readFile(jsonPath, 'utf-8');
                        const trimmedContent = fileContent.trim();
                        jsonData = JSON.parse(trimmedContent);
                        foundPath = jsonPath;
                        break;
                    }
                    catch (error) {
                        continue;
                    }
                }
                if (jsonData.length > 0) {
                    const countStmt = this.db.prepare(`SELECT COUNT(*) as count FROM ${table}`);
                    const currentCount = countStmt.get();
                    if (currentCount.count === 0 || forceRepopulate) {
                        if (forceRepopulate && currentCount.count > 0) {
                            console.log(`Clearing existing data from ${table} table...`);
                            this.db.prepare(`DELETE FROM ${table}`).run();
                        }
                        const insertStmt = this.db.prepare(`
              INSERT INTO ${table} (media, index_value, image, thumb, name, description, company, productDescription, technology)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
                        const insertMany = this.db.transaction((items) => {
                            for (const item of items) {
                                insertStmt.run(item.media || null, item.index || null, item.image || null, item.thumb || null, item.name || null, item.description || null, item.company || null, item.productDescription || null, item.technology || null);
                            }
                        });
                        insertMany(jsonData);
                        console.log(`✓ Populated ${table} table with ${jsonData.length} records from ${foundPath}`);
                    }
                    else {
                        console.log(`✓ ${table} table already has ${currentCount.count} records, skipping population`);
                    }
                }
                else {
                    console.warn(`⚠ Could not find or parse ${file}, skipping ${table} population`);
                    console.warn(`  Tried paths: ${possiblePaths.join(', ')}`);
                }
            }
        }
        catch (error) {
            console.error('Error populating database from JSON:', error);
            throw error;
        }
    }
    async repopulateFromJson() {
        console.log('Force repopulating database from JSON files...');
        await this.populateFromJson(true);
        console.log('Database repopulation completed!');
    }
    getDatabase() {
        return this.db;
    }
    getAllInformation() {
        return this.db.prepare('SELECT * FROM information ORDER BY CAST(index_value AS INTEGER)').all();
    }
    getInformationById(id) {
        return this.db.prepare('SELECT * FROM information WHERE id = ?').get(id);
    }
    getInformationByIndex(index) {
        return this.db.prepare('SELECT * FROM information WHERE index_value = ?').get(index);
    }
    getAllEducation() {
        return this.db.prepare('SELECT * FROM education ORDER BY CAST(index_value AS INTEGER)').all();
    }
    getEducationById(id) {
        return this.db.prepare('SELECT * FROM education WHERE id = ?').get(id);
    }
    getEducationByIndex(index) {
        return this.db.prepare('SELECT * FROM education WHERE index_value = ?').get(index);
    }
    getAllEntertainment() {
        return this.db.prepare('SELECT * FROM entertainment ORDER BY CAST(index_value AS INTEGER)').all();
    }
    getEntertainmentById(id) {
        return this.db.prepare('SELECT * FROM entertainment WHERE id = ?').get(id);
    }
    getEntertainmentByIndex(index) {
        return this.db.prepare('SELECT * FROM entertainment WHERE index_value = ?').get(index);
    }
    updateInformation(id, data) {
        if (!data || typeof data !== 'object') {
            return false;
        }
        const updateFields = [];
        const values = [];
        if (data.media !== undefined) {
            updateFields.push('media = ?');
            values.push(data.media);
        }
        if (data.index !== undefined) {
            updateFields.push('index_value = ?');
            values.push(data.index);
        }
        if (data.image !== undefined) {
            updateFields.push('image = ?');
            values.push(data.image);
        }
        if (data.thumb !== undefined) {
            updateFields.push('thumb = ?');
            values.push(data.thumb);
        }
        if (data.name !== undefined) {
            updateFields.push('name = ?');
            values.push(data.name);
        }
        if (data.description !== undefined) {
            updateFields.push('description = ?');
            values.push(data.description);
        }
        if (data.company !== undefined) {
            updateFields.push('company = ?');
            values.push(data.company);
        }
        if (data.productDescription !== undefined) {
            updateFields.push('productDescription = ?');
            values.push(data.productDescription);
        }
        if (data.technology !== undefined) {
            updateFields.push('technology = ?');
            values.push(data.technology);
        }
        if (updateFields.length === 0) {
            return false;
        }
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);
        const sql = `UPDATE information SET ${updateFields.join(', ')} WHERE id = ?`;
        const result = this.db.prepare(sql).run(...values);
        return result.changes > 0;
    }
    updateEducation(id, data) {
        if (!data || typeof data !== 'object') {
            return false;
        }
        const updateFields = [];
        const values = [];
        if (data.media !== undefined) {
            updateFields.push('media = ?');
            values.push(data.media);
        }
        if (data.index !== undefined) {
            updateFields.push('index_value = ?');
            values.push(data.index);
        }
        if (data.image !== undefined) {
            updateFields.push('image = ?');
            values.push(data.image);
        }
        if (data.thumb !== undefined) {
            updateFields.push('thumb = ?');
            values.push(data.thumb);
        }
        if (data.name !== undefined) {
            updateFields.push('name = ?');
            values.push(data.name);
        }
        if (data.description !== undefined) {
            updateFields.push('description = ?');
            values.push(data.description);
        }
        if (data.company !== undefined) {
            updateFields.push('company = ?');
            values.push(data.company);
        }
        if (data.productDescription !== undefined) {
            updateFields.push('productDescription = ?');
            values.push(data.productDescription);
        }
        if (data.technology !== undefined) {
            updateFields.push('technology = ?');
            values.push(data.technology);
        }
        if (updateFields.length === 0) {
            return false;
        }
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);
        const sql = `UPDATE education SET ${updateFields.join(', ')} WHERE id = ?`;
        const result = this.db.prepare(sql).run(...values);
        return result.changes > 0;
    }
    updateEntertainment(id, data) {
        if (!data || typeof data !== 'object') {
            return false;
        }
        const updateFields = [];
        const values = [];
        if (data.media !== undefined) {
            updateFields.push('media = ?');
            values.push(data.media);
        }
        if (data.index !== undefined) {
            updateFields.push('index_value = ?');
            values.push(data.index);
        }
        if (data.image !== undefined) {
            updateFields.push('image = ?');
            values.push(data.image);
        }
        if (data.thumb !== undefined) {
            updateFields.push('thumb = ?');
            values.push(data.thumb);
        }
        if (data.name !== undefined) {
            updateFields.push('name = ?');
            values.push(data.name);
        }
        if (data.description !== undefined) {
            updateFields.push('description = ?');
            values.push(data.description);
        }
        if (data.company !== undefined) {
            updateFields.push('company = ?');
            values.push(data.company);
        }
        if (data.productDescription !== undefined) {
            updateFields.push('productDescription = ?');
            values.push(data.productDescription);
        }
        if (data.technology !== undefined) {
            updateFields.push('technology = ?');
            values.push(data.technology);
        }
        if (updateFields.length === 0) {
            return false;
        }
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);
        const sql = `UPDATE entertainment SET ${updateFields.join(', ')} WHERE id = ?`;
        const result = this.db.prepare(sql).run(...values);
        return result.changes > 0;
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)()
], DatabaseService);
//# sourceMappingURL=database.service.js.map