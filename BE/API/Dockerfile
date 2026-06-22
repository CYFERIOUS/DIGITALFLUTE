# ---- Build stage: install deps (compiles better-sqlite3) + build Nest ----
FROM node:22-bookworm-slim AS build
WORKDIR /app/BE/API

# Toolchain required to compile the better-sqlite3 native addon
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY BE/API/package*.json ./
RUN npm ci

COPY BE/API/ ./
RUN npm run build \
    && npm prune --omit=dev          # keep compiled better-sqlite3, drop dev deps

# ---- Runtime stage: slim image, no build tools ----
FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app/BE/API

# Reuse the already-compiled production node_modules + build output
COPY --from=build /app/BE/API/node_modules ./node_modules
COPY --from=build /app/BE/API/dist ./dist
COPY --from=build /app/BE/API/package.json ./

# Seed data the API reads at first boot ( ../../FE/js relative to this dir )
COPY FE/js/info.json FE/js/edu.json FE/js/fun.json /app/FE/js/

# DB lives at ../DB ; mount a volume here to persist digitalflute.db
RUN mkdir -p /app/BE/DB

EXPOSE 5000
CMD ["node", "dist/main"]