# Root Dockerfile for Render builds.
# Render currently tries to build a Docker image from `<repo_root>/Dockerfile`.
# This Dockerfile builds and runs the backend (NestJS) from the `backend/` folder.

FROM node:18-alpine

WORKDIR /app

# Install dependencies (include dev deps because we run prisma:seed at runtime).
COPY backend/package*.json ./backend/
RUN npm --prefix ./backend ci

# Copy backend sources
COPY backend ./backend

WORKDIR /app/backend

# Generate Prisma client during build.
RUN npx prisma generate

# Build NestJS (creates `dist/`)
RUN npm run build

EXPOSE 3001

# Runtime schema sync + seed, then start.
CMD ["sh", "-c", "npx prisma db push && npm run prisma:seed && node dist/src/main"]

