import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Database from 'better-sqlite3';
import * as path from 'path';
import { promises as fs } from 'fs';

type DatabaseInstance = InstanceType<typeof Database>;

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private db: DatabaseInstance;

  async onModuleInit() {
    await this.initializeDatabase();
  }

  onModuleDestroy() {
    if (this.db) {
      this.db.close();
    }
  }

  private async initializeDatabase(): Promise<void> {
    // Ensure DB directory exists
    const dbDir = path.join(process.cwd(), '..', 'DB');
    await fs.mkdir(dbDir, { recursive: true });

    const dbPath = path.join(dbDir, 'digitalflute.db');
    this.db = new Database(dbPath);

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

  private async populateFromJson(forceRepopulate: boolean = false): Promise<void> {
    try {
      // Load JSON files
      const jsonMappings = [
        { table: 'information', file: 'info.json' },
        { table: 'education', file: 'edu.json' },
        { table: 'entertainment', file: 'fun.json' }
      ];

      for (const { table, file } of jsonMappings) {
        // Try multiple paths to find JSON files
        const possiblePaths = [
          path.join(process.cwd(), 'src', 'data', file),
          path.join(process.cwd(), 'dist', 'data', file),
          path.join(__dirname, '..', 'data', file),
          path.join(process.cwd(), 'API', 'src', 'data', file)
        ];

        let jsonData: any[] = [];
        let foundPath = '';
        
        for (const jsonPath of possiblePaths) {
          try {
            const fileContent = await fs.readFile(jsonPath, 'utf-8');
            // Trim whitespace and parse JSON
            const trimmedContent = fileContent.trim();
            jsonData = JSON.parse(trimmedContent);
            foundPath = jsonPath;
            break;
          } catch (error) {
            continue;
          }
        }

        if (jsonData.length > 0) {
          // Check current count
          const countStmt = this.db.prepare(`SELECT COUNT(*) as count FROM ${table}`);
          const currentCount = countStmt.get() as { count: number };

          if (currentCount.count === 0 || forceRepopulate) {
            if (forceRepopulate && currentCount.count > 0) {
              console.log(`Clearing existing data from ${table} table...`);
              this.db.prepare(`DELETE FROM ${table}`).run();
            }

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

            insertMany(jsonData);
            console.log(`✓ Populated ${table} table with ${jsonData.length} records from ${foundPath}`);
          } else {
            console.log(`✓ ${table} table already has ${currentCount.count} records, skipping population`);
          }
        } else {
          console.warn(`⚠ Could not find or parse ${file}, skipping ${table} population`);
          console.warn(`  Tried paths: ${possiblePaths.join(', ')}`);
        }
      }
    } catch (error) {
      console.error('Error populating database from JSON:', error);
      throw error;
    }
  }

  /**
   * Force repopulate all tables from JSON files
   * This will clear existing data and reload from JSON files
   */
  async repopulateFromJson(): Promise<void> {
    console.log('Force repopulating database from JSON files...');
    await this.populateFromJson(true);
    console.log('Database repopulation completed!');
  }

  getDatabase(): DatabaseInstance {
    return this.db;
  }

  // Information methods
  getAllInformation(): any[] {
    return this.db.prepare('SELECT * FROM information ORDER BY CAST(index_value AS INTEGER)').all();
  }

  getInformationById(id: number): any {
    return this.db.prepare('SELECT * FROM information WHERE id = ?').get(id);
  }

  getInformationByIndex(index: string): any {
    return this.db.prepare('SELECT * FROM information WHERE index_value = ?').get(index);
  }

  // Education methods
  getAllEducation(): any[] {
    return this.db.prepare('SELECT * FROM education ORDER BY CAST(index_value AS INTEGER)').all();
  }

  getEducationById(id: number): any {
    return this.db.prepare('SELECT * FROM education WHERE id = ?').get(id);
  }

  getEducationByIndex(index: string): any {
    return this.db.prepare('SELECT * FROM education WHERE index_value = ?').get(index);
  }

  // Entertainment methods
  getAllEntertainment(): any[] {
    return this.db.prepare('SELECT * FROM entertainment ORDER BY CAST(index_value AS INTEGER)').all();
  }

  getEntertainmentById(id: number): any {
    return this.db.prepare('SELECT * FROM entertainment WHERE id = ?').get(id);
  }

  getEntertainmentByIndex(index: string): any {
    return this.db.prepare('SELECT * FROM entertainment WHERE index_value = ?').get(index);
  }

  // Update methods for Information
  updateInformation(id: number, data: Partial<{
    media: string;
    index: string;
    image: string;
    thumb: string;
    name: string;
    description: string;
    company: string;
    productDescription: string;
    technology: string;
  }>): boolean {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const updateFields: string[] = [];
    const values: any[] = [];

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

  // Update methods for Education
  updateEducation(id: number, data: Partial<{
    media: string;
    index: string;
    image: string;
    thumb: string;
    name: string;
    description: string;
    company: string;
    productDescription: string;
    technology: string;
  }>): boolean {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const updateFields: string[] = [];
    const values: any[] = [];

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

  // Update methods for Entertainment
  updateEntertainment(id: number, data: Partial<{
    media: string;
    index: string;
    image: string;
    thumb: string;
    name: string;
    description: string;
    company: string;
    productDescription: string;
    technology: string;
  }>): boolean {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const updateFields: string[] = [];
    const values: any[] = [];

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
}

