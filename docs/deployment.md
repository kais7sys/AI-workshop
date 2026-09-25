# KrishiSeva Production Deployment & DevOps Guide

## 1. Prerequisites

- **Node.js:** v20.x or v22.x LTS (tested on Node v24.x)
- **Package Manager:** npm v10.x+
- **Database:** Supabase Cloud or self-hosted PostgreSQL 15+
- **Containerization:** Docker 24+ and Docker Compose v2+
- **AI Credentials:** Google AI Studio Gemini API Key (or use built-in offline engine)

---

## 2. Environment Variables Configuration

Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

| Variable | Required | Default / Example | Purpose |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Yes | `production` or `development` | Runtime environment mode |
| `PORT` | Yes | `5000` | Backend API listen port |
| `FRONTEND_URL` | Yes | `http://localhost:5173` | Allowed CORS origin |
| `SUPABASE_URL` | Optional* | `https://your-project.supabase.co` | Supabase API endpoint |
| `SUPABASE_ANON_KEY` | Optional* | `eyJhbG...` | Client public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional* | `eyJhbG...` | Backend privileged key |
| `GEMINI_API_KEY` | Optional* | `AIzaSy...` | Gemini AI key for `@google/genai` |
| `GEMINI_MODEL` | No | `gemini-3.8-flash` | Selected Gemini model |
| `WEATHER_API_KEY` | No | `demo-weather-key` | External weather API key |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` (15 min) | Rate limiter time window |
| `RATE_LIMIT_MAX_REQUESTS`| No | `100` | Max requests per IP window |

*\*Note: If `SUPABASE_URL` or `GEMINI_API_KEY` are omitted, KrishiSeva seamlessly defaults to its built-in in-memory database and deterministic agronomic engine for zero-configuration testing.*

---

## 3. Database Migration Strategy

Migrations are version-controlled under `supabase/migrations/`:
1. `20260925000000_init_agriculture_schema.sql`: Creates 13 relational tables, foreign keys, and indexes.
2. `20260925000001_row_level_security.sql`: Enforces RLS policies for FARMER, OFFICER, ADMIN.

### Applying Migrations Locally via Supabase CLI
```bash
# Start local Supabase container stack
npx supabase start

# Apply pending migrations
npx supabase db push

# Apply realistic agronomic seed data
npx supabase db reset --seed
```

### Applying Migrations to Remote Supabase Project
```bash
npx supabase link --project-ref <your-project-id>
npx supabase db push
```

---

## 4. Local Development

```bash
# 1. Install all dependencies across monorepo workspaces
npm install

# 2. Run backend API and frontend Vite dev server concurrently
npm run dev

# Or run services independently
npm run dev:api   # Runs on http://localhost:5000
npm run dev:web   # Runs on http://localhost:5173
```

---

## 5. Production Multi-Stage Docker Build

The root `Dockerfile` implements a secure, optimized 3-stage Alpine build:
- **Stage 1 (builder):** Compiles TypeScript API and bundles Vite React assets.
- **Stage 2 (production):** Installs production-only dependencies.
- **Stage 3 (runner):** Executes as an unprivileged non-root user (`nodejs`) on Node Alpine with `/health` liveness probe.

```bash
# Build the production image
docker build -t krishiseva:latest .

# Run the containerized service
docker run -p 5000:5000 \
  -e NODE_ENV=production \
  -e GEMINI_API_KEY=your_key_here \
  krishiseva:latest
```

---

## 6. Docker Compose Multi-Container Orchestration

```bash
# Start API, frontend bundle, and local Supabase PostgreSQL stack
docker-compose up -d

# View service logs
docker-compose logs -f api

# Stop containers
docker-compose down
```

---

## 7. CI/CD GitHub Actions Pipeline

Defined in `.github/workflows/ci.yml`:
1. **Lint & Code Quality:** ESLint checks across packages.
2. **Type Checking:** `npm run typecheck` across both `apps/web` and `apps/api`.
3. **Automated Testing:** `vitest run` executing unit, validation, and integration tests.
4. **Build Verification:** Compiles production web bundle and API dist.
5. **Docker Build Verification:** Tests container creation and non-root execution.

---

## 8. Health Monitoring & Observability

- **Liveness Probe:** `GET /health` returns status, process uptime, and timestamp.
- **Readiness Probe:** `GET /ready` checks database socket availability, AI model readiness, and configuration integrity.
- **Logging:** Structured JSON logs in production with PII redaction and request correlation IDs.

---

## 9. Backup & Disaster Recovery Procedures

- **Automated Daily Backups:** Configure daily physical backups in Supabase Cloud with 30-day Point-in-Time Recovery (PITR).
- **Logical Schema Dumps:**
  ```bash
  npx supabase db dump -f backup_$(date +%Y%m%d).sql
  ```
- **Storage Backups:** Sync user-uploaded diagnostic images from Supabase Storage S3-compatible buckets to secondary disaster recovery cold storage.
