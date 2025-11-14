/**
 * Database Migration Script
 * 
 * This script can be run manually to initialize or reset the database.
 * Run with: npx ts-node src/database/migrate.ts
 */

import Database from 'better-sqlite3';
import * as path from 'path';
import { promises as fs } from 'fs';

async function migrate() {
  console.log('Starting database migration...');

  // Ensure DB directory exists
  const dbDir = path.join(process.cwd(), '..', 'DB');
  await fs.mkdir(dbDir, { recursive: true });

  const dbPath = path.join(dbDir, 'digitalflute.db');
  const db = new Database(dbPath);

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Create tables
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

  // Populate from JSON
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
      // Clear existing data (optional - remove if you want to keep existing data)
      db.prepare(`DELETE FROM ${table}`).run();

      const insertStmt = db.prepare(`
        INSERT INTO ${table} (media, index_value, image, thumb, name, description, company, productDescription, technology)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const insertMany = db.transaction((items: any[]) => {
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
      console.log(`Populated ${table} table with ${jsonData.length} records`);
    } else {
      console.warn(`Could not find ${file}, skipping ${table} population`);
    }
  }

  db.close();
  console.log('Migration completed successfully!');
}

migrate().catch(console.error);

