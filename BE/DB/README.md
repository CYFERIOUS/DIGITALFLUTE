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
