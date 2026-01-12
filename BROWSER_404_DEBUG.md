# Browser Console 404 Алдаа - Debug Guide

## Одоогийн Нөхцөл

✅ Build амжилттай
✅ Pages render хийгдэж байна
❌ Browser console дээр 404 алдаа гарч байна

---

## 1. 🔍 Алдааны Шалтгаан

Browser console дээр "Failed to load resource: 404" гэсэн алдаа гарч байна. Энэ нь:

### Боломжит Шалтгаанууд:

1. **API Calls Failing (Хамгийн их магадлалтай)**
   - Backend API unavailable эсвэл 404 буцааж байна
   - Environment variable зөв уншдаггүй
   - CORS issue байж магадгүй

2. **Image URLs 404**
   - Image files байхгүй
   - Image URL буруу

3. **Static Assets Missing**
   - CSS, JS files олдсонгүй

---

## 2. ✅ Шалгах Арга

### Step 1: Browser DevTools дээр Шалгах

1. **Browser DevTools нээх** (F12)
2. **Network tab руу орох**
3. **Page refresh хийх** (F5)
4. **404 алдаа гарсан request-уудыг харах**

**Харагдах зүйлс:**
- Ямар request 404 буцааж байна вэ?
- Request URL юу вэ?
- Request type юу вэ? (API call, image, CSS, JS?)

### Step 2: API Calls Шалгах

**Network tab дээр:**
- API request-ууд харагдаж байгаа эсэх
- Status code: 404 эсвэл бусад алдаа
- Request URL: `https://daatsin-tsamkhag-backend.onrender.com/...` эсвэл `http://localhost:3001/...`

**Хэрэв API 404 буцааж байвал:**
- Backend API ажиллаж байгаа эсэх шалгах
- Environment variable зөв эсэх шалгах
- API endpoint зөв эсэх шалгах

### Step 3: Console Tab Шалгах

**Console tab дээр:**
- JavaScript алдаа байгаа эсэх
- API error messages байгаа эсэх
- Network error messages байгаа эсэх

---

## 3. 🔧 Шийдэл

### Асуудал 1: API Calls 404

**Тодорхойлох:**
- Network tab: API request-ийн status 404
- Request URL: Backend API URL

**Шалгах:**
1. **Backend API ажиллаж байгаа эсэх:**
   ```
   Browser дээр нээх: https://daatsin-tsamkhag-backend.onrender.com/api
   Swagger docs харагдах ёстой
   ```

2. **Environment Variable зөв эсэх:**
   - Vercel Dashboard → Settings → Environment Variables
   - `NEXT_PUBLIC_API_URL` байгаа эсэх
   - Value: `https://daatsin-tsamkhag-backend.onrender.com`

3. **API Endpoint зөв эсэх:**
   - Backend дээр `/company-info/public` endpoint байгаа эсэх
   - Backend дээр `/services/public` endpoint байгаа эсэх

**Шийдэл:**
- Backend API ажиллуулах (Render.com dashboard шалгах)
- Environment variable зөв тохируулах
- CORS settings шалгах

### Асуудал 2: Image URLs 404

**Тодорхойлох:**
- Network tab: Image request-ийн status 404
- Request URL: Image URL

**Шалгах:**
- Image files backend дээр байгаа эсэх
- Image URL зөв эсэх

**Шийдэл:**
- Image files upload хийх
- Image URL зөв тохируулах
- Placeholder images ашиглах (аль хэдийн хийгдсэн)

### Асуудал 3: Environment Variable Issue

**Тодорхойлох:**
- Network tab: Request URL `http://localhost:3001/...` байна
- Энэ нь environment variable зөв уншдаггүй гэсэн үг

**Шийдэл:**
1. **Vercel Dashboard → Settings → Environment Variables**
2. **`NEXT_PUBLIC_API_URL` шалгах:**
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://daatsin-tsamkhag-backend.onrender.com`
   - Environment: All (Production, Preview, Development)
3. **Redeploy хийх**

---

## 4. 📋 Debug Checklist

### Browser DevTools

- [ ] Network tab нээсэн
- [ ] Page refresh хийсэн
- [ ] 404 алдаа гарсан request-уудыг тэмдэглэсэн
- [ ] Request URL-ийг тэмдэглэсэн
- [ ] Request type-ийг тэмдэглэсэн (API, image, CSS, JS)

### Backend API

- [ ] Backend API ажиллаж байгаа эсэх шалгасан
- [ ] `https://daatsin-tsamkhag-backend.onrender.com/api` нээж үзсэн
- [ ] API endpoints ажиллаж байгаа эсэх шалгасан

### Environment Variables

- [ ] Vercel дээр `NEXT_PUBLIC_API_URL` байгаа эсэх шалгасан
- [ ] Value зөв эсэх шалгасан
- [ ] All environments-д байгаа эсэх шалгасан

### Deployment

- [ ] Хамгийн сүүлийн deployment-ийг шалгасан
- [ ] Environment variables deploy хийгдсэн эсэх шалгасан
- [ ] Redeploy хийсэн (хэрэв шаардлагатай бол)

---

## 5. 🚀 Хурдан Шийдэл

### Хэрэв API Calls 404 буцааж байвал:

1. **Backend API шалгах:**
   ```
   https://daatsin-tsamkhag-backend.onrender.com/api
   ```

2. **Environment Variable шалгах:**
   - Vercel → Settings → Environment Variables
   - `NEXT_PUBLIC_API_URL` = `https://daatsin-tsamkhag-backend.onrender.com`

3. **Redeploy хийх:**
   - Vercel Dashboard → Deployments → "..." → "Redeploy"

### Хэрэв Image URLs 404 буцааж байвал:

- Энэ нь хэвийн байж магадгүй (placeholder images ашиглаж байна)
- Database-д image URLs байгаа эсэх шалгах
- Backend uploads folder-д images байгаа эсэх шалгах

---

## 6. 📸 Хэрэв Тусламж Хэрэгтэй Бол

Дараах мэдээллийг хуваалцана уу:

1. **Browser DevTools → Network tab screenshot:**
   - 404 алдаа гарсан request-ууд
   - Request URL
   - Status code

2. **Browser DevTools → Console tab screenshot:**
   - JavaScript алдаанууд
   - Error messages

3. **Vercel Environment Variables screenshot:**
   - `NEXT_PUBLIC_API_URL` байгаа эсэх
   - Value зөв эсэх

4. **Backend API status:**
   - `https://daatsin-tsamkhag-backend.onrender.com/api` ажиллаж байгаа эсэх

---

## Summary

**Алдаа:** Browser console дээр 404 алдаа

**Боломжит шалтгаан:**
1. API calls failing (backend unavailable)
2. Environment variable issue
3. Image URLs 404 (хэвийн байж магадгүй)

**Шалгах:**
1. Browser DevTools → Network tab
2. Backend API status
3. Environment variables

**Шийдэл:**
1. Backend API ажиллуулах
2. Environment variables зөв тохируулах
3. Redeploy хийх
