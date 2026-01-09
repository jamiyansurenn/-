# Backend .env Setup

## Required Variables

```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your-secret-key-here"
```

## Optional Variables

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
JWT_EXPIRES_IN="7d"
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

## Quick Setup

Run `node setup-env.js` to auto-generate `.env` file with random JWT_SECRET.
