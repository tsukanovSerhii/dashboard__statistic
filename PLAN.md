# 📊 Dashboard аналітики табличних даних — План проекту

Дашборд для аналізу табличних файлів. Користувач реєструється, завантажує
CSV / XLSX / JSON, а система розбирає файл і показує статистику: кількість
рядків і колонок, типи даних, мін/макс/середнє по числових колонках,
пропущені значення, графіки розподілу.

**Параметри проекту:**
- **Файли:** таблиці/дані — CSV, XLSX, JSON
- **Джерело:** користувач завантажує через UI
- **Авторизація:** так, з логіном
- **Масштаб:** навчальний pet-проект (фокус на робочому MVP)

---

## 1. Стек технологій

**Frontend (Next.js)**
- Next.js (App Router) + React
- TypeScript
- Tailwind CSS — швидка верстка
- Recharts або Chart.js — графіки
- Axios / fetch — запити до бекенду
- React Context або Zustand — стан (auth, поточний файл)

**Backend (Express)**
- Express + TypeScript
- Multer — приймання завантажених файлів
- Парсери: `papaparse` (CSV), `xlsx` (Excel), вбудований JSON
- `jsonwebtoken` + `bcrypt` — авторизація
- Валідація: `zod`

**База даних**
- PostgreSQL (через Prisma ORM)
- Локально піднімається у Docker (`docker-compose`), щоб не ставити
  сервіс на Windows. Альтернатива — хмарний інстанс (Neon / Supabase / Railway).
- Доступ до БД тільки через бекенд; фронт у Postgres напряму не ходить.

---

## 2. Архітектура (потік даних)

Три окремі складові: фронт, бек і БД. Фронт спілкується з беком тільки
по HTTP/JSON з JWT у заголовку. Бек — єдиний, хто ходить у Postgres.

```
┌─────────────────┐         HTTP/JSON + JWT          ┌──────────────────┐
│   Next.js (FE)  │ ──────────────────────────────► │  Express (BE)    │
│  localhost:3000 │ ◄────────────────────────────── │  localhost:4000  │
└─────────────────┘                                  └────────┬─────────┘
                                                              │ Prisma
                                                              ▼
                                                     ┌──────────────────┐
                                                     │   PostgreSQL     │
                                                     │  localhost:5432  │
                                                     └──────────────────┘
```

**Потік одного upload-запиту:**

```
[Next.js :3000]
   │  1. POST /api/auth/login  → отримує JWT, кладе в localStorage
   │  2. POST /api/datasets/upload (файл + Bearer token)
   ▼
[Express :4000]
   ├─ auth.middleware    перевіряє JWT
   ├─ upload.middleware  Multer зберігає файл у uploads/
   ├─ parser.service     CSV/XLSX/JSON → масив об'єктів
   ├─ analytics.service  рахує min/max/mean/median/nulls
   └─ prisma             INSERT Dataset + ColumnStat
   ▼
[PostgreSQL :5432]
```

**Шари бекенду (одна відповідальність на шар):**

```
route → middleware (auth/upload) → controller → service → prisma → PostgreSQL
                                       │            │
                                  тільки HTTP    тільки логіка
```

- **route** — описує URL і чіпляє middleware.
- **controller** — дістає дані з `req`, віддає `res`. Без бізнес-логіки.
- **service** — уся робота (хеш паролю, парсинг, обрахунок). Не знає про HTTP.
- **prisma** — єдина точка доступу до БД.

---

## 3. Структура даних (БД)

```
User
  id, email, passwordHash, createdAt

Dataset (завантажений файл)
  id, userId, filename, fileType, sizeBytes,
  rowCount, columnCount, createdAt

ColumnStat (статистика по кожній колонці)
  id, datasetId, name, dataType,
  nullCount, uniqueCount,
  min, max, mean, median   // для числових
```

---

## 4. Ключові ендпоінти Express

| Метод  | Шлях                     | Опис                              |
|--------|--------------------------|-----------------------------------|
| POST   | `/api/auth/register`     | Реєстрація                        |
| POST   | `/api/auth/login`        | Логін → JWT                       |
| GET    | `/api/auth/me`           | Поточний користувач               |
| POST   | `/api/datasets/upload`   | Завантажити + проаналізувати файл |
| GET    | `/api/datasets`          | Список своїх датасетів            |
| GET    | `/api/datasets/:id`      | Деталі + статистика датасету      |
| DELETE | `/api/datasets/:id`      | Видалити                          |

---

## 5. Що рахує аналітичний модуль

