# Production Checklist

## Database (PostgreSQL)

- Set `DATABASE_URL` to managed PostgreSQL connection string
- **Deploy note:** Render uses `prisma db push` because existing migration history is SQLite-shaped. For a clean production story, add a PostgreSQL migration baseline and switch the build back to `prisma migrate deploy`.
- Seed **once** on Render: set `RUN_PRISMA_SEED=1` for a single deploy, then unset. Do **not** seed every deploy (overwrites were fixed in seed.ts for team rows).
- Web service and Postgres must be the **same region** (e.g. Singapore). `render.yaml` sets `region: singapore` for new resources.
- `DATABASE_CONNECTION_MODE=auto` (default): TCP-probe internal `dpg-xxxxx-a`, then external `*.postgres.render.com` + `sslmode=require`.
- `DATABASE_INTERNAL_HOST_SUFFIX` must match the **database** region (e.g. `singapore-postgres.render.com`), not the web service if they differ.
- Free Postgres **Suspended** → Resume in Render Dashboard before deploy.
- If deploy exits at `prisma db push`: check logs; entrypoint retries with `--accept-data-loss`. Broken schema once: `RESET_DATABASE=1` (wipes data), deploy, then remove.

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

