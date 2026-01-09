# Admin Panel Access Guide

## How to Access Admin Panel

### Step 1: Start Backend (if not running)
```bash
cd backend
npm run dev
```
Backend should run on: `http://localhost:3001`

### Step 2: Start Frontend (if not running)
```bash
cd frontend
npm run dev
```
Frontend should run on: `http://localhost:3000`

### Step 3: Open Admin Login Page
Open your browser and go to:
```
http://localhost:3000/admin/login
```

### Step 4: Login with Admin Credentials

**Admin Account:**
- **Email:** `admin@moncon.mn`
- **Password:** `admin123`

**Editor Account (optional):**
- **Email:** `editor@moncon.mn`
- **Password:** `editor123`

### Step 5: Access Admin Dashboard
After successful login, you'll be redirected to:
```
http://localhost:3000/admin
```

## Admin Panel Features

- **Dashboard** (`/admin`) - Overview statistics
- **Company Info** (`/admin/company-info`) - Manage company information
- **Services** (`/admin/services`) - Manage services
- **Projects** (`/admin/projects`) - Manage projects
- **News** (`/admin/news`) - Manage news articles
- **Team Members** (`/admin/team-members`) - Manage team members
- **Partners** (`/admin/partners`) - Manage partners
- **Contact Messages** (`/admin/contact`) - View contact form submissions

## Troubleshooting

### Cannot access admin panel
1. Make sure backend is running on port 3001
2. Make sure frontend is running on port 3000
3. Check browser console for errors
4. Verify `.env.local` in frontend has: `NEXT_PUBLIC_API_URL=http://localhost:3001`

### Login fails
1. Check backend is running: `http://localhost:3001/api`
2. Verify database is seeded: Run `npm run prisma:seed` in backend
3. Check browser console for API errors

### Token expired
- Logout and login again
- Token expires after 7 days (configurable in backend `.env`)
