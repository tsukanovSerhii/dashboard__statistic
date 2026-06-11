# Test data

Sample files for testing dataset upload and analytics.

| File | Format | Rows | What it tests |
|------|--------|------|---------------|
| `sales.csv` | CSV | 15 | Mixed types (number, string, date, boolean) + several nulls in `amount`, `quantity`, `order_date`, `is_paid` |
| `users.json` | JSON | 8 | Array of objects, `null` values in `age`, `signup`, `active` |
| `temperatures.csv` | CSV | 8 | All-numeric columns (no nulls) — clean numeric analytics |
| `employees.xlsx` | XLSX | 10 | Excel format, one null in `salary`, boolean `remote` |
| `transactions_large.csv` | CSV | 500 | Large file — test pagination (20 pages) and search |
| `users_large.json` | JSON | 300 | Large JSON — test pagination and search |
| `employees_large.xlsx` | XLSX | 400 | Large Excel — test pagination and search |

> Large files are best for testing the content table: search (e.g. `Laptop`, `cancelled`, `pro`) and paging through results.

## How to test

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Register/login, then upload a file from this folder.
4. Open it in the list to see column stats (type, nulls, unique, fill rate).

## Expected results (quick check)

- **sales.csv** → `amount` has 2 nulls, `quantity` 1 null, `order_date` 1 null, `is_paid` 1 null
- **users.json** → `age` 1 null, `signup` 1 null, `active` 1 null
- **temperatures.csv** → 0 nulls, all columns numeric, fill rate 100%
- **employees.xlsx** → `salary` 1 null, `remote` detected as boolean
