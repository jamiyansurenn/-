# Login Issue Fix

## Problem
- Backend was not responding on port 3001
- Login endpoint returning 404
- Error: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

## Solution Applied
1. ✅ Stopped all Node processes
2. ✅ Restarted backend server
3. ✅ Backend should now be running on `http://localhost:3001`

## How to Access Admin Panel

### Step 1: Make sure both servers are running

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```
Should show: `Application is running on: http://localhost:3001`

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```
Should show: `Local: http://localhost:3000`

### Step 2: Open Frontend URL (NOT backend!)
Open in browser:
```
http://localhost:3000/admin/login
```

**IMPORTANT:** Use port **3000** (frontend), NOT port 3001 (backend)!

### Step 3: Login
- Email: `admin@moncon.mn`
- Password: `admin123`

## If Still Getting Errors

1. **Check backend is running:**
   - Open: `http://localhost:3001/api`
   - Should see Swagger documentation

2. **Check frontend is running:**
   - Open: `http://localhost:3000`
   - Should see homepage

3. **Clear browser cache:**
   - Press `Ctrl + Shift + R` (hard refresh)

4. **Check browser console:**
   - Press `F12` → Console tab
   - Look for any errors

## Common Mistakes
- ❌ Using `localhost:3001/admin/login` (backend port)
- ✅ Use `localhost:3000/admin/login` (frontend port)
