#!/bin/sh
set -e
cd /app/backend

PRISMA="./node_modules/.bin/prisma"
RESOLVE_URL="node ./scripts/resolve-render-database-url.cjs"

if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set. Link Postgres in Render Environment."
  exit 1
fi

if [ -z "$JWT_SECRET" ]; then
  echo "ERROR: JWT_SECRET is not set."
  exit 1
fi

echo "Resolving Postgres URL (auth probe, free tier may take ~90s)..."
TRIES=0
while [ "$TRIES" -lt 24 ]; do
  if export DATABASE_URL="$($RESOLVE_URL)" && $RESOLVE_URL --probe >/dev/null 2>&1; then
    echo "PostgreSQL auth OK → $(node -e "try{const u=new URL(process.env.DATABASE_URL.replace(/^postgres(ql)?:/i,'http:'));console.log(u.hostname)}catch{console.log('?')}")"
    break
  fi
  TRIES=$((TRIES + 1))
  echo "  Postgres not ready ($TRIES/24), sleeping 5s..."
  sleep 5
done

if [ "$TRIES" -ge 24 ]; then
  echo "============================================================"
  echo "ERROR: Cannot authenticate to Postgres."
  echo "1. Render → Postgres → Resume if Suspended"
  echo "2. Web + DB same region (e.g. Oregon → oregon-postgres.render.com)"
  echo "3. Paste External Database URL into DATABASE_EXTERNAL_URL env var"
  echo "============================================================"
  exit 1
fi

echo "Prisma $("$PRISMA" -v 2>/dev/null | head -n 1 || echo unknown)"

PUSH_FLAGS="--accept-data-loss --skip-generate"
if [ "$RESET_DATABASE" = "1" ] || [ "$RESET_DATABASE" = "true" ]; then
  echo "WARNING: RESET_DATABASE=1 — force-reset"
  PUSH_FLAGS="--force-reset --accept-data-loss --skip-generate"
fi

echo "Running prisma db push ($PUSH_FLAGS)..."
if ! "$PRISMA" db push $PUSH_FLAGS 2>&1; then
  echo "============================================================"
  echo "ERROR: prisma db push failed."
  echo "Paste Postgres External URL into DATABASE_EXTERNAL_URL and redeploy."
  echo "============================================================"
  exit 1
fi
echo "prisma db push OK"

if [ "$RUN_PRISMA_SEED" = "1" ] || [ "$RUN_PRISMA_SEED" = "true" ]; then
  echo "Running prisma seed..."
  npm run prisma:seed
else
  echo "Skipping full seed (RUN_PRISMA_SEED=1 for demo content)."
fi

echo "Ensuring admin user (empty DB or FORCE_RESET_ADMIN=1)..."
node ./scripts/ensure-admin-user.cjs

exec node dist/src/main
