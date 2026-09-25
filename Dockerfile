# =============================================================================
# Production Multi-Stage Dockerfile
# AI-Powered Agriculture Department Digital Platform
# =============================================================================

# --- Stage 1: Base & Dependencies ---
FROM node:24-alpine AS dependencies
WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY apps/web/package*.json ./apps/web/

RUN npm ci

# --- Stage 2: Build Frontend & Backend ---
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=dependencies /app/apps/web/node_modules ./apps/web/node_modules
COPY . .

# Build API and Web
RUN npm run build

# --- Stage 3: Production Runner for API (and serving static web) ---
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Create unprivileged user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 agriservice

# Copy built artifacts and runtime packages
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/apps/api/package*.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/web/dist ./apps/web/dist

# Install production-only dependencies
RUN npm ci --omit=dev --workspace=apps/api

# Change ownership
USER agriservice

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

CMD ["node", "apps/api/dist/server.js"]
