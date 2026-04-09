import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';

/** Client-only: package uses usePathname/useSearchParams — SSR/Turbo can throw useContext null. */
const SpeedInsights = dynamic(
  () => import('@vercel/speed-insights/next').then((m) => m.SpeedInsights),
  { ssr: false }
);

function resolveMetadataBase(): URL {
  const vercel = process.env.VERCEL_URL?.trim();
  let candidate =
    vercel && vercel.length > 0
      ? `https://${vercel.replace(/^https?:\/\//i, '')}`
      : process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'http://localhost:3000';
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }
  try {
    return new URL(candidate);
  } catch {
    return new URL('http://localhost:3000');
  }
}

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: {
    default: 'ДААЦЫН ЦАМХАГ Групп',
    template: '%s | ДААЦЫН ЦАМХАГ Групп',
  },
  description: 'Даацтай бизнес ба даацтай амьдрал — Барилга, төсөл, үйлчилгээ',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'ДААЦЫН ЦАМХАГ Групп',
    description: 'Даацтай бизнес ба даацтай амьдрал',
    type: 'website',
    locale: 'mn_MN',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
