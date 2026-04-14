/**
 * Writes the current SQLite database to FE/js/*.json (repository default seed data).
 * Run from BE/API: npm run export:db-json
 */

import Database from 'better-sqlite3';
import * as path from 'path';
import { promises as fs } from 'fs';

type Row = {
  media: string | null;
  index_value: string | null;
  image: string | null;
  thumb: string | null;
  name: string | null;
  description: string | null;
  company: string | null;
  productDescription: string | null;
  technology: string | null;
};

function rowToSeedItem(row: Row): Record<string, string> {
  const out: Record<string, string> = {};
  const set = (k: string, v: string | null) => {
    out[k] = v ?? '';
  };
  set('media', row.media);
  set('index', row.index_value);
  set('image', row.image);
  set('thumb', row.thumb);
  set('name', row.name);
  set('description', row.description);
  set('company', row.company);
  set('productDescription', row.productDescription);
  set('technology', row.technology);
  return out;
}

async function exportTable(
  db: Database.Database,
  table: string,
  outFile: string,
  label: string
): Promise<void> {
  const rows = db
    .prepare(
      `SELECT media, index_value, image, thumb, name, description, company, productDescription, technology
       FROM ${table}
       ORDER BY CAST(COALESCE(index_value, '0') AS INTEGER), id`
    )
    .all() as Row[];

  const payload = rows.map(rowToSeedItem);
  const json = JSON.stringify(payload, null, 4) + '\n';
  await fs.writeFile(outFile, json, 'utf-8');
  console.log(`Wrote ${label}: ${payload.length} rows -> ${outFile}`);
}

async function main(): Promise<void> {
  const dbPath = path.join(process.cwd(), '..', 'DB', 'digitalflute.db');
  const outDir = path.resolve(process.cwd(), '..', '..', 'FE', 'js');

  const db = new Database(dbPath, { readonly: true });

  await exportTable(db, 'information', path.join(outDir, 'info.json'), 'information');
  await exportTable(db, 'education', path.join(outDir, 'edu.json'), 'education');
  await exportTable(db, 'entertainment', path.join(outDir, 'fun.json'), 'entertainment');

  db.close();
  console.log('Default seed JSON files updated under FE/js/');
}

main().catch((err) => {
  console.error('Export failed:', err);
  process.exit(1);
});
