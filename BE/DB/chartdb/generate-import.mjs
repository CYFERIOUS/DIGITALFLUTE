/**
 * Generates ChartDB *database metadata* JSON from ../digitalflute.db (Smart Query result shape).
 * Run from BE/DB: node chartdb/generate-import.mjs
 *
 * This is NOT a saved ChartDB diagram file. See chartdb/README.md for where to paste it in the app.
 */
import Database from 'better-sqlite3';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', 'digitalflute.db');
const sqlPath = join(__dirname, 'sqlite-metadata-query.sql');
const outPath = join(__dirname, 'chartdb-sqlite-metadata.json');

if (!fs.existsSync(dbPath)) {
  console.error('Missing database. Create it first: cd ../API && npm run populate:db');
  process.exit(1);
}

const sql = fs.readFileSync(sqlPath, 'utf8');
const db = new Database(dbPath, { readonly: true });
const row = db.prepare(sql).get();
db.close();

const raw = row[Object.keys(row)[0]];
if (typeof raw !== 'string') {
  console.error('Unexpected query result', row);
  process.exit(1);
}

/** better-sqlite3 returns text where inner JSON used \" — normalize to valid JSON */
const fixed = raw.replace(/\\"/g, '"');
const data = JSON.parse(fixed);

/** Match ChartDB PrimaryKeyInfo; drop sqlite internal noise for a cleaner ERD */
function sanitizeMetadata(meta) {
  const skip = (t) => t === 'sqlite_sequence';

  const pk_info = (meta.pk_info || [])
    .filter((p) => !skip(p.table))
    .map((p) => ({
      schema: p.schema ?? '',
      table: p.table,
      column: p.column,
      pk_def: p.pk_def
    }));

  const columns = (meta.columns || []).filter((c) => !skip(c.table));

  const tables = (meta.tables || []).filter((t) => !skip(t.table));

  const indexes = (meta.indexes || []).filter((i) => !skip(i.table));

  return {
    fk_info: meta.fk_info || [],
    pk_info,
    columns,
    indexes,
    tables,
    views: meta.views || [],
    database_name: meta.database_name ?? 'sqlite',
    version: String(meta.version ?? '')
  };
}

const sanitized = sanitizeMetadata(data);
const pretty = JSON.stringify(sanitized, null, 2) + '\n';
fs.writeFileSync(outPath, pretty, 'utf-8');
console.log('Wrote', outPath, 'bytes', Buffer.byteLength(pretty, 'utf8'));
