import axios from 'axios';
import { getApiBaseUrl } from './apiBase';

/**
 * Render free tier cold starts often need 50s+ at runtime.
 * During CI/Vercel `next build`, use a short default so SSG does not hang on cold APIs.
 * Override anytime with NEXT_PUBLIC_API_TIMEOUT_MS.
 */
const getApiTimeoutMs = () => {
  const raw = process.env.NEXT_PUBLIC_API_TIMEOUT_MS;
  const n = raw ? parseInt(raw, 10) : NaN;
  if (!Number.isNaN(n) && n >= 5000) return n;
  // Vercel often does not set CI; `next build` still must not wait on cold/slow APIs (worker ~60s cap).
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
  if (process.env.CI === 'true' || isBuildPhase) return 12000;
  return 120000;
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: getApiTimeoutMs(),
});

// Log API URL in development (for debugging)
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  console.log('API Base URL:', getApiBaseUrl());
}

// Add response interceptor to handle errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error for debugging (server-side only)
    if (typeof window === 'undefined') {
      console.error('API Error:', {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        status: error.response?.status,
        message: error.message,
      });
    }

    const body = error.response?.data;
    let serverMessage: string | undefined;
    if (typeof body?.message === 'string') {
      serverMessage = body.message;
    } else if (Array.isArray(body?.message)) {
      serverMessage = body.message.filter(Boolean).join('; ');
    }

    // Always return a resolved promise with error data
    // This prevents unhandled promise rejections
    return Promise.resolve({
      data: null,
      error: serverMessage || error.message || 'Network error',
      status: error.response?.status || 500,
    });
  }
);

export default api;

// Helper function to safely extract data from API response
function safeGetData(response: any) {
  if (response && response.data && !response.error) {
    return response.data;
  }
  return null;
}

// Public API functions with error handling
// Returns: { data, error, status }
// - data: null if error or not found
// - error: error message if API error occurred
// - status: HTTP status code
export const getCompanyInfo = async () => {
  const fallbackData = {
    aboutUs: 'Даацын Цамхаг Групп нь 2009 оноос хойш барилгын салбарт тасралтгүй үйл ажиллагаа явуулж байгаа бөгөөд салбартаа тэргүүлэгч компаниудын нэг болон хөгжсөөр байна. Бидний гол зорилго бол хэрэглэгчиддээ чанартай, найдвартай, аюулгүй байдлыг хангасан барилга угсралт болон тоног төхөөрөмжийн үйлчилгээг хүргэхэд оршино.\n\nБид барилгын өргөх машин механизм болох цамхагт кран, гүүрэн кран, өргүүрийн угсралт, түрээс, засвар үйлчилгээг цогцоор нь үзүүлдэг.',
    vision: 'Бид Монгол улсынхаа бүтээн байгуулалтад үнэтэй хувь нэмэр оруулагч, салбартаа манлайлагч, хэрэглэгчдийн итгэлт түнш байхыг зорино.',
    mission: 'Аюулгүй ажиллагааг эрхэмлэн, чанарыг тэргүүнд тавьж, орчин үеийн дэвшилтэт технологийн дагуу найдвартай үйлчилгээг харилцагчдадаа хүргэнэ.',
    values: '• Аюулгүй байдал - Хүний амь нас, эрүүл мэндийг эрхэмлэнэ.\n• Чанар - Стандартад нийцсэн чанартай бүтээгдэхүүн, үйлчилгээ.\n• Найдвартай байдал - Цаг хугацаандаа найдвартай гүйцэтгэл.\n• Хамтын ажиллагаа - Итгэлцэлд суурилсан түншлэл.',
    history: 'Бид 2009 онд барилга өргөх механизмийн салбарт үйл ажиллагаагаа эхлүүлсэн цагаас хойш олон зуун төслүүдэд амжилттай оролцож ирсэн. Бид өнөөдрийг хүртэл Улаанбаатар хотын болон орон нутгийн томоохон бүтээн байгуулалтуудад өөрсдийн хувь нэмрээ оруулсаар байна.'
  };

  try {
    const response: any = await api.get('/company-info/public');

    // Check if response has error (from interceptor)
    if (response.error) {
      return {
        data: fallbackData,
        error: response.error,
        status: response.status || 500
      };
    }

    const data = safeGetData(response) || fallbackData;
    return { data };
  } catch (error: any) {
    return {
      data: fallbackData,
      error: error.message || 'Network error',
      status: 500
    };
  }
};

