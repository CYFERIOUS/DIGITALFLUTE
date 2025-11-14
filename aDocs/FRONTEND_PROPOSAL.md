
# Proposal for Frontend Modernization & SQLite Integration

## 1. Goal

This document proposes a comprehensive modernization strategy for the DigitalFlute project. The goal is to refactor the frontend into a more dynamic, single-page application (SPA-like) experience and to replace the static file-based data source (`.json` files and hardcoded arrays) with a robust SQLite database. This will create a more maintainable, scalable, and efficient application.

## 2. Current Architecture Analysis

- **Frontend:** The current frontend is a Multi-Page Application (MPA) built with a mix of technologies including PHP, HTML, jQuery, and various separate JavaScript files. Navigation between sections involves full page loads (e.g., to `sessions/infoSection_dynamic.php`), which is characteristic of older web applications.
- **Data Layer:** The data is scattered and inconsistent. It exists as hardcoded PHP arrays (`infoSection_dynamic.php`), static JSON files (`js/info.json`), and likely other formats across different sections. This makes data management difficult, error-prone, and inefficient.

## 3. Proposed Architecture

I propose a shift to a modern, API-centric architecture. The frontend will be refactored to function like a Single Page Application, and the backend will be powered by a new SQLite database and a PHP API.

### 3.1. Backend: SQLite Database and PHP API

1.  **Database:**
    - We will use a single SQLite database file, created at `database/digitalflute.sqlite`.
    - This database will contain tables to structure the application's data. A primary table would be `projects`.
    - **Proposed `projects` table schema:**
        - `id` (INTEGER, PRIMARY KEY, AUTOINCREMENT)
        - `section` (TEXT, NOT NULL) - *e.g., "info", "fun", "edu"*
        - `title` (TEXT, NOT NULL)
        - `description` (TEXT)
        - `technology` (TEXT)
        - `media_url` (TEXT) - *For YouTube embeds*
        - `thumbnail_url` (TEXT) - *Path to the image thumbnail*
        - `image_url` (TEXT) - *Path to the main image*

2.  **Data Migration:**
    - A one-time migration script (`scripts/migrate_to_sqlite.php`) will be created. This script will read all data from the existing `.json` files (`js/info.json`, `js/fun.json`, etc.) and the hardcoded PHP arrays, and insert it into the new SQLite `projects` table. This consolidates all data into a single source of truth.

3.  **API Layer (`api/data.php`):
    - The API endpoint proposed previously will be enhanced.
    - Instead of reading from `.json` files, it will connect to the SQLite database using PHP's PDO extension (the modern standard for database interaction).
    - It will execute SQL queries based on the `type` parameter. For example, a request to `api/data.php?type=info` will trigger the query `SELECT * FROM projects WHERE section = 'info';`.
    - The API will return the query results as a JSON object, just as before. The frontend will not need to know that the backend data source has changed.

### 3.2. Frontend: SPA-like Experience

We will refactor the frontend to load content dynamically into the main `index.php` page, avoiding full page reloads.

1.  **Main Application Shell (`index.php`):
    - `index.php` will serve as the single entry point and container for the entire application. It will contain the main header, footer, and a primary content area (`<main id="app-content"></main>`).

2.  **Client-Side Routing and Content Loading:**
    - A new, unified JavaScript file (`js/app.js`) will manage the application flow.
    - This script will handle client-side routing (e.g., using URL hash fragments like `index.php#info` or `index.php#fun`).
    - When the route changes, `app.js` will:
        1.  Identify the requested section from the URL hash.
        2.  Make a `fetch` call to the PHP API (`api/data.php?type=info`).
        3.  Dynamically generate the HTML for the list of projects from the fetched JSON data.
        4.  Inject this new HTML into the main content area (`#app-content`).

3.  **Templating:**
    - The existing `sessions/*.php` files will be stripped of their PHP logic and converted into simple HTML templates or their structure will be generated directly within the `app.js` file for simplicity.

## 4. Step-by-Step Implementation Plan

1.  **Setup Backend:**
    - Create the `database/` directory.
    - Create the `digitalflute.sqlite` file with the `projects` table schema.
    - Create and execute the `scripts/migrate_to_sqlite.php` script to populate the database.
    - Refactor `api/data.php` to connect to SQLite via PDO and serve data from the `projects` table.

2.  **Refactor Frontend:**
    - Modify `index.php` to act as the main shell with an empty content area.
    - Create `js/app.js`.
    - Implement the client-side router in `js/app.js` to listen for hash changes.
    - Implement the data fetching and HTML rendering logic within `js/app.js`.
    - Update the main navigation links to point to hashes (e.g., `#info`) instead of separate `.php` files.

3.  **Cleanup:**
    - Once the new system is verified, the old `sessions/*.php` files and static `js/*.json` data files can be archived or removed.

## 5. Benefits

- **Single Source of Truth:** The SQLite database centralizes all project data, making it easy to manage, update, and query.
- **Improved User Experience:** The SPA-like architecture eliminates full page reloads, making the application feel faster and more responsive.
- **Enhanced Maintainability:** A clear separation between the backend (PHP/SQLite API) and the frontend (JS/HTML) makes the codebase cleaner and easier to work on.
- **Scalability:** This architecture makes it much simpler to add new sections or even transition to a more powerful database system or a full frontend framework (like React/Vue) in the future.
