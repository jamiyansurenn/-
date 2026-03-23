import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SpeedInsights } from '@vercel/speed-insights/next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
