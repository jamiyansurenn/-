#!/bin/sh
set -e
cd /app/backend

PRISMA="./node_modules/.bin/prisma"

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

# Render blueprint connectionString already uses the internal host (dpg-xxx-a).
# Do NOT expand to *.postgres.render.com from inside Render — that causes P1017.
if [ "$DATABASE_EXPAND_HOST" = "1" ] || [ "$DATABASE_EXPAND_HOST" = "true" ]; then
  SUFFIX="$(postgres_suffix)"
  if command -v node >/dev/null 2>&1; then
    export DATABASE_URL="$(
      DATABASE_URL="$DATABASE_URL" \
      DATABASE_INTERNAL_HOST_SUFFIX="$SUFFIX" \
      node -e 'const u=process.env.DATABASE_URL;const suffix=process.env.DATABASE_INTERNAL_HOST_SUFFIX;const w=s=>process.stdout.write(s);try{const url=new URL(u.replace(/^postgres(ql)?:/i,"http:"));const h=url.hostname;if(/^dpg-[a-z0-9]+-a$/i.test(h)&&!h.includes(".")){url.hostname=h+"."+suffix;console.error("docker-entrypoint: expanded Postgres host to",url.hostname);w(url.toString().replace(/^http:/i,"postgresql:"));}else{w(u);}}catch(e){console.error("docker-entrypoint: invalid DATABASE_URL",e.message);process.exit(1);}'
    )"
  fi
else
  echo "docker-entrypoint: using DATABASE_URL host as-is (Render internal private network)."
fi

# sslmode=require is for external URLs only; internal dpg-*-a rejects it (P1017).
export DATABASE_URL="$(
  DATABASE_URL="$DATABASE_URL" \
  DATABASE_SSL_MODE="${DATABASE_SSL_MODE:-}" \
  node -e '
const raw = process.env.DATABASE_URL;
const mode = (process.env.DATABASE_SSL_MODE || "").trim();
const w = (s) => process.stdout.write(s);
try {
  const url = new URL(raw.replace(/^postgres(ql)?:/i, "http:"));
  const h = url.hostname;
  const isRenderInternal = /^dpg-[a-z0-9]+-a$/i.test(h) && !h.includes(".");
  const isRenderExternal = /\.postgres\.render\.com$/i.test(h);
  let ssl = mode;
  if (!ssl) {
    if (isRenderInternal) ssl = "omit";
    else if (isRenderExternal) ssl = "require";
    else ssl = "require";
  }
  if (ssl === "omit" || ssl === "disable" || ssl === "false") {
    w(raw);
  } else {
    const base = raw.split("?")[0];
    const params = new URLSearchParams(raw.includes("?") ? raw.split("?")[1] : "");
    if (!params.has("sslmode")) params.set("sslmode", ssl);
    const q = params.toString();
    w(q ? `${base}?${q}` : base);
  }
} catch (e) {
  console.error("docker-entrypoint: invalid DATABASE_URL", e.message);
  process.exit(1);
}
'
)"

with_connect_timeout() {
  u="$1"
  case "$u" in
    *connect_timeout=*) printf '%s\n' "$u" ;;
    *\?*) printf '%s\n' "${u}&connect_timeout=30" ;;
    *) printf '%s\n' "${u}?connect_timeout=30" ;;
  esac
}
export DATABASE_URL="$(with_connect_timeout "$DATABASE_URL")"

echo "Prisma $("$PRISMA" -v 2>/dev/null | head -n 1 || echo unknown)"
echo "DATABASE host: $(node -e "try{const u=new URL(process.env.DATABASE_URL.replace(/^postgres(ql)?:/i,'http:'));console.log(u.hostname)}catch{console.log('?')}")"

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
MAX_TRIES="${DB_PUSH_MAX_TRIES:-12}"
while true; do
  if run_db_push 2>&1; then
    echo "prisma db push OK"
    break
  fi
  TRIES=$((TRIES + 1))
  if [ "$TRIES" -ge "$MAX_TRIES" ]; then
    echo "============================================================"
    echo "ERROR: prisma db push failed after $TRIES attempts."
    echo "Use Render Internal Database URL (host dpg-xxxxx-a, same region)."
    echo "Do not set DATABASE_EXPAND_HOST unless connecting from outside Render."
    echo "One-time fix if schema is broken: RESET_DATABASE=1 (wipes DB), deploy, remove."
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
