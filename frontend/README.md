# Frontend Website

Next.js frontend for Moncon corporate website.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
# Create .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. Start development server:
```bash
npm run dev
```

## Pages

- `/` - Home page
- `/about` - About Us
- `/services` - Services listing
- `/services/[slug]` - Service detail
- `/projects` - Projects listing
- `/projects/[slug]` - Project detail
- `/news` - News listing
- `/news/[slug]` - News detail
- `/contact` - Contact form
- `/admin` - Admin dashboard
- `/admin/login` - Admin login

## Admin Panel

Access admin panel at `/admin` after logging in.

Default credentials:
- Email: admin@moncon.mn
- Password: admin123
