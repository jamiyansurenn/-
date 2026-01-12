# Root Page 404 NOT_FOUND Алдаа - Шийдэл

## Одоогийн Нөхцөл

❌ **Root page (`/`) 404 NOT_FOUND буцааж байна**
- Request URL: `https://1fjstwfyh-cfa7r6ijl-kdl-2ks-projects.vercel.app/`
- Status Code: 404 Not Found
- Response Header: `x-vercel-error: NOT_FOUND`

---

## 1. ✅ Шийдэл

### Засвар хийгдсэн:

**`frontend/app/page.tsx`** файлд илүү найдвартай error handling нэмсэн:

**Өмнө (❌):**
```typescript
const [companyInfo, services, projects, news] = await Promise.all([
  getCompanyInfo().catch(() => ({ data: null })),
  getServices().catch(() => ({ data: [] })),
  getProjects(true).catch(() => ({ data: [] })),
  getNews(true, 3).catch(() => ({ data: [] })),
]);
```

**Одоо (✅):**
```typescript
let companyInfo = { data: null };
let services = { data: [] };
let projects = { data: [] };
let news = { data: [] };

try {
  const results = await Promise.allSettled([
    getCompanyInfo(),
    getServices(),
    getProjects(true),
    getNews(true, 3),
  ]);

  companyInfo = results[0].status === 'fulfilled' ? results[0].value : { data: null };
  services = results[1].status === 'fulfilled' ? results[1].value : { data: [] };
  projects = results[2].status === 'fulfilled' ? results[2].value : { data: [] };
  news = results[3].status === 'fulfilled' ? results[3].value : { data: [] };
} catch (error) {
  // Silently handle errors - page will render with empty data
  console.error('Error fetching data:', error);
}
```

### Яагаад энэ засвар шаардлагатай байсан вэ?

1. **`Promise.all()` vs `Promise.allSettled()`:**
   - `Promise.all()`: Нэг promise reject хийвэл бүхэлдээ fail хийж байсан
   - `Promise.allSettled()`: Бүх promise-ууд дууссаныг хүлээж, success/fail-ийг тус тусад нь handle хийж байна

2. **Axios Error Handling:**
   - Axios network errors заримдаа `.catch()`-аар барьдаггүй байсан
   - Try-catch wrapper нь бүх төрлийн алдааг барьж байна

3. **Next.js Error Behavior:**
   - Server component дээр unhandled error гарвал Next.js 404 буцааж байна
   - Try-catch нь энэ асуудлыг шийдэж байна

---

## 2. 🔍 Root Cause Analysis

### Юу болж байсан вэ?

**Асуудал:**
- Root page API call-ууд хийж байгаа
- API unavailable эсвэл network error гарч байна
- Error handle хийгдээгүй → Next.js 404 буцааж байна

**Шалтгаан:**
1. **API Calls Failing:**
   - Backend API unavailable (`https://daatsin-tsamkhag-backend.onrender.com`)
   - Environment variable зөв уншдаггүй (`NEXT_PUBLIC_API_URL`)
   - Network timeout эсвэл connection refused

2. **Error Handling Issue:**
   - `Promise.all()` нэг promise fail хийвэл бүхэлдээ fail хийж байсан
   - Axios errors заримдаа `.catch()`-аар барьдаггүй байсан
   - Unhandled error → Next.js 404

3. **Next.js Behavior:**
   - Server component дээр unhandled error → 404 NOT_FOUND
   - Error boundary байхгүй → 404 буцааж байна

### Ямар нөхцөл байдал энэ алдааг үүсгэсэн вэ?

1. **Backend API unavailable:**
   - Render.com дээр backend ажиллахгүй байна
   - Network issue байна
   - CORS issue байна

2. **Environment Variable:**
   - `NEXT_PUBLIC_API_URL` Vercel дээр тохируулаагүй
   - Default value (`http://localhost:3001`) ашиглаж байна
   - Production дээр localhost руу хандаж байна → fail

3. **Error Handling:**
   - `Promise.all()` нь нэг fail хийвэл бүхэлдээ fail хийж байсан
   - Try-catch wrapper байхгүй байсан

---

## 3. 📚 Концепт: Error Handling in Next.js Server Components

### Яагаад энэ алдаа байдаг вэ?

**Next.js Server Component Error Behavior:**
- Unhandled errors → 404 NOT_FOUND
- Error boundaries байхгүй → 404 буцааж байна
- Fail fast philosophy → Better 404 than broken page

**Why 404 instead of 500?**
- Next.js routing layer дээр error → 404
- Server component error → Next.js assumes route doesn't exist
- Protects users from seeing error pages

### Зөв ойлголт (Mental Model)

**Error Handling Best Practices:**

