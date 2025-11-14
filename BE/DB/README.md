# SQLite Database Setup

This directory contains the SQLite database file (`digitalflute.db`) for the Digital Flute backend API.

## Database Structure

The database contains three main tables:

### 1. Information Table
Stores information/project data.

### 2. Education Table
Stores education-related project data.

### 3. Entertainment Table
Stores entertainment/game project data.

## Schema

All three tables have the same structure:

- `id` - INTEGER PRIMARY KEY AUTOINCREMENT
- `media` - TEXT (YouTube embed URL or media link)
- `index_value` - TEXT (original index from JSON)
- `image` - TEXT (image identifier)
- `thumb` - TEXT (thumbnail path)
- `name` - TEXT NOT NULL (project name)
- `description` - TEXT (short description)
- `company` - TEXT (company/client name)
- `productDescription` - TEXT (detailed product description)
- `technology` - TEXT (technologies used)
- `created_at` - DATETIME (auto-generated timestamp)
- `updated_at` - DATETIME (auto-generated timestamp)

## Initialization

The database is automatically initialized when the NestJS application starts:

1. Tables are created if they don't exist
2. Data is populated from JSON files (`info.json`, `edu.json`, `fun.json`) if tables are empty
3. The database file is created at `BE/DB/digitalflute.db`

## Usage

The database is accessed through the `DatabaseService` in `API/src/database/database.service.ts`.

## Notes

- The database file is created automatically on first run
- Data is only populated if tables are empty (prevents duplicate entries)
- The `index_value` field stores the original `index` from JSON files
- All timestamps are automatically managed by SQLite

