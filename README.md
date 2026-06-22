# DIGITALFLUTE

Personal portfolio project ("Digital Flute"). It is a small full‑stack app:

- **FE** — PHP/HTML/CSS/JS frontend (portfolio site), served by Apache.
- **BE/API** — NestJS REST API that serves the portfolio content as JSON.
- **BE/DB** — SQLite database (a single file) plus helper scripts.
- **ADMIN** — Angular admin app (optional) for editing content.

The database is **SQLite** — there is no MySQL/MariaDB server to run. The API creates and seeds the database automatically on first boot from `FE/js/*.json`, so there is no mandatory manual import step.

---

## Architecture

```
Browser ──HTTP──> FE (PHP/Apache, :80)
                     │  server-side curl
                     ▼
                  API (NestJS, :5000) ──> SQLite file (BE/DB/digitalflute.db)
```

- The frontend renders content by calling the API **server-side** (PHP `curl`).
- The API reads/writes a SQLite file via `better-sqlite3` (embedded — no DB server).
- Content sections: **Information** (`/info`), **Education** (`/edu`), **Entertainment** (`/fun`).

---

## Project layout

| Path        | What it is                          | Port |
| ----------- | ----------------------------------- | ---- |
| `FE`        | PHP frontend (Apache)               | 80   |
| `BE/API`    | NestJS API (SQLite via better-sqlite3) | 5000 |
| `BE/DB`     | `digitalflute.db` + DB scripts/docs | —    |
| `ADMIN`     | Angular admin (optional)            | 4200 |

---

## Run with Docker (recommended)

Requires only **Docker** and **Docker Compose** — no Node, PHP, XAMPP, or SQLite on the host.

```bash
# from the repo root
docker compose up --build
```

Then open:

- Frontend: <http://localhost>
- API: <http://localhost:5000> (`/info`, `/edu`, `/fun`)

On first boot the API creates `digitalflute.db` in the `dbdata` Docker volume and seeds it from `FE/js/*.json`. Inside the Docker network the frontend reaches the API at `http://api:5000` (configured via the `API_BASE_URL` env var in `docker-compose.yml`); from your host you use `localhost:5000`.

Useful commands:

```bash
docker compose up --build -d        # run in background
docker compose logs -f              # follow logs
docker compose down                 # stop (keeps the DB volume)
docker compose down -v              # stop and wipe the DB volume (fresh reseed)
curl -X POST http://localhost:5000/database/repopulate   # force re-seed from JSON
```

> If you change SCSS (`FE/scss/*.scss`), recompile the CSS with gulp and commit it before building — the FE image serves pre-compiled CSS and does not run gulp. See [Frontend build (gulp)](#frontend-build-gulp).
>
> The **Admin** app is not part of the Docker setup yet; run it manually (see below).

---

## Run manually (Node + XAMPP/LAMPP)

Prerequisites: **Node.js + npm**, and **XAMPP/LAMPP** at `/opt/lampp` for serving the PHP frontend.

### 1. Backend API

```bash
cd BE/API
npm install
npm run start:dev          # dev (auto-reload) on port 5000
# or: npm run build && npm run start:prod
```

The database is created and seeded automatically on startup. To (re)seed manually:

```bash
cd BE/API
npm run populate:db
```

Verify:

```bash
curl http://localhost:5000/info
```

### 2. Frontend (Apache)

Serve the `FE/` folder with Apache. Point a vhost `DocumentRoot` at the absolute path of `FE`, enable `mod_rewrite`, then open <http://localhost>.

Full step-by-step (vhost config, permissions, troubleshooting) is in **[RUN.md](RUN.md)**.

### 3. Admin app (optional)

```bash
cd ADMIN
npm install
npm start                  # http://localhost:4200
```

For the complete, detailed walkthrough of both Docker and manual setups, see **[RUN.md](RUN.md)**.

---

## API endpoints

Base URL: `http://localhost:5000`

| Method | Path                     | Description                                 |
| ------ | ------------------------ | ------------------------------------------- |
| GET    | `/info`                  | List Information items                       |
| GET    | `/edu`                   | List Education items                        |
| GET    | `/fun`                   | List Entertainment items                    |
| POST   | `/info/:id`              | Update an Information item                   |
| POST   | `/edu/:id`               | Update an Education item                     |
| POST   | `/fun/:id`               | Update an Entertainment item                |
| POST   | `/database/repopulate`   | Clear and reload all tables from `FE/js/*.json` |
| POST   | `/database/restore-images` | Restore image/thumb URLs from JSON         |

CORS is enabled for all origins (development setting in `BE/API/src/main.ts`). The port can be overridden with the `PORT` environment variable.

---

## Database

- Engine: **SQLite** via `better-sqlite3` (embedded in the API process).
- File: `BE/DB/digitalflute.db` (host) / `dbdata` volume (Docker).
- Tables: `information`, `education`, `entertainment`.
- Seed data: `FE/js/info.json`, `FE/js/edu.json`, `FE/js/fun.json`.

Export the current DB contents back to the seed JSON files:

```bash
cd BE/API
npm run export:db-json
```

More database documentation (including the ChartDB schema diagram workflow) is in **[BE/DB/README.md](BE/DB/README.md)**.

---

## Frontend build (gulp)

The FE styles are written in SCSS (`FE/scss/`) and compiled to CSS with gulp.

```bash
cd FE
npm install                                    # first time only
npx gulp                                        # compile all + watch
npx gulp sass sassAcordion sassIlustre chinoPopo   # one-off compile (no watch)
```

Commit the generated `FE/css/` so the Docker FE image (which does not run gulp) serves the latest styles.

---

## Documentation index

- **[RUN.md](RUN.md)** — detailed run instructions (Docker + manual) and troubleshooting.
- **[BE/DB/README.md](BE/DB/README.md)** — database setup, seeding, and ChartDB schema docs.
- **[BE/API/README.md](BE/API/README.md)** — backend (NestJS) notes.
- **[ADMIN/README.md](ADMIN/README.md)** — Angular admin app notes.