```
┌─────────────────────────────────────────┐
│  Error Handling Strategy                │
└─────────────────────────────────────────┘

1. Promise.allSettled() (not Promise.all())
   ├─ All promises complete (success or fail)
   ├─ Check each result individually
   └─ Never fails completely

2. Try-Catch Wrapper
   ├─ Catches any unexpected errors
   ├─ Prevents 404 errors
   └─ Allows page to render with fallback data

3. Graceful Degradation
   ├─ Page renders even if API fails
   ├─ Shows empty state or placeholder
   └─ User experience not broken
```

**When to use what:**

| Scenario | Approach | Why |
|----------|----------|-----|
| Multiple API calls | `Promise.allSettled()` | Don't fail all if one fails |
| Critical data | `Promise.all()` + try-catch | Need all data or show error |
| Optional data | `Promise.allSettled()` | Show what's available |
| Network calls | Always wrap in try-catch | Network can fail anytime |

---

## 4. 🚨 Warning Signs

### Ирээдүйд юуг анзаарах вэ?

**Code Smells:**
1. ✅ `Promise.all()` without error handling
2. ✅ API calls without try-catch
3. ✅ No fallback data for failed API calls
4. ✅ Assuming API is always available

**Red Flags:**
- "404 NOT_FOUND" in production
- Pages work locally but fail in production
- API errors causing page failures
- No error handling in server components

**Patterns to Avoid:**
```typescript
// ❌ WRONG: Promise.all() fails if one fails
const [data1, data2] = await Promise.all([
  getData1(),
  getData2(),
]);

// ✅ CORRECT: Promise.allSettled() handles failures
const results = await Promise.allSettled([
  getData1(),
  getData2(),
]);
const data1 = results[0].status === 'fulfilled' ? results[0].value : null;
const data2 = results[1].status === 'fulfilled' ? results[1].value : null;
```

---

## 5. 🔄 Alternatives & Trade-offs

### Chosen Solution: `Promise.allSettled()` + Try-Catch ⭐

**Why we chose this:**
- ✅ Most robust error handling
- ✅ Page always renders (graceful degradation)
- ✅ Individual API failures don't break the page
- ✅ Better user experience
- ❌ More code
- ❌ Need to handle each result individually

### Alternative 1: Better `.catch()` Handlers

**Implementation:**
```typescript
const [companyInfo, services] = await Promise.all([
  getCompanyInfo().catch((err) => {
    console.error('Company info error:', err);
    return { data: null };
  }),
  getServices().catch((err) => {
    console.error('Services error:', err);
    return { data: [] };
  }),
]);
```

**Trade-offs:**
- ✅ Simpler code
- ✅ Individual error handling
- ❌ Still uses `Promise.all()` (fails if one fails)
- ❌ Less robust

### Alternative 2: Error Boundary

**Implementation:**
```typescript
// app/error.tsx
'use client';
export default function Error({ error, reset }) {
  return <div>Error: {error.message}</div>;
}
```

**Trade-offs:**
- ✅ Catches all errors
- ✅ Better error UI
- ❌ Only works for client components
- ❌ Doesn't prevent 404 for server components

---

## Одоо Хийх Зүйл

### Step 1: Changes Commit Хийх

```powershell
cd "c:\Users\hitech\Desktop\copy mon"
git add frontend/app/page.tsx
git commit -m "Fix root page 404: Improve error handling with Promise.allSettled"
```

### Step 2: Push Хийх

```powershell
git push origin main
```

### Step 3: Vercel Deployment Хүлээх

- Vercel автоматаар deploy хийх болно
- Эсвэл manual redeploy хийх

### Step 4: Шалгах

1. **Root page:** `https://rho-brown.vercel.app/` ажиллах ёстой
2. **API errors:** Page render хийх ёстой (data байхгүй ч гэсэн)
3. **Console:** Error messages харагдах ёстой (гэхдээ page ажиллах ёстой)

### Step 5: Backend API Шалгах

Хэрэв хэвээр асуудал байвал:

1. **Backend API шалгах:**
   ```
   https://daatsin-tsamkhag-backend.onrender.com/api
   ```

2. **Environment Variable шалгах:**
   - Vercel → Settings → Environment Variables
   - `NEXT_PUBLIC_API_URL` = `https://daatsin-tsamkhag-backend.onrender.com`

3. **Redeploy хийх**

---

## Summary

**Шийдэл:** `Promise.allSettled()` + try-catch wrapper ашигласан

**Яагаад:** `Promise.all()` нэг fail хийвэл бүхэлдээ fail хийж, unhandled error → 404

**Ойлголт:** Server components дээр бүх API calls-д robust error handling шаардлагатай

**Анхаарах:** Ирээдүйд `Promise.allSettled()` ашиглах, try-catch wrapper нэмэх

**Status:** ✅ Засвар хийгдсэн, commit хийхэд бэлэн!
