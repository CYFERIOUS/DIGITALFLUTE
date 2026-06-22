# Running DGFLUTE (step by step)

This guide starts the **Backend API (BE)**, prepares the **database (DB)**, and serves the **Frontend (FE)**. Optional steps cover the **Admin** app.

There are two ways to run the project:

- **[Option A — Docker](#option-a--docker-recommended)** (recommended): one command, no Node/PHP/XAMPP needed on the host.
- **[Option B — Manual](#option-b--manual-nodexampp)**: run each service natively with Node + XAMPP/LAMPP.

Project layout:

- `BE/API` — NestJS API (serves JSON on **port 5000**)
- `BE/DB` — SQLite database file + helper scripts
- `FE` — PHP/HTML frontend (Apache on **port 80**)
- `ADMIN` — Angular admin (optional, dev server on **port 4200**)

The database is **SQLite** (a file, `BE/DB/digitalflute.db`). There is no MySQL/MariaDB server. The API creates and seeds the database automatically on first boot from `FE/js/*.json`, so no manual populate step is required in either option.

---

# Option A — Docker (recommended)

Runs the **api** (NestJS + SQLite) and **fe** (PHP/Apache) services defined in `docker-compose.yml` at the repo root.

## A.0 Prerequisites (one time)

```bash
docker --version
docker compose version
```

Only **Docker** + **Docker Compose** are required — no Node, PHP, XAMPP, or SQLite on the host.

## A.1 Compile CSS before building (only if you changed SCSS)

The FE image serves pre-compiled CSS; it does not run gulp. If you edited `FE/scss/*.scss`, regenerate and commit the CSS first (needs Node locally):

```bash
cd /home/cyferious/Development/DIGITALFLUTE/FE
npm install          # first time only
npx gulp sass sassAcordion sassIlustre chinoPopo
```

If you didn't touch SCSS, skip this step.

## A.2 Build and start

```bash
cd /home/cyferious/Development/DIGITALFLUTE
docker compose up --build
```

Add `-d` to run in the background: `docker compose up --build -d`.

On first boot the API creates `digitalflute.db` (stored in the `dbdata` volume) and seeds it from `FE/js/*.json`.

## A.3 Open the app

- Frontend: `http://localhost`
- API: `http://localhost:5000` (`/info`, `/edu`, `/fun`)

Inside the Docker network the FE reaches the API at `http://api:5000` (set via the `API_BASE_URL` environment variable in `docker-compose.yml`). On the host you still use `localhost:5000`.

## A.4 Common Docker commands

```bash
# View logs (follow)
docker compose logs -f
docker compose logs -f api      # one service

# Stop (keeps the database volume)
docker compose down

# Stop and DELETE the database volume (fresh reseed next start)
docker compose down -v

# Rebuild after code changes
docker compose up --build

# Re-seed the running database from JSON (force)
curl -X POST http://localhost:5000/database/repopulate
```

## A.5 Clone on another machine

```bash
git clone <repo-url>
cd DIGITALFLUTE
docker compose up --build
```

That machine needs only Docker — data seeds itself on first boot. (Make sure compiled `FE/css/` is committed; see A.1.)

> The **Admin** (Angular) app is not part of the Docker setup yet. Run it manually via [Option B step 5](#5-admin-app-optional) if needed.

---

# Option B — Manual (Node/XAMPP)

> Run each numbered block in order. The first time, do every step; afterwards you can skip the install steps.

## 0. Prerequisites (one time)

```bash
node --version
npm --version
```

- Node.js + npm installed.
- XAMPP/LAMPP installed at `/opt/lampp` (for the frontend).

---

## 1. Backend API — install

```bash
cd /home/cyferious/Development/DIGITALFLUTE/BE/API
npm install
```

---

## 2. Database — create and populate

Run from `BE/API`. This creates `BE/DB/digitalflute.db` and loads seed data from `FE/js/*.json`.

```bash
cd /home/cyferious/Development/DIGITALFLUTE/BE/API
npm run populate:db
```

Expected: counts for Information / Education / Entertainment, then `Database population completed successfully!`.

---

## 3. Backend API — run

Development (auto-reload):

```bash
cd /home/cyferious/Development/DIGITALFLUTE/BE/API
npm run start:dev
```

Or production-style:

```bash
cd /home/cyferious/Development/DIGITALFLUTE/BE/API
npm run build
npm run start:prod
```

Verify the API is up (new terminal):

```bash
curl http://localhost:5000/info
curl http://localhost:5000/edu
curl http://localhost:5000/fun
```

Leave this terminal running.

---

## 4. Frontend — serve with Apache (XAMPP/LAMPP)

The FE is PHP, so it is served by Apache, not by Node.

### 4a. Start Apache

```bash
sudo /opt/lampp/lampp startapache
# or start everything:
# sudo /opt/lampp/lampp start
```

Check status:

```bash
sudo /opt/lampp/lampp status
```

### 4b. Point Apache at the FE folder (one time)

Enable vhosts include in `/opt/lampp/etc/httpd.conf` (uncomment the line):

```apache
Include etc/extra/httpd-vhosts.conf
```

Set the vhost in `/opt/lampp/etc/extra/httpd-vhosts.conf` so `localhost` serves the FE:

```apache
<VirtualHost *:80>
    DocumentRoot "/home/cyferious/Development/DIGITALFLUTE/FE"
    ServerName localhost
    ServerAlias myproject.local
    <Directory "/home/cyferious/Development/DIGITALFLUTE/FE">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Allow Apache (user `daemon`) to traverse your home directory (one time):

```bash
sudo chmod o+x /home/cyferious
```

Reload Apache after config changes:

```bash
sudo /opt/lampp/lampp reloadapache
```

### 4c. Open the site

```
http://localhost
```

The portfolio loader should disappear and the Information / Education / Entertainment sections pull data from the API on port 5000.

---

## 5. Admin app (optional)

```bash
cd /home/cyferious/Development/DIGITALFLUTE/ADMIN
npm install
npm start
```

Open:

```
http://localhost:4200
```

---

## Quick start (after first-time setup)

Three things to have running:

```bash
# Terminal 1 — API
cd /home/cyferious/Development/DIGITALFLUTE/BE/API && npm run start:dev

# Apache (frontend)
sudo /opt/lampp/lampp startapache

# Terminal 2 — Admin (optional)
cd /home/cyferious/Development/DIGITALFLUTE/ADMIN && npm start
```

URLs:

- Frontend: `http://localhost`
- API: `http://localhost:5000` (`/info`, `/edu`, `/fun`)
- Admin: `http://localhost:4200`

---

## Stop everything

```bash
# Stop Apache
sudo /opt/lampp/lampp stopapache   # or: sudo /opt/lampp/lampp stop

# Stop API / Admin: press Ctrl+C in their terminals
```

---

## Troubleshooting

### Docker (Option A)

- **FE shows "Could not connect to API"** — the FE container reaches the API as `http://api:5000`, not `localhost`. Confirm `API_BASE_URL=http://api:5000` is set on the `fe` service in `docker-compose.yml` and that the `api` container is healthy (`docker compose logs api`).
- **API returns empty arrays** — re-seed: `curl -X POST http://localhost:5000/database/repopulate`. For a clean slate, `docker compose down -v` then `docker compose up --build`.
- **Port 80 or 5000 already in use** — change the host port mapping in `docker-compose.yml` (e.g. `"8080:80"` for fe) and open the new port.
- **CSS/styles missing** — compiled CSS wasn't committed. Run gulp (A.1) and rebuild.
- **`better-sqlite3` build errors** — the API build stage needs `python3/make/g++` (already in `BE/API/Dockerfile`); rebuild with `docker compose build --no-cache api`.

### Manual (Option B)

- **Frontend loader stuck / sections empty** — the API on port 5000 is not running. Start step 3 and re-check `curl http://localhost:5000/info`.
- **403 Forbidden on `http://localhost`** — vhost not enabled, wrong `DocumentRoot`, or home dir not traversable. Recheck steps 4b (include line, `DocumentRoot`, `ServerName localhost`) and run `sudo chmod o+x /home/cyferious`, then `sudo /opt/lampp/lampp reloadapache`.
- **API returns empty arrays** — re-run step 2 (`npm run populate:db`) or `POST http://localhost:5000/database/repopulate`.
- **Port 5000 in use** — set a different port: `PORT=5001 npm run start:dev` (update FE/Admin URLs accordingly).
