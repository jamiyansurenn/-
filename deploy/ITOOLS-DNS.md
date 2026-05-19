# iTools DNS + Vercel + Render (daatsiintsamhag.mn)

## 1. iTools — эхлээд DNS management асаах

Screenshot дээр **«Домэйн нэрийн удирдлага / DNS management»** checkbox **идэвхгүй** байна.

1. Тэр checkbox-ийг **сонгоно** (Үнэгүй / 1 жил).
2. Хадгална / захиална.
3. Дараа нь **DNS record** нэмэх цэс гарна.

Nameserver-үүд `dns21–24.isafespace.com` хэвээр үлдэнэ — зөв.

## 2. DNS records (Vercel frontend)

| Type  | Host | Value                 |
|-------|------|-----------------------|
| A     | @    | 76.76.21.21           |
| CNAME | www  | cname.vercel-dns.com  |

Vercel → Project → **Domains** → `daatsiintsamhag.mn`, `www.daatsiintsamhag.mn`

## 3. DNS record (Render API)

| Type  | Host | Value                          |
|-------|------|--------------------------------|
| CNAME | api  | YOUR-SERVICE.onrender.com      |

Render → Web Service → **Custom Domains** → `api.daatsiintsamhag.mn`

## 4. Environment

**Vercel**

- `NEXT_PUBLIC_API_URL=https://api.daatsiintsamhag.mn`
- `NEXT_PUBLIC_SITE_URL=https://daatsiintsamhag.mn`

**Render**

- `DATABASE_URL` = Postgres **Internal** URL (Link database to service)
- `JWT_SECRET` = generated secret
- `CORS_ORIGIN=https://daatsiintsamhag.mn,https://www.daatsiintsamhag.mn`
- `DATABASE_INTERNAL_HOST_SUFFIX=singapore-postgres.render.com` (Singapore region)
- `RUN_PRISMA_SEED=1` — **зөвхөн анхны deploy** дээр нэг удаа, дараа нь устгана эсвэл `0`

DNS тархах: 15 мин – 48 цаг.