export const getServices = async () => {
  const fallbackServices = [
    { id: 1, slug: 'crane-rental', title: 'Цамхагт кран түрээс', description: 'Олон улсын стандартад нийцсэн өндөр даацын цамхагт крануудын урт болон богино хугацааны түрээсийн үйлчилгээ.', image: '' },
    { id: 2, slug: 'crane-installation', title: 'Угсралт, буулгалт', description: 'Мэргэжлийн инженер техникийн ажилтнууд аюулгүй байдлын стандартын дагуу краны угсралт, буулгалтыг хийж гүйцэтгэнэ.', image: '' },
    { id: 3, slug: 'construction', title: 'Барилга угсралт', description: 'Орон сууц, олон нийт, үйлдвэрлэлийн зориулалттай барилга байгууламжийн угсралтын ажил.', image: '' }
  ];
  try {
    const response = await api.get('/services/public');
    const data = safeGetData(response);
    return { data: data && data.length > 0 ? data : fallbackServices };
  } catch (error: any) {
    return { data: fallbackServices };
  }
};

export const getServiceBySlug = async (slug: string) => {
  try {
    const response: any = await api.get(`/services/public/${slug}`);

    if (response.error) {
      return {
        data: null,
        error: response.error,
        status: response.status || 500
      };
    }

    const data = safeGetData(response);

    if (response.status === 404) {
      return { data: null };
    }

    return { data };
  } catch (error: any) {
    return {
      data: null,
      error: error.message || 'Network error',
      status: 500
    };
  }
};

export const getProjects = async (featured?: boolean) => {
  const fallbackProjects = [
    {
      id: 1,
      slug: 'hos-tsamhag',
      title: 'Хос Цамхаг төсөл',
      description: 'Орчин үеийн шийдэл бүхий дээд зэрэглэлийн барилга угсралтын төсөл.',
      image: '',
      featured: true,
      portfolioMeta: {
        category: 'residential',
        progress: 'completed',
        location: 'Орхон аймаг',
        area: '12 400 м²',
        floors: '16 давхар',
        year: '2024',
      },
    },
    {
      id: 2,
      slug: 'b7-apartment',
      title: 'B7 Апартмент',
      description:
        'Шинэ Амгалан цогцолборын үргэлжлэл — тав тухтай орчинг бүрдүүлсэн, бүрэн цутгамал орон сууц. Барилга угсралтын ажил хэвийн үргэлжилж байна.',
      image: '',
      featured: false,
      portfolioMeta: {
        category: 'residential',
        progress: 'in_progress',
        location: 'Улаанбаатар, Баянзүрх',
        area: '28 500 м²',
        floors: '16 давхар',
        year: '2025',
      },
    },
    {
      id: 3,
      slug: 'airport',
      title: 'Хөшигтийн хөндийн нисэх буудал',
      description: 'Улсын хэмжээний томоохон байгууламжийн кран угсралт, нийлүүлэлтийн ажил.',
      image: '',
      featured: true,
      portfolioMeta: {
        category: 'infrastructure',
        progress: 'completed',
        location: 'Төв аймаг, Сэргэлэн сум',
        area: '—',
        floors: '—',
        year: '2017',
      },
    },
  ];
  try {
    const response: any = await api.get('/projects/public', {
      params: featured === true ? { featured: true } : {},
    });

    // Interceptor turns HTTP failures into { error, data: null } — do not treat as "empty DB".
    if (response.error) {
      return { data: fallbackProjects };
    }

    let data: unknown[] = Array.isArray(response.data) ? response.data : [];

    /**
     * Home calls getProjects(true). If nothing is marked featured, the API returns [] and we
     * used to substitute demo projects (empty image → stock placeholders like B-7). Load all
     * published projects instead so uploaded cover images show.
     */
    if (data.length === 0 && featured === true) {
      const resAll: any = await api.get('/projects/public');
      if (!resAll.error && Array.isArray(resAll.data) && resAll.data.length > 0) {
        data = [...resAll.data].sort((a: any, b: any) => {
          if (a.featured === b.featured) return (a.order ?? 0) - (b.order ?? 0);
          return a.featured ? -1 : 1;
        });
      }
    }

    if (data.length > 0) {
      return { data };
    }
    return { data: [] };
  } catch (error: any) {
    return { data: fallbackProjects };
  }
};

