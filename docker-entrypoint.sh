#!/bin/sh
set -e
cd /app/backend

PRISMA="./node_modules/.bin/prisma"
RESOLVE_URL="node ./scripts/resolve-render-database-url.cjs"

if [ -z "$DATABASE_URL" ]; then
  echo "============================================================"
  echo "ERROR: DATABASE_URL is not set."
  echo "Render → Web Service → Environment → Link PostgreSQL."
  echo "============================================================"
  exit 1
fi

if [ -z "$JWT_SECRET" ]; then
  echo "============================================================"
  echo "ERROR: JWT_SECRET is not set."
  echo "============================================================"
  exit 1
fi

echo "Waiting for PostgreSQL (free tier may take up to 90s)..."
TRIES=0
while [ "$TRIES" -lt 18 ]; do
  if $RESOLVE_URL --probe >/dev/null 2>&1; then
    echo "PostgreSQL accepts TCP connections."
    break
  fi
  TRIES=$((TRIES + 1))
  echo "  Postgres not ready ($TRIES/18), sleeping 5s..."
  sleep 5
done

export DATABASE_URL="$($RESOLVE_URL)"
echo "DATABASE host: $(node -e "try{const u=new URL(process.env.DATABASE_URL.replace(/^postgres(ql)?:/i,'http:'));console.log(u.hostname)}catch{console.log('?')}")"
echo "Prisma $("$PRISMA" -v 2>/dev/null | head -n 1 || echo unknown)"

PUSH_FLAGS="--accept-data-loss --skip-generate"
if [ "$RESET_DATABASE" = "1" ] || [ "$RESET_DATABASE" = "true" ]; then
  echo "WARNING: RESET_DATABASE=1 — prisma db push --force-reset"
  PUSH_FLAGS="--force-reset --accept-data-loss --skip-generate"
fi

run_db_push() {
  "$PRISMA" db push $PUSH_FLAGS
}

echo "Running prisma db push ($PUSH_FLAGS)..."
TRIES=0
MAX_TRIES="${DB_PUSH_MAX_TRIES:-8}"
while true; do
  if run_db_push 2>&1; then
    echo "prisma db push OK"
    break
  fi
  TRIES=$((TRIES + 1))
  if [ "$TRIES" -ge "$MAX_TRIES" ]; then
    echo "============================================================"
    echo "ERROR: prisma db push failed after $TRIES attempts."
    echo "Render Dashboard → Postgres → Resume if Suspended."
    echo "Web service and DB must be same region (e.g. both Singapore)."
    echo "Set DATABASE_INTERNAL_HOST_SUFFIX to match DB region (*.postgres.render.com)."
    echo "Try DATABASE_CONNECTION_MODE=external in Environment."
    echo "============================================================"
    exit 1
  fi
  echo "DB push failed (attempt $TRIES/$MAX_TRIES), retry in 5s..."
  sleep 5
done

if [ "$RUN_PRISMA_SEED" = "1" ] || [ "$RUN_PRISMA_SEED" = "true" ]; then
  echo "Running prisma seed (RUN_PRISMA_SEED)..."
  npm run prisma:seed
else
  echo "Skipping seed (set RUN_PRISMA_SEED=1 once for first-time setup)."
fi

exec node dist/src/main
