# 📊 DataLens — Tabular Data Analytics Dashboard

A full-stack web app for uploading tabular files (CSV, XLSX, JSON) and exploring
their analytics. Upload a file, and the backend parses it, computes per-column
statistics, and stores the rows so you can browse and search the content right
in the browser.

> Personal full-stack project: Next.js + Express + PostgreSQL.

---

## ✨ Features

- 🔐 **Authentication** — register / login with JWT, protected routes
- 📤 **File upload** — CSV, XLSX and JSON (up to 10 MB), parsed on the server
- 📈 **Column analytics** — data type detection, null counts, unique values, fill rate
- 🔎 **Content browser** — paginated table with full-text search across all columns
- 📊 **Analytics dashboard** — charts (Recharts) for file types, column types and data quality
- ⚙️ **Settings** — change password, delete account
- 🌗 **Dark mode** — persisted theme toggle
- 📚 **API docs** — interactive Swagger UI

---

## 🧱 Tech stack

**Frontend**
- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4
- Zustand (state, with persistence)
- Recharts (charts), Axios (HTTP)

**Backend**
- Express + TypeScript (ESM, run with `tsx`)
- PostgreSQL + Drizzle ORM
- Multer (uploads), PapaParse / xlsx (parsing)
- bcryptjs + JSON Web Tokens (auth)
- Zod (env validation), Swagger UI (docs)

---

## 📁 Project structure

```
.
├── backend/
│   ├── docker-compose.yml      # PostgreSQL
│   ├── drizzle/                # migrations
│   └── src/
│       ├── config/             # env, openapi
│       ├── db/                 # drizzle schema + client
│       ├── routes/             # auth, datasets
│       ├── controllers/        # request/response
│       ├── services/           # business logic (auth, parser, analytics, dataset)
│       └── middleware/         # auth, upload, error
├── frontend/
│   ├── app/                    # routes (login, register, dashboard, ...)
│   ├── components/             # ui, layout, charts, dataset, providers
│   └── lib/                    # api, stores, utils, constants
└── test-data/                  # sample files for testing
```

---

## 🚀 Getting started

### Prerequisites
- Node.js 20+
- Docker Desktop (for PostgreSQL)

### 1. Backend

```bash
cd backend
cp .env.example .env          # adjust JWT_SECRET if you like
docker compose up -d          # start PostgreSQL (port 5433)
npm install
npm run db:migrate            # create tables
npm run dev                   # http://localhost:4000
```

### 2. Frontend

```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api" > .env.local
npm install
npm run dev                   # http://localhost:3000
```

Open http://localhost:3000, register an account, and upload a file from
[`test-data/`](./test-data).

---

## 📚 API

Interactive documentation (Swagger UI) is available at:

**http://localhost:4000/api/docs**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Current user |
| PATCH | `/api/auth/password` | Change password |
| DELETE | `/api/auth/account` | Delete account |
| POST | `/api/datasets/upload` | Upload & analyze a file |
| GET | `/api/datasets` | List datasets |
| GET | `/api/datasets/:id` | Dataset with column stats |
| GET | `/api/datasets/:id/rows` | Rows (search + pagination) |
| GET | `/api/datasets/stats/summary` | Aggregated analytics |
| DELETE | `/api/datasets/:id` | Delete a dataset |

All dataset routes and `me`/`password`/`account` require a `Bearer <token>` header.

---

## 🧪 Test data

The [`test-data/`](./test-data) folder has ready-made files for every format and
size, including large ones (500+ rows) to test pagination and search. See
[`test-data/README.md`](./test-data/README.md) for details.

---

## 🗺️ Architecture

```
Browser (Next.js)  ──HTTP/JSON + JWT──►  Express API  ──Drizzle──►  PostgreSQL
   localhost:3000                          localhost:4000            localhost:5433

Upload flow:  file → Multer → parser → analytics → store rows + stats → delete file
```
