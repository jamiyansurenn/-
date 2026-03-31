const DEFAULT_PROD_API = 'https://daatsin-tsamkhag-backend.onrender.com';

export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  const value = (envUrl && envUrl.trim()) || DEFAULT_PROD_API;
  return value.replace(/\/$/, '');
}

