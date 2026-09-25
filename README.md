# 🌾 KrishiSeva | AI-Powered Agriculture Department Digital Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-3.8%20Flash-orange.svg)](https://ai.google.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e.svg)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Production%20Ready-2496ed.svg)](https://www.docker.com/)

**KrishiSeva** is a complete, production-ready **AI-Powered Agriculture Department Digital Platform** engineered to connect farmers, agricultural extension officers, and departmental administrators. 

The platform delivers evidence-conscious AI crop advisory, differential pest and disease diagnosis, weather-aware agronomy, searchable government schemes, support case escalation, and regional alerts—backed by a robust, secure, and observable cloud-native architecture.

---

## 🏛️ System Portals & Capabilities

### 🧑‍🌾 1. Farmer Portal
- **Dashboard & Farm Overview:** High-level metrics on registered landholdings, active crop cycles, recent AI advisories, and weather forecasts.
- **Farm & Field Asset Registry:** Register multiple farms, geographic coordinates, cadastral fields, soil types, soil pH, and irrigation infrastructure.
- **AI Crop Advisory:** Multi-factor contextual advisory powered by Google Gemini (crop, growth stage, soil pH, irrigation, weather, observed symptoms) returning a validated 13-field agronomic plan.
- **Conversational Agronomist (AI Chat):** Natural-language agricultural assistant answering soil, irrigation, fertilizer, and weather management questions.
- **Pest & Disease Differential Diagnosis:** Diagnostic assistant analyzing symptom descriptions and crop images, generating probabilistic causes, preventive measures, and clear safety disclaimers.
- **Government Agricultural Schemes:** Filterable directory of national & state schemes (PM-KISAN, PMFBY, Soil Health Card, PMKSY) with eligibility rules, required documents, and direct application links.
- **Regional Agricultural Alerts:** Real-time warnings for weather extremes, pest outbreaks, and departmental directives.
- **Support Cases:** Raise support tickets with agricultural officers, complete with automated AI briefings.

### 🧑‍💼 2. Agriculture Officer Portal
- **Officer Command Dashboard:** Overview of pending cases, assigned farmers, recent advisories, and active regional alerts.
- **AI-Assisted Case Triage:** Review incoming farmer requests equipped with an automated AI briefing highlighting symptom urgency, key facts, and recommended inspection questions.
- **Technical Assessments & Resolutions:** Add official human-verified agronomic notes and issue formal resolutions.
- **Jurisdictional Farmer Management:** Inspect farmer profiles, registered landholdings, and historical soil tests.
- **Advisory Quality Audits:** Audit algorithmic advisories generated in the district to ensure compliance with agricultural best practices.
- **Alert Dispatch Center:** Publish regional pest warnings, frost/heat advisories, and departmental announcements.

### 🛡️ 3. Administrative Portal
- **User & Officer Administration:** Manage platform accounts, elevate roles (FARMER, OFFICER, ADMIN), and assign extension officers to districts.
- **Master Crop Catalog:** Maintain agronomic baselines, optimal sowing windows, soil requirements, and water schedules.
- **Government Scheme Management:** Create, verify, and update subsidy schemes and official source URLs.
- **Tamper-Evident Audit Logs:** Review security events, authentication attempts, AI usage, and data mutations.
- **System Telemetry & Health:** Monitor server uptime, memory consumption, database connectivity, and Gemini model status.

---

## ⚡ 1-Click Role Switcher (Instant Evaluation)

To enable zero-configuration evaluation without manual database setup, the application includes a **quick role switcher** in the user interface (top-right header avatar dropdown):
- **Switch to Farmer (`Ramesh Patel`)**: Test farm registration, AI advisory, chat, pest assistant, and case submission.
- **Switch to Officer (`Dr. Vikram Sharma`)**: Test case review with AI briefings, farmer inspection, and alert publishing.
- **Switch to Admin (`Super Admin`)**: Test user management, crop catalog, scheme publisher, and audit logs.

---

## 🚀 Quickstart & Local Installation

### Prerequisites
- Node.js 20.x, 22.x, or 24.x
- npm 10+
- (Optional) Docker & Docker Compose
- (Optional) Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/your-org/krishiseva.git
cd krishiseva

# Install dependencies across all monorepo workspaces
npm install
```

### 2. Configure Environment
```bash
# Copy environment configuration
cp .env.example .env
```
*(Note: If `GEMINI_API_KEY` is not provided, KrishiSeva runs an intelligent, deterministic agronomic rule engine fallback that produces fully schema-validated advisories.)*

### 3. Start Development Servers
```bash
# Start both Backend API (:5000) and Frontend Web (:5173) concurrently
npm run dev

# Or run services individually:
npm run dev:api   # Express API on http://localhost:5000
npm run dev:web   # Vite React on http://localhost:5173
```

Open your browser at **`http://localhost:5173`**.

---

## 🧪 Testing & Quality Assurance

```bash
# Run TypeScript compilation check across all packages
npm run typecheck

# Run unit, schema validation, and API integration test suites
npm run test
```

---

## 🐳 Docker & Production Deployment

### Multi-Stage Container Build
The production `Dockerfile` compiles the TypeScript backend and React frontend into a lightweight Alpine image executing as an unprivileged `nodejs` non-root user:

```bash
# Build the production image
docker build -t krishiseva:latest .

# Run container
docker run -p 5000:5000 \
  -e NODE_ENV=production \
  -e GEMINI_API_KEY=your_key_here \
  krishiseva:latest
```

The containerized service serves both the API endpoints (`/api/*`) and the compiled Single-Page Application on port `5000`.

### Docker Compose
```bash
docker-compose up -d
```

---

## 📚 Technical Documentation Directory

Comprehensive engineering specifications are located in the `docs/` folder:

| Document | Description |
| :--- | :--- |
| [Architecture Guide](docs/architecture.md) | High-level system architecture, component design, monorepo structure, and user workflows |
| [API Specification](docs/api.md) | Exhaustive REST API endpoint catalog, request/response schemas, and error codes |
| [Database Schema](docs/database.md) | 13-table PostgreSQL schema, indexes, constraints, and Row Level Security (RLS) policies |
| [Security Architecture](docs/security.md) | Server-side RBAC, Helmet headers, CORS, rate limiting, and prompt injection defense |
| [AI & Prompts Guide](docs/ai.md) | Gemini 3.8 Flash SDK setup, master system prompt, 13-field advisory schema, and rule fallback |
| [DevOps & Deployment](docs/deployment.md) | Multi-stage Docker, Docker Compose, CI/CD pipeline, and health monitoring |

---

## 🔒 Security & Agronomic Responsibility Notice

1. **Server-Side API Key Isolation:** The `GEMINI_API_KEY` is strictly confined to the backend server. It is never exposed to the frontend or browser network logs.
2. **Agricultural Safety Guardrails:** AI recommendations involving chemical pesticides, fungicides, or fertilizers explicitly communicate uncertainty and mandate consultation with qualified Agriculture Extension Officers or Krishi Vigyan Kendras (KVK).
3. **Data Isolation:** PostgreSQL Row Level Security (RLS) ensures farmers are strictly isolated to their own farms and records.

---

## 📄 License
This project is licensed under the MIT License for government and agricultural advancement.
