/** Fallback when NEXT_PUBLIC_API_URL is unset; set that env on Vercel to your Render “URL” exactly. */
const DEFAULT_PROD_API = 'https://cmk5p5ciod.onrender.com';

export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  const value = (envUrl && envUrl.trim()) || DEFAULT_PROD_API;
  return value.replace(/\/$/, '');
}

