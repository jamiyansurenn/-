'use client';

import { useEffect, useState } from 'react';
import AboutSection from '@/components/home/AboutSection';
import ValuesPillarsSection from '@/components/home/ValuesPillarsSection';
import ProjectsSection from '@/components/home/ProjectsSection';
import NewsSection from '@/components/home/NewsSection';
import { getProjects, getNews } from '@/lib/api';
import { filterProductionNews } from '@/lib/newsPlaceholder';

/**
 * Нүүр хуудасны API-хамаарсан хэсгүүдийг серверийг блоклолгүйгээр татаж,
 * дүрслэлийн skeleton-оор хурдан харагдуулна.
 */
export default function HomeBelowFold() {
  const [projects, setProjects] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [feedReady, setFeedReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [pRes, nRes] = await Promise.allSettled([
          getProjects(true).catch(() => ({ data: [] })),
          getNews(true, 9, { useFallback: false }).catch(() => ({ data: [] })),
        ]);
        if (cancelled) return;
        const pData = pRes.status === 'fulfilled' ? ((pRes.value as { data?: unknown })?.data ?? []) : [];
        const nData =
          nRes.status === 'fulfilled' ? ((nRes.value as { data?: unknown })?.data ?? []) : [];
        setProjects(Array.isArray(pData) ? pData : []);
        setNews(filterProductionNews(Array.isArray(nData) ? (nData as any[]) : []));
      } catch {
        if (!cancelled) {
          setProjects([]);
          setNews([]);
        }
      } finally {
        if (!cancelled) setFeedReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <AboutSection />
      <ValuesPillarsSection maxItems={3} />
      <ProjectsSection projects={projects} loading={!feedReady} />
      <NewsSection news={news} loading={!feedReady} />
    </>
  );
}