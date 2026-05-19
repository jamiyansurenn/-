#!/bin/sh
set -e
cd /app/backend

if [ -z "$DATABASE_URL" ]; then
  echo "============================================================"
  echo "ERROR: DATABASE_URL is not set."
  echo "Render → Web Service → Environment → Link PostgreSQL (Internal URL)."
  echo "============================================================"
  exit 1
fi

if [ -z "$JWT_SECRET" ]; then
  echo "============================================================"
  echo "ERROR: JWT_SECRET is not set."
  echo "Render → Environment → Add JWT_SECRET (Generated secret)."
  echo "============================================================"
  exit 1
fi

# Singapore (ap-southeast-1) Postgres internal host suffix — NOT Oregon.
postgres_suffix() {
  if [ -n "$DATABASE_INTERNAL_HOST_SUFFIX" ]; then
    printf '%s' "$DATABASE_INTERNAL_HOST_SUFFIX"
    return
  fi
  case "${RENDER_REGION:-}" in
    *singapore*|*ap-southeast*) printf '%s' 'singapore-postgres.render.com' ;;
    *frankfurt*|*eu-central*) printf '%s' 'frankfurt-postgres.render.com' ;;
    *ohio*) printf '%s' 'ohio-postgres.render.com' ;;
    *virginia*) printf '%s' 'virginia-postgres.render.com' ;;
    *) printf '%s' 'singapore-postgres.render.com' ;;
  esac
}

SUFFIX="$(postgres_suffix)"

if command -v node >/dev/null 2>&1; then
  export DATABASE_URL="$(
    DATABASE_URL="$DATABASE_URL" \
    DATABASE_INTERNAL_HOST_SUFFIX="$SUFFIX" \
    node -e 'const u=process.env.DATABASE_URL;const suffix=process.env.DATABASE_INTERNAL_HOST_SUFFIX;const w=s=>process.stdout.write(s);try{const url=new URL(u.replace(/^postgres(ql)?:/i,"http:"));const h=url.hostname;if(/^dpg-[a-z0-9]+-a$/i.test(h)&&!h.includes(".")){url.hostname=h+"."+suffix;console.error("docker-entrypoint: expanded Postgres host to",url.hostname);w(url.toString().replace(/^http:/i,"postgresql:"));}else{w(u);}}catch(e){console.error("docker-entrypoint: invalid DATABASE_URL",e.message);process.exit(1);}'
  )"
fi

with_ssl_if_needed() {
  u="$1"
  case "$u" in
    *sslmode=*) printf '%s\n' "$u" ;;
    *\?*) printf '%s\n' "${u}&sslmode=require" ;;
    *) printf '%s\n' "${u}?sslmode=require" ;;
  esac
}
export DATABASE_URL="$(with_ssl_if_needed "$DATABASE_URL")"

echo "Running prisma db push..."
if ! npx prisma db push 2>&1; then
  echo "============================================================"
  echo "ERROR: prisma db push failed."
  echo "Check DATABASE_URL (Internal URL from Render Postgres, same region)."
  echo "Set DATABASE_INTERNAL_HOST_SUFFIX=$SUFFIX if hostname expansion is wrong."
  echo "============================================================"
  exit 1
fi

# Seed only when explicitly requested (first deploy). Default OFF so admin edits persist.
if [ "$RUN_PRISMA_SEED" = "1" ] || [ "$RUN_PRISMA_SEED" = "true" ]; then
  echo "Running prisma seed (RUN_PRISMA_SEED)..."
  npm run prisma:seed
else
  echo "Skipping seed (set RUN_PRISMA_SEED=1 once for first-time setup)."
fi

exec node dist/src/main
