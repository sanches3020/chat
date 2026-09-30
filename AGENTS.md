# AGENTS.md

## What this is

A PHP 7.4 + AngularJS 1.x chat app ("Мем чат") with a word-replacement game mechanic. Messages sent through `api/send.php` have words replaced via the `words` table, earning the sender balance for each replacement. Word usage is tracked in `candles` for charting.

## Running the app

The only way to run this is via Docker Compose — there is no local dev server or build step:

```bash
docker compose up
```

- App: `http://localhost:80` (Apache serves `app/` as docroot)
- phpMyAdmin: `http://localhost:8080`
- MySQL: internal only (`sof-chat-mysql-1:3306`)

The `schema/` directory is auto-executed on first MySQL container init. To reinitialize, `docker compose down -v` (destroys the DB volume).

## Architecture

- **Frontend** (`app/`): AngularJS 1.8 + Angular Material + UI Router. No build step — scripts are loaded directly from `node_modules/` in `index.html`. Entry point: `app/index.html` → `app.js` (routes) → `controller.js` (main) → `views/*/controller.js`.
- **Backend** (`app/api/*.php`): Flat PHP files, one per endpoint. Each `require_once`s `auth.php` for token validation.
- **DB layer** (`app/utils/php/db.php`): Global `$mysqli` connection. All queries go through helpers: `row()`, `select()`, `insert()`, `update()`, `scalarSql()`, etc. Never write raw `$mysqli->query()` in endpoints.
- **Params** (`app/utils/php/params.php`): All input via `get_*()` functions (checks JSON body, GET, POST, session, cookies, headers). All output via `success()` / `error()` which `die()` with JSON.

## API conventions

- Auth: client sends `token` header (user_id from localStorage). `auth.php` auto-creates user if missing.
- Endpoints return JSON via `success($data)` or `error($message)` (HTTP 500).
- Required params: use `get_long_required()`, `get_string_required()`, etc. — they auto-error if missing.
- Pagination: `get_limits($size)` reads `page`/`size` from request; `get_order()` reads `order_by`/`order_to`.

## Key business logic

- **Word replacement** (`api/send.php`): splits message on spaces, looks up each word in `words` table, replaces with `fix` column, increments `message_likes` and user balance per replacement.
- **Candle tracking** (`api/event_utils.php`): `track()` writes OHLC rows to `candles` table at M/H/D periods. `trackAccumulate()` is called from `send.php` for each matched word.
- **Charts** (`views/chart/`): uses `lightweight-charts` library, fed by `api/event_chart.php`.

## Gotchas

- No tests, no CI, no linter, no type checker. Verify changes manually via the running app or phpMyAdmin.
- `app/utils/php/insert.php` references `/mems/utils/php/db.php` — a stale path from a different project. Don't use it.
- `controller.js` has a large commented-out block (lines 47–110) with dead code — ignore it.
- DB credentials are in `.env` (gitignored) and match the docker-compose service names.
- The `mysql/` directory at repo root is a local DB dump/volume — don't commit changes to it.
- `api/test` is a plain text file with sample curl URLs, not an executable test.
