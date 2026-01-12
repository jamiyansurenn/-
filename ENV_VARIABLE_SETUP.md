# Environment Variable Setup - Бүрэн Заавар

## ✅ Vercel дээр `NEXT_PUBLIC_API_URL` тохируулах

### Step 1: Vercel Dashboard руу орох
1. https://vercel.com/dashboard
2. Project-оо сонгох (`gamma-ashy` эсвэл таны project нэр)

### Step 2: Environment Variables нэмэх
1. **Settings** → **Environment Variables**
2. **"Add New"** дарах
3. Дараах утгууд оруулах:

```
Key: NEXT_PUBLIC_API_URL
Value: https://daatsin-tsamkhag-backend.onrender.com
```

4. **Environments:** Бүгдийг сонгох:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

5. **"Save"** дарах

### Step 3: ⚠️ ЗААВАЛ REDEPLOY ХИЙХ

**Environment variable нэмсний дараа заавал redeploy хийх хэрэгтэй!**

1. **Deployments** tab руу орох
2. Хамгийн сүүлийн deployment-ийг олох
3. **"..." menu** → **"Redeploy"** сонгох
4. **"Use existing Build Cache"** checkbox-ийг **uncheck** хийх
5. **"Redeploy"** дарах
6. Deployment дууссаныг хүлээх (2-5 минут)

---

## 🔍 Шалгах Арга

### 1. Backend API шалгах

Browser дээр нээх:
```
https://daatsin-tsamkhag-backend.onrender.com/api
```

**Харагдах ёстой:**
- Swagger API documentation
- Эсвэл JSON response

**Хэрэв 404 байвал:**
- Backend deploy хийгдээгүй эсвэл унтарсан
- Render.com dashboard шалгах

### 2. Environment Variable шалгах

**Vercel Runtime Logs дээр:**
1. Vercel Dashboard → Deployments
2. Хамгийн сүүлийн deployment → **Runtime Logs**
3. `[DEBUG] API URL:` гэсэн log харагдах ёстой

**Хэрэв undefined байвал:**
- Environment variable нэмэгдээгүй
- Redeploy хийгдээгүй

### 3. Network Tab дээр шалгах

1. Browser DevTools → Network tab
2. Page refresh хийх
3. API request-уудыг харах
4. Request URL шалгах:
   - ✅ `https://daatsin-tsamkhag-backend.onrender.com/company-info/public`
   - ❌ `http://localhost:3001/company-info/public` (env variable уншдаггүй)

---

## 📋 Backend API Endpoints

Backend дээр дараах endpoint-ууд байна:

```
GET /company-info/public
GET /services/public
GET /services/public/:slug
GET /projects/public
GET /projects/public/:slug
GET /news/public
GET /news/public/:slug
GET /team-members/public
GET /partners/public
POST /contact
```

**Swagger Docs:**
```
https://daatsin-tsamkhag-backend.onrender.com/api
```

---

## ⚠️ Түгээмэл Алдаанууд

### Алдаа 1: Redeploy хийгээгүй

**Асуудал:**
- Environment variable нэмсэн
- Гэхдээ redeploy хийгээгүй
- `process.env.NEXT_PUBLIC_API_URL === undefined`

**Шийдэл:**
- Deployments → "..." → Redeploy
- "Use existing Build Cache" uncheck

### Алдаа 2: Backend URL буруу

**Асуудал:**
- Backend URL өөр байна
- Эсвэл backend deploy хийгдээгүй

**Шалгах:**
- Render.com dashboard → Backend service
- Service URL-ийг хуулж авах
- Vercel дээр зөв оруулах

### Алдаа 3: Trailing slash

**Асуудал:**
```
NEXT_PUBLIC_API_URL=https://backend.com/
fetch(`${API_URL}/posts`) // → https://backend.com//posts ❌
```

**Шийдэл:**
- Trailing slash-ийг арилгах (аль хэдийн засварласан)

### Алдаа 4: /api давхар

**Асуудал:**
```
NEXT_PUBLIC_API_URL=https://backend.com/api
fetch(`${API_URL}/api/posts`) // → /api/api/posts ❌
```

**Шийдэл:**
- Base URL-д `/api` нэмэхгүй
- Endpoint-д `/api` нэмэх (хэрэв backend-д global prefix байвал)

---

## ✅ Одоо Хийх Зүйл

### 1. Vercel дээр Environment Variable нэмэх

```
Key: NEXT_PUBLIC_API_URL
Value: https://daatsin-tsamkhag-backend.onrender.com
Environment: All
```

### 2. Redeploy хийх

- Deployments → "..." → Redeploy
- "Use existing Build Cache" uncheck

### 3. Шалгах

- Runtime Logs: `[DEBUG] API URL:` харагдах ёстой
- Network tab: API request-ууд зөв URL руу явах ёстой
- Browser: Page ажиллах ёстой

---

## 🎯 Хэрэв Хэвээр 404 Гарч Байвал

Дараах мэдээллийг хуваалцана уу:

1. **Vercel Runtime Logs:**
   - `[DEBUG] API URL:` ямар утгатай вэ?
   - undefined эсвэл URL?

2. **Backend API Status:**
   - `https://daatsin-tsamkhag-backend.onrender.com/api` ажиллаж байгаа эсэх?
   - Browser дээр юу харагдаж байна?

3. **Network Tab:**
   - Ямар request 404 буцааж байна вэ?
   - Request URL юу вэ?

Тэгвэл яг аль endpoint дээр 404 гарч байгааг олох боломжтой!
