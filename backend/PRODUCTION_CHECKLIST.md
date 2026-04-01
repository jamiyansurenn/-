# Production Checklist

## Database (PostgreSQL)

- Set `DATABASE_URL` to managed PostgreSQL connection string
- Run migrations: `npm run prisma:migrate:deploy`
- Seed once (optional): `npm run prisma:seed`

## Object Storage (S3)

- Set `STORAGE_DRIVER=s3`
- Set `S3_REGION`
- Set `S3_BUCKET`
- Set `S3_ACCESS_KEY_ID`
- Set `S3_SECRET_ACCESS_KEY`
- Set `S3_PUBLIC_BASE_URL` (public CDN/domain for uploaded assets)

## API / Security

- Set `NODE_ENV=production`
- Set a strong `JWT_SECRET`
- Set `CORS_ORIGIN` (single or comma-separated list of frontend domains)
- Keep `ENABLE_SWAGGER` unset (or `false`) in production unless explicitly needed

## Health and Monitoring

- Health endpoint: `GET /health`
- Configure platform health check path to `/health`
- Monitor 5xx rate and cold starts

## Frontend

- Set `NEXT_PUBLIC_API_URL` to deployed backend API origin
- Confirm image allowlist supports your `S3_PUBLIC_BASE_URL` host if needed