- **Загальне:** кількість рядків, колонок, розмір файлу
- **Типи колонок:** число / текст / дата / булеве (автовизначення)
- **Числові колонки:** min, max, середнє, медіана, кількість пропусків
- **Текстові колонки:** к-сть унікальних значень, топ найчастіших
- **Якість даних:** % пропущених значень, дублі рядків

---

## 6. Сторінки Next.js

- `/login`, `/register` — авторизація
- `/dashboard` — список завантажених файлів + кнопка upload
- `/dashboard/[id]` — деталі: таблиця статистики + графіки
  (гістограми, кругові діаграми)

---

## 7. Поетапний план розробки

**Етап 1 — Каркас**
- `frontend` (Next.js) — уже ініціалізовано
- Ініціалізувати `backend` (Express + TypeScript)
- Підняти PostgreSQL у Docker (`docker-compose.yml`)
- Налаштувати Prisma (`provider = "postgresql"`), `.env` з `DATABASE_URL`
- Перша міграція (`prisma migrate dev --name init`), CORS

**Етап 2 — Авторизація**
- Register / login на бекенді (bcrypt + JWT)
- Сторінки логіну/реєстрації, збереження токена, захист маршрутів

**Етап 3 — Завантаження та парсинг**
- Multer + upload-ендпоінт
- Парсери CSV/XLSX/JSON
- Збереження метаданих у БД

**Етап 4 — Аналітика**
- Модуль обрахунку статистики
- Збереження `ColumnStat`

**Етап 5 — Дашборд UI**
- Список датасетів
- Сторінка деталей з таблицею і графіками

**Етап 6 — Поліш**
- Обробка помилок, лоадери, валідація
- README, інструкція запуску

---

## 8. Структура папок

```
project/
├── backend/
│   ├── docker-compose.yml        # PostgreSQL у Docker
│   ├── .env                      # DATABASE_URL, JWT_SECRET (у .gitignore)
│   ├── .env.example              # шаблон без секретів (у git)
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   ├── schema.prisma         # моделі БД (provider = postgresql)
│   │   └── migrations/           # генерується Prisma
│   ├── uploads/                  # тимчасові файли (у .gitignore)
│   └── src/
│       ├── index.ts              # точка входу: запуск Express
│       ├── app.ts                # app, middleware, маршрути
│       ├── config/
│       │   ├── env.ts            # валідація env через zod
│       │   └── prisma.ts         # єдиний екземпляр PrismaClient
│       ├── routes/               (auth.routes, dataset.routes)
│       ├── controllers/          (тільки req/res)
│       ├── services/             (auth, parser, analytics — логіка)
│       ├── middleware/           (auth, upload, error)
│       └── types/
└── frontend/
    ├── app/
    │   ├── login/page.tsx
    │   ├── register/page.tsx
    │   └── dashboard/
    │       ├── page.tsx          # список + upload
    │       └── [id]/page.tsx     # деталі + графіки
    ├── components/               (UploadForm, StatsTable, charts/)
    ├── lib/
    │   ├── api.ts                # axios + автопідстановка JWT
    │   └── auth.ts               # робота з токеном
    └── .env.local               # NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 9. Налаштування PostgreSQL і запуск

### 9.1 Docker для PostgreSQL

`backend/docker-compose.yml`:

```yaml
services:
  db:
    image: postgres:16
    container_name: analytics_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: analytics
      POSTGRES_PASSWORD: analytics_pass
      POSTGRES_DB: analytics
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:                      # дані переживають перезапуск контейнера
```

### 9.2 Змінні оточення

`backend/.env`:

```
DATABASE_URL="postgresql://analytics:analytics_pass@localhost:5432/analytics?schema=public"
JWT_SECRET="зміни-на-довгий-випадковий-рядок"
PORT=4000
```

### 9.3 Prisma schema (provider postgresql)

Ключові моменти: `provider = "postgresql"`, `onDelete: Cascade`
(видалив User → зникають його Dataset і ColumnStat), `@@index` на
зовнішніх ключах для швидких вибірок «всі датасети користувача».

### 9.4 Команди Prisma

```
npx prisma migrate dev --name init   # створити таблиці в Postgres
npx prisma generate                  # згенерувати типізований клієнт
npx prisma studio                    # GUI для перегляду БД (:5555)
```

### 9.5 Порядок запуску (dev)

```
1. cd backend && docker compose up -d       # підняти Postgres
2. cd backend && npx prisma migrate dev      # створити таблиці
3. cd backend && npm run dev                 # Express на :4000
4. cd frontend && npm run dev                # Next.js на :3000
```

### 9.6 CORS

Фронт (:3000) і бек (:4000) — різні origin, тому в Express:

```ts
app.use(cors({ origin: 'http://localhost:3000' }));
```