export const getProjectBySlug = async (slug: string) => {
  try {
    const response: any = await api.get(`/projects/public/${slug}`);

    if (response.error) {
      return {
        data: null,
        error: response.error,
        status: response.status || 500
      };
    }

    const data = safeGetData(response);

    if (response.status === 404) {
      return { data: null };
    }

    return { data };
  } catch (error: any) {
    return {
      data: null,
      error: error.message || 'Network error',
      status: 500
    };
  }
};

export const getNews = async (
  featured?: boolean,
  limit?: number,
  options?: { useFallback?: boolean }
) => {
  const useFallback = options?.useFallback !== false;
  const fallbackNews = [
    { id: 1, slug: 'new-crane-2026', title: 'Шинэ загварын цамхагт кран оруулж ирлээ', excerpt: 'Бид үйл ажиллагаагаа өргөжүүлэн, шинэ үеийн аюулгүй байдлын систем бүхий крануудыг нэвтрүүллээ.', image: '', publishedAt: new Date().toISOString() },
    { id: 2, slug: 'award-2025', title: 'Шилдэг барилгын туслан гүйцэтгэгчээр шалгарлаа', excerpt: 'Даацын Цамхаг Групп ХХК нь 2025 оны салбарын шилдэг байгууллагаар шалгарлаа.', image: '', publishedAt: new Date().toISOString() }
  ];
  try {
    const response = await api.get('/news/public', { params: { featured, limit } });
    const data = safeGetData(response);
    if (data && data.length > 0) return { data };
    return { data: useFallback ? fallbackNews : [] };
  } catch (error: any) {
    return { data: useFallback ? fallbackNews : [] };
  }
};

export const getNewsBySlug = async (slug: string) => {
  try {
    const response: any = await api.get(`/news/public/${slug}`);

    // Check if response has error (from interceptor)
    if (response.error) {
      return {
        data: null,
        error: response.error,
        status: response.status || 500
      };
    }

    const data = safeGetData(response);

    // 404 means resource not found (not an API error)
    if (response.status === 404) {
      return { data: null }; // No error field = resource not found
    }

    return { data };
  } catch (error: any) {
    return {
      data: null,
      error: error.message || 'Network error',
      status: 500
    };
  }
};

