# Airbnb Clone Monorepo

This repository is now organized as a small monorepo with a clearer app layout:

```text
apps/
  api/   Django + Django REST Framework + Channels
  web/   Next.js + React + Bun
```

## What Changed

- The old `frontend/` app now lives in `apps/web/`
- The old nested `backend/backend/` app now lives in `apps/api/`
- The Django config package was renamed from `backend` to `config`
- Docker is now managed from the repo root with `docker-compose.yml`
- Workspace scripts are now managed from the repo root with Bun + Turborepo

## Prerequisites

- Bun `1.3.11+`
- Python `3.12+`
- Docker and Docker Compose for containerized runs

## Workspace Commands

Install JavaScript workspace dependencies from the repo root:

```bash
bun install
```

Run both apps together with Turborepo:

```bash
bun dev
```

Run a single app:

```bash
bun run dev:web
bun run dev:api
```

Build the workspace:

```bash
bun run build
```

Lint the frontend:

```bash
bun run lint
```

Run the Django health check:

```bash
bun run check
```

## Local App Commands

### Web

```bash
cd apps/web
bun dev
```

### API

Create a virtual environment, install requirements, then run the server:

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py runserver
```

If you do not provide database environment variables, the API falls back to SQLite for easier local startup.

## Docker

Build and run the full stack from the repo root:

```bash
docker compose up --build
```

Services:

- Web: `http://localhost:3000`
- API: `http://localhost:8000`
- Postgres: `localhost:5432`

Stop and remove containers and volumes:

```bash
docker compose down -v
```

## Notes

- The frontend now reads API and WebSocket endpoints through a small runtime config helper instead of hardcoded URLs.
- The Next.js app is configured for standalone output to support a cleaner Docker build.
- The Django settings now support either Postgres via environment variables or a local SQLite fallback.
