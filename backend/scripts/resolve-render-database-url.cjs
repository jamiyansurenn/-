/**
 * Pick a DATABASE_URL that works on Render (internal private network vs external + SSL).
 * Usage: node resolve-render-database-url.cjs [--probe]
 * Prints the chosen URL to stdout; logs to stderr.
 */
const net = require('net');

const raw = process.env.DATABASE_URL;
const mode = (process.env.DATABASE_CONNECTION_MODE || 'auto').toLowerCase();
const suffix =
  process.env.DATABASE_INTERNAL_HOST_SUFFIX ||
  process.env.DATABASE_POSTGRES_SUFFIX ||
  'singapore-postgres.render.com';
const probeOnly = process.argv.includes('--probe');

function toHttpUrl(connectionString) {
  return connectionString.replace(/^postgres(ql)?:/i, 'http:');
}

function parse(connectionString) {
  return new URL(toHttpUrl(connectionString));
}

function serialize(url) {
  return url.toString().replace(/^http:/i, 'postgresql:');
}

function withQueryParams(connectionString, params) {
  const url = parse(connectionString);
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) url.searchParams.delete(key);
    else url.searchParams.set(key, String(value));
  }
  return serialize(url);
}

function buildCandidates(connectionString) {
  const base = connectionString.split('?')[0];
  const url = parse(base);
  const isShortInternal = /^dpg-[a-z0-9]+-a$/i.test(url.hostname);

  const internal = withQueryParams(base, {
    sslmode: null,
    connect_timeout: '30',
  });

  if (!isShortInternal) {
    const external = /\.postgres\.render\.com$/i.test(url.hostname)
      ? withQueryParams(base, { sslmode: 'require', connect_timeout: '30' })
      : withQueryParams(base, { connect_timeout: '30' });
    return { internal: external, external };
  }

  const extUrl = parse(base);
  extUrl.hostname = `${extUrl.hostname}.${suffix}`;
  const externalBase = serialize(extUrl);
  const external = withQueryParams(externalBase, {
    sslmode: 'require',
    connect_timeout: '30',
  });

  return { internal, external };
}

function probeTcp(connectionString, timeoutMs = 8000) {
  const url = parse(connectionString);
  const host = url.hostname;
  const port = Number(url.port || 5432);
  return new Promise((resolve) => {
    const socket = net.connect({ host, port, timeout: timeoutMs });
    const done = (ok) => {
      socket.removeAllListeners();
      try {
        socket.destroy();
      } catch {
        /* ignore */
      }
      resolve(ok);
    };
    socket.once('connect', () => done(true));
    socket.once('timeout', () => done(false));
    socket.once('error', () => done(false));
  });
}

async function pickUrl() {
  if (!raw) {
    console.error('resolve-render-database-url: DATABASE_URL is empty');
    process.exit(1);
  }

  const { internal, external } = buildCandidates(raw);

  if (mode === 'internal') {
    console.error('DATABASE_CONNECTION_MODE=internal');
    return internal;
  }
  if (mode === 'external') {
    console.error('DATABASE_CONNECTION_MODE=external');
    return external;
  }

  console.error('DATABASE_CONNECTION_MODE=auto — probing TCP...');
  if (await probeTcp(internal)) {
    console.error(`Using internal Postgres (${parse(internal).hostname})`);
    return internal;
  }
  console.error(
    `Internal host unreachable (${parse(internal).hostname}); trying external + SSL (${parse(external).hostname})`,
  );
  if (await probeTcp(external)) {
    console.error(`Using external Postgres (${parse(external).hostname})`);
    return external;
  }

  console.error('Neither internal nor external host accepted TCP; using external URL for Prisma retries');
  return external;
}

async function main() {
  const url = await pickUrl();
  if (probeOnly) {
    const ok = await probeTcp(url);
    process.exit(ok ? 0 : 1);
  }
  process.stdout.write(url);
}

main().catch((err) => {
  console.error('resolve-render-database-url:', err.message);
  process.exit(1);
});
