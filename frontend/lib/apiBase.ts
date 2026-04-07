/** Production API when NEXT_PUBLIC_API_URL is unset (set explicitly on Vercel to your backend URL). */
const DEFAULT_PROD_API = 'https://cmk5p5ciod.onrender.com';

const LOCAL_API = 'http://localhost:3001';

/**
 * - If `NEXT_PUBLIC_API_URL` is set → use it (trimmed).
 * - **Development** without env → `http://localhost:3001` so About/Home read the same DB as local admin
 *   (otherwise the default Render URL makes “localhost” show cloud/stale team & content).
 * - **Production** build without env → Render fallback.
 */
export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.replace(/\/$/, '');
  }
  if (process.env.NODE_ENV === 'development') {
    return LOCAL_API;
  }
  return DEFAULT_PROD_API.replace(/\/$/, '');
}