export const getTeamMembers = async () => {
  const normalize = (input: unknown) => {
    if (!Array.isArray(input)) return [];
    const byId = new Map<string, any>();
    const byNamePos = new Map<string, any>();
    const toTime = (v: unknown) => {
      if (typeof v !== 'string') return 0;
      const t = Date.parse(v);
      return Number.isFinite(t) ? t : 0;
    };
    const score = (m: any) => {
      const updated = toTime(m?.updatedAt);
      const created = toTime(m?.createdAt);
      const hasImage = typeof m?.image === 'string' && m.image.trim() ? 1 : 0;
      // Prefer latest updates first; image as weak tie-breaker.
      return updated * 10 + created + hasImage;
    };

    for (const member of input) {
      if (!member || typeof member !== 'object') continue;
      const id = typeof (member as any).id === 'string' ? (member as any).id.trim() : '';
      const name = typeof (member as any).name === 'string' ? (member as any).name.trim() : '';
      if (!name) continue;
      const position =
        typeof (member as any).position === 'string' ? (member as any).position.trim() : '';
      const status = typeof (member as any).status === 'string' ? (member as any).status : '';
      if (status && status !== 'PUBLISHED') continue;

      const namePosKey = `${name.toLowerCase()}|${position.toLowerCase()}`;
      if (id) {
        const prevById = byId.get(id);
        if (!prevById || score(member) >= score(prevById)) {
          byId.set(id, member);
        }
      }
    }

    const withId = Array.from(byId.values());
    for (const member of withId) {
      const name = typeof member?.name === 'string' ? member.name.trim() : '';
      const position = typeof member?.position === 'string' ? member.position.trim() : '';
      const key = `${name.toLowerCase()}|${position.toLowerCase()}`;
      const prev = byNamePos.get(key);
      if (!prev || score(member) >= score(prev)) {
        byNamePos.set(key, member);
      }
    }
    const out = Array.from(byNamePos.values());
    out.sort((a, b) => {
      const ao = typeof a?.order === 'number' ? a.order : 0;
      const bo = typeof b?.order === 'number' ? b.order : 0;
      if (ao !== bo) return ao - bo;
      const au = toTime(a?.updatedAt);
      const bu = toTime(b?.updatedAt);
      if (au !== bu) return bu - au;
      const an = typeof a?.name === 'string' ? a.name : '';
      const bn = typeof b?.name === 'string' ? b.name : '';
      return an.localeCompare(bn);
    });
    return out;
  };

  const onFailure = () => ({ data: [] as any[] });

  /** Avoid axios interceptor + Next stale surprises; always hit network fresh for RSC About page. */
  try {
    const base = getApiBaseUrl();
    const res = await fetch(`${base}/team-members/public`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return onFailure();
    const data = (await res.json()) as unknown;
    return { data: normalize(data) };
  } catch {
    return onFailure();
  }
};

export const getPartners = async () => {
  try {
    const response = await api.get('/partners/public');
    return { data: safeGetData(response) || [] };
  } catch (error: any) {
    return { data: [] };
  }
};

export const getCareers = async () => {
  const fallbackCareers = [
    {
      id: 'fallback-1',
      title: 'Борлуулалтын менежер',
      description: 'Борлуулалтын менежер ажилд авна.',
      details: 'Борлуулалтын менежер ажилд авна. Дэлгэрэнгүй мэдээлэл авахыг хүсвэл холбоо барих.',
    },
    {
      id: 'fallback-2',
      title: 'ХАНГАМЖ МЕНЕЖЕР',
      description:
        'Хангамж, түгээлтийн албаны адилтгах бусад менежер нь бараа таваарын хангамж, тээвэрлэлт, хадгалалт болон түгээлттэй холбоотой ажлыг төлөвлөх, удирдах, зохицуулах асуудлыг эрхэлнэ.',
      details: '',
    },
  ];
  try {
    const response = await api.get('/careers/public');
    const data = safeGetData(response);
    return { data: data && data.length > 0 ? data : fallbackCareers };
  } catch {
    return { data: fallbackCareers };
  }
};

export const createContactMessage = async (data: any) => {
  const response: any = await api.post('/contact', data);
  const out = safeGetData(response);
  if (out == null) {
    return { data: null, error: (typeof response?.error === 'string' && response.error) || 'Network error' };
  }
  return { data: out };
};

export const getPublicPageBySlug = async (slug: string, lang?: string) => {
  try {
    const response = await api.get(`/pages/${slug}/public`, { params: { lang } });
    return { data: safeGetData(response) };
  } catch (error: any) {
    return { data: null, error: error.message || 'Network error' };
  }
};
