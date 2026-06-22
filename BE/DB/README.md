# Digital Flute database (SQLite)

This folder holds the SQLite file used by the Nest API: **`digitalflute.db`**.

The database file is **not committed** (see `.gitignore`). After cloning the repo, create and fill it using the steps below.

## Prerequisites

- Node.js and npm
- Dependencies installed for the API (the populate script runs from `BE/API`)

## Populate the database after install

1. Open a terminal at the **API** package (from the repository root):

   ```bash
   cd BE/API
   ```

2. Install dependencies if you have not already:

   ```bash
   npm install
   ```

3. Run the population script. It creates `../DB/digitalflute.db` (if needed), applies the schema, and loads rows from the default seed JSON files:

   ```bash
   npm run populate:db
   ```

Seed data is read from:

- `FE/js/info.json` → `information` table  
- `FE/js/edu.json` → `education` table  
- `FE/js/fun.json` → `entertainment` table  

4. Start the API as usual (`npm run start` or `npm run start:dev`). On first startup, if the tables are **empty**, the service will also try to load from those same JSON paths; running `populate:db` explicitly is still recommended so you have a known-good database immediately.

## Optional: reset data from JSON again

With the API running and the backend reachable:

- `POST http://localhost:5000/database/repopulate`  
  Clears the three content tables and reloads them from `FE/js/*.json`.

Or run `npm run populate:db` again from `BE/API` (it clears and re-inserts when invoked).

## Optional: save the current DB back to repository seed files

After editing data in the database (or via the admin app), you can write the tables back to `FE/js` so the repo default stays in sync:

```bash
cd BE/API
npm run export:db-json
```

That updates `FE/js/info.json`, `edu.json`, and `fun.json` from the current `digitalflute.db`.

## ChartDB (schema diagram)

[ChartDB](https://chartdb.io) can visualize this SQLite schema using **database metadata** JSON (the same shape as ChartDB’s SQLite “Smart Query” result).

**Do not use ChartDB’s “Import diagram”** for this file. That action expects a **saved diagram** export (tables with x/y positions, diagram `id`, etc.). Our file is **metadata** for **Import database → SQLite → Query** (paste JSON). See `chartdb/README.md` for step-by-step instructions and troubleshooting.

This repo includes:

| File | Purpose |
|------|---------|
| `chartdb/sqlite-metadata-query.sql` | ChartDB’s standard SQLite metadata query (from [chartdb/chartdb](https://github.com/chartdb/chartdb)). |
| `chartdb/chartdb-sqlite-metadata.json` | **Generated** metadata JSON for the current `digitalflute.db`. Commit when the schema changes. |
| `chartdb/generate-import.mjs` | Regenerates that JSON using `better-sqlite3`. |

### Regenerate the ChartDB metadata file

After `digitalflute.db` exists (see **Populate the database** above), from **`BE/DB`**:

```bash
npm install
npm run chartdb:json
```

This overwrites `chartdb/chartdb-sqlite-metadata.json`.

### Open in ChartDB

1. [app.chartdb.io](https://app.chartdb.io) → **Import database** (not “Import diagram”).
2. Database type: **SQLite** → import method: **Query**.
3. Paste the full contents of `chartdb/chartdb-sqlite-metadata.json`.

Alternatively, run `chartdb/sqlite-metadata-query.sql` in the `sqlite3` CLI against `digitalflute.db` and paste the query’s JSON result (see [ChartDB README](https://github.com/chartdb/chartdb#try-it-on-our-website)).

### Schema overview (Digital Flute)

- **`information`**, **`education`**, **`entertainment`**: same column layout — portfolio items keyed by auto-increment `id`, with `index_value` used as the display order key in the API (`index` in JSON). No foreign keys between tables. SQLite’s internal **`sqlite_sequence`** table may appear after inserts with `AUTOINCREMENT`.
