# KrishiSeva Security Architecture & Hardening Guide

## 1. Security Principles

KrishiSeva adheres to Defense-in-Depth, Principle of Least Privilege, and Zero Trust architectures. The platform protects sensitive agricultural data, farmer identities, and system configurations while preventing algorithmic abuse.

---

## 2. Authentication & Session Management

- **Provider:** Supabase Auth (OAuth2 / OpenID Connect + JWT standard).
- **Custom Password Storage:** Strictly prohibited. No passwords, salt hashes, or plaintext credentials ever pass through application databases.
- **Token Verification:** Every API request to `/api/*` requires a signed JWT in the `Authorization: Bearer <token>` header. The token is cryptographically verified against Supabase Auth public keys.
- **Session Expiry & Refresh:** JWT tokens carry short lifetimes (1 hour) with automatic token rotation via refresh endpoints.
- **Frontend Storage:** Tokens are held in secure browser memory / reactive auth context; no sensitive credentials are stored in cookies without `HttpOnly` and `SameSite=Strict`.

---

## 3. Server-Side Role-Based Access Control (RBAC)

The application enforces three distinct security personas:

| Role | Scope & Permissions |
| :--- | :--- |
| **`FARMER`** | Own profile, own farms, own cadastral fields, own advisory requests, own support cases, own notifications. Cannot query any other farmer's data. |
| **`OFFICER`** | Assigned farmers and support cases within their geographic jurisdiction; ability to review AI advisories, publish agricultural alerts, and update case notes. |
| **`ADMIN`** | Platform configuration, role elevation, crop/scheme master catalog modification, audit log inspection, system telemetry. |

**Critical Rule:** RBAC is enforced strictly server-side in `apps/api/src/middleware/auth.ts`. Frontend route guards (`ProtectedRoute.tsx`) are purely for user experience and never serve as security boundaries.

---

## 4. API & Network Security

### 4.1 Helmet Security Headers
The API service employs Helmet with production-grade HTTP security headers:
- `Content-Security-Policy`: Restricts script and resource origins.
- `X-Frame-Options: DENY`: Prevents clickjacking attacks.
- `X-Content-Type-Options: nosniff`: Mitigates MIME-sniffing vulnerabilities.
- `Strict-Transport-Security` (HSTS): Enforces HTTPS connections.
- `Referrer-Policy: strict-origin-when-cross-origin`.

### 4.2 Cross-Origin Resource Sharing (CORS)
CORS is locked to explicit, whitelist-governed origins defined via the `FRONTEND_URL` environment variable. Wildcard `*` origins are blocked.

### 4.3 Rate Limiting & DoS Protection
Using `express-rate-limit`, endpoints enforce tiered request budgets:
- Global API limit: 100 requests per 15-minute window per IP.
- AI Advisory & Chat endpoints: Stricter rate limits (20 requests / 15 minutes) to protect against API budget exhaustion and prompt bombing.
- Rate-limit headers (`RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`) are emitted.

### 4.4 Centralized Request Validation
All HTTP requests (body, query params, URL parameters) are validated against centralized Zod schemas before reaching controller logic. Malformed requests are rejected with `400 Bad Request` before database or AI queries execute.

---

## 5. AI Security & Prompt Injection Mitigation

### 5.1 Server-Side Key Isolation
The `GEMINI_API_KEY` is strictly confined to the backend process (`apps/api/src/ai/gemini.ts`). It is never referenced in client code, Vite build scripts, frontend bundles, or browser network traffic.

### 5.2 System Prompt Immutability
User inputs (crop symptoms, farmer questions) are strictly separated from system instructions:
- System prompt instructions define behavioral boundaries and safety guardrails.
- User input is injected only within clearly demarcated user context templates.
- Explicit system instructions forbid the model from executing user commands that contradict agricultural safety.

### 5.3 AI Response Schema Enforcement
LLM responses are never forwarded directly to the client. Every generation undergoes a 3-step pipeline:
1. Markdown / code-block stripping (`cleanJsonText`).
2. JSON parsing.
3. Strict Zod schema validation (`aiCropAdvisorySchema`, `aiDiseasePestSchema`, etc.).
If validation fails, the API gracefully falls back to a deterministic agronomic rule engine and logs a sanitized diagnostic event.

### 5.4 Agricultural Safety Guardrails
To prevent harm to crops, soil, or human life:
- Recommendations involving chemical pesticides, herbicides, or fungicides must clearly communicate uncertainty.
- Dangerous chemical dosage instructions are filtered out.
- High-risk pest or disease alerts automatically mandate human officer inspection.

---

## 6. Database & Storage Security

- **Row Level Security (RLS):** Enabled on every user-sensitive table. Even if an API query omitted a filter, PostgreSQL kernel-level RLS policies prevent cross-tenant data leakage.
- **SQL Injection Prevention:** All database operations utilize parameterized queries through the Supabase client. Plain string concatenation in SQL queries is prohibited.
- **Service Role Key:** Confined exclusively to privileged backend tasks (e.g. administrative batch jobs). Never distributed to client web apps.

---

## 7. Sensitive Data & Audit Logging

- **Logger Sanitization:** `apps/api/src/utils/logger.ts` redacts PII, telephone numbers, auth tokens, passwords, and API keys before writing log streams.
- **Production Error Handling:** In production (`NODE_ENV=production`), application stack traces are stripped from HTTP error responses and replaced with generic error codes.
- **Tamper-Evident Audit Trail:** The `audit_logs` table records actor identity, action type, affected entity, hashed IP, and timestamp for all significant mutations.
