export type ProjectCategory = 'residential' | 'industrial' | 'infrastructure';
export type ProjectProgress = 'completed' | 'in_progress';

export type PortfolioMeta = {
  category: ProjectCategory;
  progress: ProjectProgress;
  location?: string;
  area?: string;
  floors?: string;
  year?: string;
};

export type PortfolioProject = {
  id: string | number;
  slug: string;
  title: string;
  description: string;
  image?: string | null;
  featured?: boolean;
  startDate?: string | null;
  endDate?: string | null;
  meta: PortfolioMeta;
};

export type PortfolioFilter =
  | 'all'
  | 'residential'
  | 'industrial'
  | 'infrastructure'
  | 'completed'
  | 'in_progress';

function parseMeta(raw: unknown): Partial<PortfolioMeta> | null {
  if (!raw) return null;
  if (typeof raw === 'object' && raw !== null && !Array.isArray(raw)) {
    const o = raw as Record<string, unknown>;
    return {
      category: o.category as ProjectCategory | undefined,
      progress: o.progress as ProjectProgress | undefined,
      location: typeof o.location === 'string' ? o.location : undefined,
      area: typeof o.area === 'string' ? o.area : undefined,
      floors: typeof o.floors === 'string' ? o.floors : undefined,
      year: typeof o.year === 'string' ? o.year : undefined,
    };
  }
  if (typeof raw === 'string') {
    try {
      return parseMeta(JSON.parse(raw));
    } catch {
      return null;
    }
  }
  return null;
}

function inferMeta(p: {
  title?: string;
  slug?: string;
  description?: string;
  endDate?: string | null;
  startDate?: string | null;
}): PortfolioMeta {
  const title = `${p.title || ''} ${p.slug || ''}`.toLowerCase();
  const desc = `${p.description || ''}`.toLowerCase();
  const text = `${title} ${desc}`;

  let category: ProjectCategory = 'infrastructure';
  if (
    /орон сууц|апартмент|apartment|residential|айлын|хотхон|байр|b7|hos-tsamhag|цамхаг|орон сууцны|128 айл|360 айл|300 айл/.test(
      text
    )
  ) {
    category = 'residential';
  }
  if (/үйлдвэр|уурхай|factory|industrial|plant|бетон зуурмаг|блокийн үйлдвэр/.test(text)) {
    category = 'industrial';
  }
  if (/нисэх|airport|khushigt|хөшигт|дэд бүтэц|инфра|infrastructure|карго|аэродром|гүүр|кран нийлүүлсэн/.test(text)) {
    category = 'infrastructure';
  }

  let progress: ProjectProgress = 'completed';
  if (
    /баригдаж байна|үргэлжилж|in progress|ongoing|хэвийн үргэлжилж|төлөвлөсөн|ashiglalt/.test(text)
  ) {
    progress = 'in_progress';
  }
  if (p.endDate) {
    const end = new Date(p.endDate);
    if (!Number.isNaN(end.getTime()) && end > new Date()) {
      progress = 'in_progress';
    }
  }

  let year = '—';
  if (p.endDate) {
    const y = new Date(p.endDate).getFullYear();
    if (!Number.isNaN(y)) year = String(y);
  } else if (p.startDate) {
    const y = new Date(p.startDate).getFullYear();
    if (!Number.isNaN(y)) year = String(y);
  }

  return {
    category,
    progress,
    year,
  };
}

export function normalizeProjectForPortfolio(p: Record<string, unknown>): PortfolioProject {
  const fromApi = parseMeta(p.portfolioMeta);
  const inferred = inferMeta({
    title: typeof p.title === 'string' ? p.title : '',
    slug: typeof p.slug === 'string' ? p.slug : '',
    description: typeof p.description === 'string' ? p.description : '',
    endDate: (p.endDate as string) ?? null,
    startDate: (p.startDate as string) ?? null,
  });

  const category =
    fromApi?.category &&
    ['residential', 'industrial', 'infrastructure'].includes(fromApi.category)
      ? fromApi.category
      : inferred.category;
  const progress =
    fromApi?.progress && ['completed', 'in_progress'].includes(fromApi.progress)
      ? fromApi.progress
      : inferred.progress;

  const meta: PortfolioMeta = {
    category,
    progress,
    location: fromApi?.location ?? undefined,
    area: fromApi?.area ?? undefined,
    floors: fromApi?.floors ?? undefined,
    year: fromApi?.year ?? inferred.year,
  };

  return {
    id: (p.id as string | number) ?? p.slug,
    slug: String(p.slug ?? ''),
    title: String(p.title ?? ''),
    description: String(p.description ?? ''),
    image: (p.image as string) ?? null,
    featured: Boolean(p.featured),
    startDate: (p.startDate as string) ?? null,
    endDate: (p.endDate as string) ?? null,
    meta,
  };
}

export function filterPortfolioProjects(
  projects: PortfolioProject[],
  filter: PortfolioFilter
): PortfolioProject[] {
  if (filter === 'all') return projects;
  if (filter === 'completed' || filter === 'in_progress') {
    return projects.filter((p) => p.meta.progress === filter);
  }
  return projects.filter((p) => p.meta.category === filter);
}
