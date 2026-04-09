/* After `next build` in frontend/, copy static assets to repo root so Vercel
 * projects with Root Directory "." and Output Directory "public" validate. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, 'frontend', 'public');
const dest = path.join(root, 'public');

if (!fs.existsSync(src)) {
  console.warn('sync-root-public: no frontend/public, skipping');
  process.exit(0);
}

fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });
