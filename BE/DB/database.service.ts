import { Injectable, OnModuleInit } from '@nestjs/common';
import { Database } from 'better-sqlite3';
import * as DatabaseLib from 'better-sqlite3';
import * as path from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private db: Database;

  async onModuleInit() {
    await this.initializeDatabase();
  }

  private async initializeDatabase(): Promise<void> {
    // Ensure DB directory exists
    const dbDir = path.join(process.cwd(), 'DB');
    await fs.mkdir(dbDir, { recursive: true });

    const dbPath = path.join(dbDir, 'digitalflute.db');
    this.db = new DatabaseLib(dbPath);

    // Enable foreign keys
    this.db.pragma('foreign_keys = ON');

    // Create tables
    this.createTables();

    // Populate tables from JSON files if they're empty
    await this.populateFromJson();
  }

  private createTables(): void {
    // Information table
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

    // Education table
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

    // Entertainment table
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

  private async populateFromJson(): Promise<void> {
    try {
      // Check if tables are empty
      const infoCount = this.db.prepare('SELECT COUNT(*) as count FROM information').get() as { count: number };
      const eduCount = this.db.prepare('SELECT COUNT(*) as count FROM education').get() as { count: number };
      const funCount = this.db.prepare('SELECT COUNT(*) as count FROM entertainment').get() as { count: number };

      // Load JSON files
      const jsonPaths = [
        { table: 'information', file: 'info.json' },
        { table: 'education', file: 'edu.json' },
        { table: 'entertainment', file: 'fun.json' }
      ];

      for (const { table, file } of jsonPaths) {
        const possiblePaths = [
          path.join(process.cwd(), 'src', 'data', file),
          path.join(process.cwd(), 'API', 'src', 'data', file),
          path.join(__dirname, '..', 'API', 'src', 'data', file)
        ];

        let jsonData: any[] = [];
        for (const jsonPath of possiblePaths) {
          try {
            const fileContent = await fs.readFile(jsonPath, 'utf-8');
            jsonData = JSON.parse(fileContent);
            break;
          } catch {
            continue;
          }
        }

        if (jsonData.length > 0) {
          const insertStmt = this.db.prepare(`
            INSERT INTO ${table} (media, index_value, image, thumb, name, description, company, productDescription, technology)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);

          const insertMany = this.db.transaction((items: any[]) => {
            for (const item of items) {
              insertStmt.run(
                item.media || null,
                item.index || null,
                item.image || null,
                item.thumb || null,
                item.name || null,
                item.description || null,
                item.company || null,
                item.productDescription || null,
                item.technology || null
              );
            }
          });

          // Check current count
          const countStmt = this.db.prepare(`SELECT COUNT(*) as count FROM ${table}`);
          const currentCount = countStmt.get() as { count: number };

          if (currentCount.count === 0) {
            insertMany(jsonData);
            console.log(`Populated ${table} table with ${jsonData.length} records`);
          }
        }
      }
    } catch (error) {
      console.error('Error populating database from JSON:', error);
    }
  }

  getDatabase(): Database {
    return this.db;
  }

  // Information methods
  getAllInformation(): any[] {
    return this.db.prepare('SELECT * FROM information ORDER BY index_value').all();
  }

  getInformationById(id: number): any {
    return this.db.prepare('SELECT * FROM information WHERE id = ?').get(id);
  }

  // Education methods
  getAllEducation(): any[] {
    return this.db.prepare('SELECT * FROM education ORDER BY index_value').all();
  }

  getEducationById(id: number): any {
    return this.db.prepare('SELECT * FROM education WHERE id = ?').get(id);
  }

  // Entertainment methods
  getAllEntertainment(): any[] {
    return this.db.prepare('SELECT * FROM entertainment ORDER BY index_value').all();
  }

  getEntertainmentById(id: number): any {
    return this.db.prepare('SELECT * FROM entertainment WHERE id = ?').get(id);
  }

  onModuleDestroy() {
    if (this.db) {
      this.db.close();
    }
  }
}

