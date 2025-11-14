# Database Population Guide

This guide explains how to populate the SQLite database with data from the JSON files served by the API.

## Automatic Population

The database is **automatically populated** when the NestJS application starts:

1. When you run `npm run start:dev` or `npm start`, the `DatabaseService` initializes
2. It checks if tables are empty
3. If empty, it automatically loads data from JSON files (`info.json`, `edu.json`, `fun.json`)
4. Data is inserted into the respective tables

## Manual Population Methods

### Method 1: Using npm script (Recommended)

```bash
cd BE/API
npm run populate:db
```

This will:
- Create tables if they don't exist
- Clear existing data
- Populate from JSON files
- Show statistics

### Method 2: Using API endpoint

After starting the server, you can trigger repopulation via HTTP:

```bash
curl -X POST http://localhost:5000/database/repopulate
```

Or use Postman/Insomnia to send a POST request to:
```
POST http://localhost:5000/database/repopulate
```

### Method 3: Direct script execution

```bash
cd BE/API
npx ts-node src/database/populate-db.ts
```

## Database Location

The SQLite database file is created at:
```
BE/DB/digitalflute.db
```

## JSON File Locations

The population script looks for JSON files in these locations (in order):
1. `BE/API/src/data/info.json`
2. `BE/API/src/data/edu.json`
3. `BE/API/src/data/fun.json`

Or in the dist folder:
- `BE/API/dist/data/info.json`
- `BE/API/dist/data/edu.json`
- `BE/API/dist/data/fun.json`

## Tables Created

1. **information** - Stores information/project data
2. **education** - Stores education-related project data
3. **entertainment** - Stores entertainment/game project data

## Schema

All tables have the same structure:
- `id` - Primary key (auto-increment)
- `media` - Media URL (YouTube embed, etc.)
- `index_value` - Original index from JSON
- `image` - Image identifier
- `thumb` - Thumbnail path
- `name` - Project name (required)
- `description` - Short description
- `company` - Company/client name
- `productDescription` - Detailed product description
- `technology` - Technologies used
- `created_at` - Creation timestamp
- `updated_at` - Update timestamp

## Verification

After population, you can verify the data:

1. Check the console output when starting the server
2. Query the API endpoints:
   - `GET http://localhost:5000/info`
   - `GET http://localhost:5000/edu`
   - `GET http://localhost:5000/fun`

## Troubleshooting

### Database not populating

1. Check that JSON files exist in the expected locations
2. Verify JSON files are valid JSON format
3. Check console logs for error messages
4. Ensure the DB directory exists and is writable

### Force repopulation

If you need to clear and repopulate:
- Use the API endpoint: `POST /database/repopulate`
- Or run: `npm run populate:db`

### Check database contents

You can use SQLite command-line tool:
```bash
sqlite3 BE/DB/digitalflute.db
.tables
SELECT COUNT(*) FROM information;
SELECT COUNT(*) FROM education;
SELECT COUNT(*) FROM entertainment;
```

