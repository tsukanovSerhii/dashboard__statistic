# DataLens — Tabular Data Analytics Dashboard

A full-stack web application for uploading tabular files and exploring their analytics.
Upload a CSV, XLSX or JSON file — the backend parses it, computes per-column statistics,
and stores the rows so you can browse and search content right in the browser.

> Personal portfolio project · Next.js + Express + PostgreSQL

---

## Features

- **Authentication** — register / login with JWT access + refresh tokens, protected routes
- **File upload** — CSV, XLSX and JSON (up to 10 MB), parsed and analyzed server-side
- **Column analytics** — data type detection, null counts, unique values, fill rate per column
- **Content browser** — paginated table with debounced full-text search across all columns
- **Analytics dashboard** — charts for file types, column types, row counts and data quality
- **Settings** — change password, delete account
- **Dark mode** — persisted theme toggle with no flash on reload
- **API docs** — interactive Swagger UI at `/api/docs`

---

## Tech stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 |
| | Zustand (state + persistence) · Recharts · Axios · sonner (toasts) |
| **Backend** | Express · TypeScript · ESM (`tsx`) |
| | PostgreSQL · Drizzle ORM · Multer · PapaParse · xlsx |
| | bcryptjs · JSON Web Tokens · Zod · Swagger UI |
| **Infra** | Docker Compose · GitHub Actions CI |

---

## Project structure

```
.
├── backend/
│   ├── drizzle/                # SQL migrations
│   └── src/
│       ├── config/             # env validation, OpenAPI spec
│       ├── db/                 # Drizzle schema + client
│       ├── routes/             # auth · datasets
│       ├── controllers/        # request / response handlers
│       ├── services/           # business logic (auth, parser, analytics, dataset)
│       ├── middleware/         # authenticate · upload · validate · error
│       └── validators/         # Zod schemas
├── frontend/
│   ├── app/                    # pages (login, register, dashboard, analytics, settings)
│   ├── components/             # ui · layout · charts · dataset · providers
│   └── lib/                    # api client · Zustand stores · utils · constants
├── test-data/                  # sample CSV / XLSX / JSON files
└── docker-compose.yml          # PostgreSQL container
```

---

## Getting started

### Prerequisites

- Node.js 20+
- Docker Desktop

### 1. Clone and install

```bash
git clone https://github.com/tsukanovSerhii/dashboard__statistic.git
cd dashboard__statistic
```

### 2. Backend

```bash
cd backend
cp .env.example .env          # set JWT_SECRET and JWT_REFRESH_SECRET
docker compose up -d          # start PostgreSQL on port 5433
npm install
npm run db:migrate            # create tables
npm run dev                   # http://localhost:4000
```

### 3. Frontend

```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api" > .env.local
npm install
npm run dev                   # http://localhost:3000
```

Open **http://localhost:3000**, register an account, and upload any file from [`test-data/`](./test-data).

---

## API reference

Swagger UI: **http://localhost:4000/api/docs**

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Log in, returns token pair |
| POST | `/api/auth/refresh` | — | Rotate refresh token |
| POST | `/api/auth/logout` | — | Revoke refresh token |
| GET | `/api/auth/me` | Bearer | Current user |
| PATCH | `/api/auth/password` | Bearer | Change password |
| DELETE | `/api/auth/account` | Bearer | Delete account |

### Datasets

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/datasets/upload` | Bearer | Upload and analyze a file |
| GET | `/api/datasets` | Bearer | List all datasets |
| GET | `/api/datasets/:id` | Bearer | Dataset details with column stats |
| GET | `/api/datasets/:id/rows` | Bearer | Rows with search and pagination |
| GET | `/api/datasets/stats/summary` | Bearer | Aggregated analytics |
| DELETE | `/api/datasets/:id` | Bearer | Delete a dataset |

---

## Architecture

```
Browser (Next.js)                Express API              PostgreSQL
  localhost:3000   ──JWT──►      localhost:4000   ──►    localhost:5433

Upload flow:
  file → Multer → parser service → analytics service → store rows + stats → delete temp file

Auth flow:
  login → { accessToken (15 min) + refreshToken (7 days) }
  401   → interceptor calls /auth/refresh → retries original request transparently
```

---

## Test data

The [`test-data/`](./test-data) folder contains ready-made files for every supported format,
including large datasets (400–500 rows) to test pagination and search.

---

## Running tests

```bash
cd backend
npm test        # Vitest — parser + analytics unit tests
```
