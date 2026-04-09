const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Monorepo: Vercel copies `frontend/.next` → repo root; trace from parent so
  // serverless resolves `frontend/node_modules` and shared files correctly.
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '..'),
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: false,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

module.exports = nextConfig
