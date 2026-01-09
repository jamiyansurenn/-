# Backend API

NestJS backend for corporate website.

## Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Setup environment:**
```bash
# Copy .env.example to .env (or run setup script)
node setup-env.js
```

3. **Database setup:**
```bash
# Generate Prisma Client
npx prisma@5.7.1 generate

# Run migrations (creates database)
npx prisma@5.7.1 migrate dev --name init

# Seed database
npm run prisma:seed
```

4. **Start development server:**
```bash
npm run dev
```

Server will run on `http://localhost:3001`
API documentation: `http://localhost:3001/api`

## Environment Variables

Create `.env` file in backend directory:

```env
# Database (SQLite)
DATABASE_URL="file:./prisma/dev.db"

# JWT Authentication (REQUIRED)
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Email (optional - for contact form)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

## Default Admin Credentials

- Email: `admin@moncon.mn`
- Password: `admin123`

## API Endpoints

- Swagger UI: `http://localhost:3001/api`
- All endpoints require authentication except public routes
