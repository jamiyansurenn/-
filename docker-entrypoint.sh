#!/bin/sh
set -e
cd /app/backend

if [ -z "$DATABASE_URL" ]; then
  echo "============================================================"
  echo "ERROR: DATABASE_URL is not set in the container environment."
  echo ""
  echo "On Render:"
  echo "  1) Create a PostgreSQL instance (or use an existing one)."
  echo "  2) Open your Web Service → Environment."
  echo "  3) Add DATABASE_URL = <Internal Database URL> (starts with postgresql://...)"
  echo "     Or use \"Link\" Postgres to this service so Render injects DATABASE_URL."
  echo "============================================================"
  exit 1
fi

# Render "Hostname" in the dashboard is often shortened (dpg-xxx-a). Prisma needs the full
# internal host (dpg-xxx-a.<region>-postgres.render.com). Default region suffix matches Oregon.
if command -v node >/dev/null 2>&1; then
  export DATABASE_URL="$(
    DATABASE_URL="$DATABASE_URL" \
    DATABASE_INTERNAL_HOST_SUFFIX="${DATABASE_INTERNAL_HOST_SUFFIX:-oregon-postgres.render.com}" \
    node -e 'const u=process.env.DATABASE_URL;const suffix=process.env.DATABASE_INTERNAL_HOST_SUFFIX||"oregon-postgres.render.com";const w=s=>process.stdout.write(s);try{const url=new URL(u.replace(/^postgres(ql)?:/i,"http:"));const h=url.hostname;if(/^dpg-[a-z0-9]+-a$/i.test(h)&&!h.includes(".")){url.hostname=h+"."+suffix;console.error("docker-entrypoint: expanded Postgres host; set DATABASE_INTERNAL_HOST_SUFFIX if DB is not in that region, or use full Internal URL from Render.");w(url.toString().replace(/^http:/i,"postgresql:"));}else{w(u);}}catch{w(u);}'
  )"
fi

# Render Postgres + Prisma: TLS is required unless the URL already sets ssl/sslmode.
with_ssl_if_needed() {
  u="$1"
  case "$u" in
    *sslmode=*)
      printf '%s\n' "$u"
      return
      ;;
  esac
  case "$u" in
    *\?*)
      printf '%s\n' "${u}&sslmode=require"
      ;;
    *)
      printf '%s\n' "${u}?sslmode=require"
      ;;
  esac
}
export DATABASE_URL="$(with_ssl_if_needed "$DATABASE_URL")"

echo "Running prisma db push..."
npx prisma db push

if [ "${SKIP_PRISMA_SEED}" = "1" ] || [ "${SKIP_PRISMA_SEED}" = "true" ]; then
  echo "SKIP_PRISMA_SEED is set; skipping seed."
else
  echo "Running prisma seed..."
  npm run prisma:seed
fi

exec node dist/src/main
