/**
 * Standalone Database Population Script
 * 
 * This script populates the SQLite database with data from JSON files.
 * Run with: npx ts-node src/database/populate-db.ts
 * 
 * Or compile and run: npm run build && node dist/database/populate-db.js
 */

import Database from 'better-sqlite3';
import * as path from 'path';
import { promises as fs } from 'fs';

async function populateDatabase() {
  console.log('🚀 Starting database population...\n');

  // Ensure DB directory exists
  const dbDir = path.join(process.cwd(), '..', 'DB');
  await fs.mkdir(dbDir, { recursive: true });

  const dbPath = path.join(dbDir, 'digitalflute.db');
  console.log(`📁 Database path: ${dbPath}\n`);

  const db = new Database(dbPath);

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Create tables
  console.log('📋 Creating tables...');
  
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

  console.log('✓ Tables created successfully\n');

  // Populate from JSON
  const jsonMappings = [
    { table: 'information', file: 'info.json' },
    { table: 'education', file: 'edu.json' },
    { table: 'entertainment', file: 'fun.json' }
  ];

  for (const { table, file } of jsonMappings) {
    console.log(`📦 Processing ${file}...`);
    
    const possiblePaths = [
      path.resolve(process.cwd(), '..', '..', 'FE', 'js', file),
      path.resolve(process.cwd(), 'FE', 'js', file),
      path.join(process.cwd(), 'src', 'data', file),
      path.join(process.cwd(), 'dist', 'data', file),
      path.join(__dirname, '..', 'data', file)
    ];

    let jsonData: any[] = [];
    let foundPath = '';
    
    for (const jsonPath of possiblePaths) {
      try {
        const fileContent = await fs.readFile(jsonPath, 'utf-8');
        const trimmedContent = fileContent.trim();
        jsonData = JSON.parse(trimmedContent);
        foundPath = jsonPath;
        break;
      } catch (error) {
        continue;
      }
    }

    if (jsonData.length > 0) {
      // Clear existing data
      const deleteStmt = db.prepare(`DELETE FROM ${table}`);
      deleteStmt.run();
      console.log(`  ✓ Cleared existing data from ${table}`);

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
      console.log(`  ✓ Inserted ${jsonData.length} records into ${table} table`);
      console.log(`  📄 Source: ${foundPath}\n`);
    } else {
      console.warn(`  ⚠ Could not find or parse ${file}`);
      console.warn(`    Tried paths: ${possiblePaths.join(', ')}\n`);
    }
  }

  // Verify population
  console.log('🔍 Verifying population...\n');
  const infoCount = db.prepare('SELECT COUNT(*) as count FROM information').get() as { count: number };
  const eduCount = db.prepare('SELECT COUNT(*) as count FROM education').get() as { count: number };
  const funCount = db.prepare('SELECT COUNT(*) as count FROM entertainment').get() as { count: number };

  console.log(`📊 Database Statistics:`);
  console.log(`   Information: ${infoCount.count} records`);
  console.log(`   Education: ${eduCount.count} records`);
  console.log(`   Entertainment: ${funCount.count} records`);
  console.log(`   Total: ${infoCount.count + eduCount.count + funCount.count} records\n`);

  db.close();
  console.log('✅ Database population completed successfully!');
}

populateDatabase().catch((error) => {
  console.error('❌ Error populating database:', error);
  process.exit(1);
});

