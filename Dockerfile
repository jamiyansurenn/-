# Root Dockerfile for Render builds.
# Render currently tries to build a Docker image from `<repo_root>/Dockerfile`.
# This Dockerfile builds and runs the backend (NestJS) from the `backend/` folder.

FROM node:18-alpine

WORKDIR /app

# Prisma on Alpine needs OpenSSL; otherwise generate / engines can fail.
RUN apk add --no-cache openssl libc6-compat

# Install dependencies (include dev deps because we run prisma:seed at runtime).
# `npm ci` runs `postinstall` → `prisma generate`, so `prisma/schema.prisma` must exist first.
COPY backend/package*.json ./backend/
COPY backend/prisma ./backend/prisma
RUN npm --prefix ./backend ci

# Copy remaining backend sources
COPY backend ./backend

WORKDIR /app/backend

# Generate Prisma client during build.
RUN npx prisma generate

# Build NestJS (creates `dist/`)
RUN npm run build

EXPOSE 3001

# Runtime schema sync + seed, then start.
CMD ["sh", "-c", "npx prisma db push && npm run prisma:seed && node dist/src/main"]

