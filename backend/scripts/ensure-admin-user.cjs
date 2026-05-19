/**
 * Ensures default admin exists (Render first deploy / empty users table).
 * Set FORCE_RESET_ADMIN=1 once to reset admin@moncon.mn password.
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const ADMIN_EMAIL = (process.env.ADMIN_SEED_EMAIL || 'admin@moncon.mn').trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_SEED_PASSWORD || 'admin123';
const FORCE = process.env.FORCE_RESET_ADMIN === '1' || process.env.FORCE_RESET_ADMIN === 'true';

async function main() {
  const prisma = new PrismaClient();
  try {
    const count = await prisma.user.count();
    if (count > 0 && !FORCE) {
      console.error(`ensure-admin: ${count} user(s) in DB — skip (set FORCE_RESET_ADMIN=1 to reset ${ADMIN_EMAIL})`);
      return;
    }

    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await prisma.user.upsert({
      where: { email: ADMIN_EMAIL },
      update: {
        password: hashed,
        name: 'Admin User',
        role: 'ADMIN',
      },
      create: {
        email: ADMIN_EMAIL,
        password: hashed,
        name: 'Admin User',
        role: 'ADMIN',
      },
    });

    console.error(`ensure-admin: OK — ${ADMIN_EMAIL} (password from ADMIN_SEED_PASSWORD or default admin123)`);
    if (FORCE) {
      console.error('ensure-admin: FORCE_RESET_ADMIN was set — change password after login.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('ensure-admin failed:', err.message);
  process.exit(1);
});
