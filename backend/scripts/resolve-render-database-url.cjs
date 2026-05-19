/**
 * Pick a working Render DATABASE_URL (real PostgreSQL auth, not TCP-only).
 * Usage: node resolve-render-database-url.cjs [--probe]
 */
const { Client } = require('pg');

const raw = process.env.DATABASE_URL;
const externalOverride = process.env.DATABASE_EXTERNAL_URL;
const mode = (process.env.DATABASE_CONNECTION_MODE || 'auto').toLowerCase();
const suffix =
  process.env.DATABASE_INTERNAL_HOST_SUFFIX ||
  process.env.DATABASE_POSTGRES_SUFFIX ||
  'singapore-postgres.render.com';
const probeOnly = process.argv.includes('--probe');

function hostFromUrl(url) {
  const m = String(url).match(/@([^:/@?]+)/);
  return m ? m[1] : '';
}

function replaceHost(url, newHost) {
  return String(url).replace(/@([^:/@?]+)/, `@${newHost}`);
}

function setQueryParams(url, params) {
  const [base, qs = ''] = String(url).split('?');
  const sp = new URLSearchParams(qs);
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === '') sp.delete(key);
    else sp.set(key, String(value));
  }
  const q = sp.toString();
  return q ? `${base}?${q}` : base;
}

function buildCandidates(connectionString) {
  const host = hostFromUrl(connectionString);
  const isShortInternal = /^dpg-[a-z0-9]+-a$/i.test(host);
  const isRenderExternal = /\.postgres\.render\.com$/i.test(host);
  const expanded = isShortInternal ? replaceHost(connectionString, `${host}.${suffix}`) : connectionString;

  const list = [];

  if (externalOverride && externalOverride.trim()) {
    list.push({ label: 'DATABASE_EXTERNAL_URL', url: externalOverride.trim() });
  }

  list.push({ label: 'linked (unchanged)', url: connectionString });

  if (isShortInternal) {
    list.push({
      label: 'internal private network (no ssl)',
      url: setQueryParams(connectionString, { sslmode: null, connect_timeout: '60' }),
    });
  }

  if (isShortInternal || isRenderExternal) {
    const ext = isRenderExternal ? connectionString : expanded;
    list.push({
      label: 'external hostname (no ssl)',
      url: setQueryParams(ext, { sslmode: null, connect_timeout: '60' }),
    });
    list.push({
      label: 'external hostname (sslmode=prefer)',
      url: setQueryParams(ext, { sslmode: 'prefer', connect_timeout: '60' }),
    });
    list.push({
      label: 'external hostname (sslmode=require)',
      url: setQueryParams(ext, { sslmode: 'require', connect_timeout: '60' }),
    });
  }

  const seen = new Set();
  return list.filter(({ url }) => {
    if (seen.has(url)) return false;
    seen.add(url);
    return true;
  });
}

async function probePostgres(connectionString, timeoutMs = 15000) {
  const client = new Client({
    connectionString,
    connectionTimeoutMillis: timeoutMs,
  });
  try {
    await client.connect();
    await client.query('SELECT 1');
    return true;
  } catch (err) {
    console.error(`  probe failed (${hostFromUrl(connectionString)}): ${err.message}`);
    return false;
  } finally {
    try {
      await client.end();
    } catch {
      /* ignore */
    }
  }
}

async function pickUrl() {
  if (!raw) {
    console.error('resolve-render-database-url: DATABASE_URL is empty');
    process.exit(1);
  }

  const candidates = buildCandidates(raw);

  if (mode === 'raw' || mode === 'unchanged') {
    console.error('DATABASE_CONNECTION_MODE=raw');
    return raw;
  }

  const filtered =
    mode === 'internal'
      ? candidates.filter((c) => c.label.includes('internal') || c.label.includes('unchanged'))
      : mode === 'external'
        ? candidates.filter((c) => c.label.includes('external') || c.label.includes('DATABASE_EXTERNAL'))
        : candidates;

  console.error(`Testing ${filtered.length} Postgres URL(s)...`);
  for (const { label, url } of filtered) {
    console.error(`→ ${label}: ${hostFromUrl(url)}`);
    if (await probePostgres(url)) {
      console.error(`✓ Using ${label} (${hostFromUrl(url)})`);
      return url;
    }
  }

  console.error('No URL passed PostgreSQL auth; falling back to linked DATABASE_URL');
  return raw;
}

async function main() {
  const url = await pickUrl();
  if (probeOnly) {
    const ok = await probePostgres(url);
    process.exit(ok ? 0 : 1);
  }
  process.stdout.write(url);
}

main().catch((err) => {
  console.error('resolve-render-database-url:', err.message);
  process.exit(1);
});
