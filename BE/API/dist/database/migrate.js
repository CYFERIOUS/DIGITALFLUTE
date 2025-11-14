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
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path = __importStar(require("path"));
const fs_1 = require("fs");
async function migrate() {
    console.log('Starting database migration...');
    const dbDir = path.join(process.cwd(), '..', 'DB');
    await fs_1.promises.mkdir(dbDir, { recursive: true });
    const dbPath = path.join(dbDir, 'digitalflute.db');
    const db = new better_sqlite3_1.default(dbPath);
    db.pragma('foreign_keys = ON');
    console.log('Creating tables...');
    db.exec(`
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
    db.exec(`
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
    db.exec(`
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
    console.log('Tables created successfully');
    const jsonMappings = [
        { table: 'information', file: 'info.json' },
        { table: 'education', file: 'edu.json' },
        { table: 'entertainment', file: 'fun.json' }
    ];
    for (const { table, file } of jsonMappings) {
        const possiblePaths = [
            path.join(process.cwd(), 'src', 'data', file),
            path.join(process.cwd(), 'dist', 'data', file)
        ];
        let jsonData = [];
        for (const jsonPath of possiblePaths) {
            try {
                const fileContent = await fs_1.promises.readFile(jsonPath, 'utf-8');
                jsonData = JSON.parse(fileContent);
                break;
            }
            catch {
                continue;
            }
        }
        if (jsonData.length > 0) {
            db.prepare(`DELETE FROM ${table}`).run();
            const insertStmt = db.prepare(`
        INSERT INTO ${table} (media, index_value, image, thumb, name, description, company, productDescription, technology)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
            const insertMany = db.transaction((items) => {
                for (const item of items) {
                    insertStmt.run(item.media || null, item.index || null, item.image || null, item.thumb || null, item.name || null, item.description || null, item.company || null, item.productDescription || null, item.technology || null);
                }
            });
            insertMany(jsonData);
            console.log(`Populated ${table} table with ${jsonData.length} records`);
        }
        else {
            console.warn(`Could not find ${file}, skipping ${table} population`);
        }
    }
    db.close();
    console.log('Migration completed successfully!');
}
migrate().catch(console.error);
//# sourceMappingURL=migrate.js.map