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

    // Migrate image and thumb columns to TEXT if needed
    this.migrateImageThumbToText();

    // Populate tables from JSON files if they're empty
    await this.populateFromJson();

    // Restore image and thumb URLs from JSON files (in case they're missing)
    await this.restoreImageThumbUrls();
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

  /**
   * Migrate image and thumb columns to TEXT type
   * This ensures that image and thumb fields are stored as strings (URLs/paths)
   * rather than BLOB or other types
   */
  private migrateImageThumbToText(): void {
    const tables = ['information', 'education', 'entertainment'];
    
    for (const tableName of tables) {
      try {
        // Check if table exists
        const tableInfo = this.db.prepare(`
          SELECT name FROM sqlite_master 
          WHERE type='table' AND name=?
        `).get(tableName) as { name: string } | undefined;

        if (!tableInfo) {
          console.log(`Table ${tableName} does not exist, will be created with TEXT columns`);
          continue;
        }

        // Get current schema
        const schema = this.db.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{
          cid: number;
          name: string;
          type: string;
          notnull: number;
          dflt_value: any;
          pk: number;
        }>;

        const imageColumn = schema.find(col => col.name === 'image');
        const thumbColumn = schema.find(col => col.name === 'thumb');

        // Check if migration is needed
        const needsMigration = 
          (imageColumn && imageColumn.type.toUpperCase() !== 'TEXT') ||
          (thumbColumn && thumbColumn.type.toUpperCase() !== 'TEXT');

        if (needsMigration) {
          console.log(`Migrating ${tableName} table: converting image and thumb columns to TEXT...`);
          
          // Create backup table
          const backupTable = `${tableName}_backup_${Date.now()}`;
          this.db.exec(`CREATE TABLE ${backupTable} AS SELECT * FROM ${tableName}`);
          
          // Drop original table
          this.db.exec(`DROP TABLE ${tableName}`);
          
          // Recreate table with TEXT columns
          if (tableName === 'information') {
            this.db.exec(`
              CREATE TABLE information (
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
          } else if (tableName === 'education') {
            this.db.exec(`
              CREATE TABLE education (
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
          } else if (tableName === 'entertainment') {
            this.db.exec(`
              CREATE TABLE entertainment (
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
          }
          
          // Migrate data (convert BLOB to string if needed)
          const backupData = this.db.prepare(`SELECT * FROM ${backupTable}`).all();
          if (backupData.length > 0) {
            const insertStmt = this.db.prepare(`
              INSERT INTO ${tableName} 
              (id, media, index_value, image, thumb, name, description, company, productDescription, technology, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            
            const insertMany = this.db.transaction((items: any[]) => {
              for (const item of items) {
                // Convert image and thumb to strings if they're BLOB
                let imageValue = item.image;
                let thumbValue = item.thumb;
                
                if (Buffer.isBuffer(imageValue)) {
                  imageValue = imageValue.toString('utf8');
                } else if (imageValue !== null && imageValue !== undefined) {
                  imageValue = String(imageValue);
                }
                
                if (Buffer.isBuffer(thumbValue)) {
                  thumbValue = thumbValue.toString('utf8');
                } else if (thumbValue !== null && thumbValue !== undefined) {
                  thumbValue = String(thumbValue);
                }
                
                insertStmt.run(
                  item.id,
                  item.media || null,
                  item.index_value || null,
                  imageValue || null,
                  thumbValue || null,
                  item.name || null,
                  item.description || null,
                  item.company || null,
                  item.productDescription || null,
                  item.technology || null,
                  item.created_at || null,
                  item.updated_at || null
                );
              }
            });
            
            insertMany(backupData);
            console.log(`✓ Migrated ${backupData.length} records from ${backupTable} to ${tableName}`);
          }
          
          // Drop backup table
          this.db.exec(`DROP TABLE ${backupTable}`);
          console.log(`✓ Migration completed for ${tableName} table`);
        } else {
          console.log(`✓ ${tableName} table already has TEXT columns for image and thumb`);
        }
      } catch (error) {
        console.error(`Error migrating ${tableName} table:`, error);
        // Continue with other tables even if one fails
      }
    }
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
          // Canonical seed data checked in with the frontend
          path.resolve(process.cwd(), '..', '..', 'FE', 'js', file),
          path.resolve(process.cwd(), 'FE', 'js', file),
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

  /**
   * Restore image and thumb URLs from JSON files
   * Updates existing records with image and thumb values from JSON files
   * Matches records by index_value
   */
  async restoreImageThumbUrls(): Promise<void> {
    console.log('Restoring image and thumbnail URLs from JSON files...');
    console.log(`Current working directory: ${process.cwd()}`);
    console.log(`__dirname: ${__dirname}`);
    
    const jsonMappings = [
      { table: 'information', file: 'info.json' },
      { table: 'education', file: 'edu.json' },
      { table: 'entertainment', file: 'fun.json' }
    ];

    for (const { table, file } of jsonMappings) {
      try {
        // Try multiple paths to find JSON files
        // The JSON files are in FE/js/ directory at project root
        const possiblePaths = [
          // Path from BE/API directory (most common case)
          path.resolve(process.cwd(), '..', '..', 'FE', 'js', file),
          // Path from project root
          path.resolve(process.cwd(), 'FE', 'js', file),
          // Path using __dirname (from compiled dist folder)
          path.resolve(__dirname, '..', '..', '..', '..', 'FE', 'js', file),
          // Path from BE directory
          path.resolve(process.cwd(), '..', 'FE', 'js', file),
          // Legacy paths (for backward compatibility)
          path.join(process.cwd(), 'src', 'data', file),
          path.join(process.cwd(), 'dist', 'data', file),
          path.join(__dirname, '..', 'data', file),
          path.join(process.cwd(), 'API', 'src', 'data', file)
        ];

        let jsonData: any[] = [];
        let foundPath = '';
        
        for (const jsonPath of possiblePaths) {
          try {
            // Check if file exists before trying to read
            await fs.access(jsonPath);
            const fileContent = await fs.readFile(jsonPath, 'utf-8');
            const trimmedContent = fileContent.trim();
            jsonData = JSON.parse(trimmedContent);
            foundPath = jsonPath;
            console.log(`✓ Found ${file} at: ${jsonPath}`);
            break;
          } catch (error) {
            // File doesn't exist or can't be read, try next path
            continue;
          }
        }

        if (jsonData.length > 0) {
          console.log(`Found ${jsonData.length} records in ${file} at ${foundPath}`);
          
          // Prepare update statement
          const updateStmt = this.db.prepare(`
            UPDATE ${table} 
            SET image = ?, thumb = ?, updated_at = CURRENT_TIMESTAMP
            WHERE index_value = ?
          `);

          let updatedCount = 0;
          let skippedCount = 0;

          const updateMany = this.db.transaction((items: any[]) => {
            for (const item of items) {
              const indexValue = String(item.index || item.index_value || '');
              const imageValue = item.image || null;
              const thumbValue = item.thumb || null;

              if (indexValue) {
                const result = updateStmt.run(imageValue, thumbValue, indexValue);
                if (result.changes > 0) {
                  updatedCount++;
                } else {
                  skippedCount++;
                }
              }
            }
          });

          updateMany(jsonData);
          console.log(`✓ Updated ${updatedCount} records in ${table} table with image/thumb URLs`);
          if (skippedCount > 0) {
            console.log(`  (${skippedCount} records skipped - index not found in database)`);
          }
        } else {
          console.warn(`⚠ Could not find or parse ${file}, skipping ${table} restoration`);
          console.warn(`  Tried paths: ${possiblePaths.map(p => path.resolve(p)).join(', ')}`);
        }
      } catch (error) {
        console.error(`Error restoring image/thumb URLs for ${table}:`, error);
      }
    }
    
    console.log('Image and thumbnail URL restoration completed!');
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

