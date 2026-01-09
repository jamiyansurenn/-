const fs = require('fs');
const crypto = require('crypto');

const envContent = `# Database Configuration (SQLite)
DATABASE_URL="file:./prisma/dev.db"

# JWT Authentication
JWT_SECRET="${crypto.randomBytes(32).toString('hex')}"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Email Configuration (optional - for contact form notifications)
# Leave empty if you don't need email notifications
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
`;

if (!fs.existsSync('.env')) {
  fs.writeFileSync('.env', envContent);
  console.log('✅ .env file created successfully!');
  console.log('✅ Using SQLite database: file:./prisma/dev.db');
  console.log('✅ JWT_SECRET has been auto-generated');
} else {
  console.log('⚠️  .env file already exists. Skipping...');
}
