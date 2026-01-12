import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add response interceptor to handle errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Always return a resolved promise with error data
    // This prevents unhandled promise rejections
    return Promise.resolve({
      data: null,
      error: error.message || 'Network error',
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
export const getCompanyInfo = async () => {
  try {
    const response = await api.get('/company-info/public');
    return { data: safeGetData(response) };
  } catch (error: any) {
    return { data: null };
  }
};

export const getServices = async () => {
  try {
    const response = await api.get('/services/public');
    return { data: safeGetData(response) || [] };
  } catch (error: any) {
    return { data: [] };
  }
};

export const getServiceBySlug = async (slug: string) => {
  try {
    const response = await api.get(`/services/public/${slug}`);
    return { data: safeGetData(response) };
  } catch (error: any) {
    return { data: null };
  }
};

export const getProjects = async (featured?: boolean) => {
  try {
    const response = await api.get('/projects/public', { params: { featured } });
    return { data: safeGetData(response) || [] };
  } catch (error: any) {
    return { data: [] };
  }
};

export const getProjectBySlug = async (slug: string) => {
  try {
    const response = await api.get(`/projects/public/${slug}`);
    return { data: safeGetData(response) };
  } catch (error: any) {
    return { data: null };
  }
};

export const getNews = async (featured?: boolean, limit?: number) => {
  try {
    const response = await api.get('/news/public', { params: { featured, limit } });
    return { data: safeGetData(response) || [] };
  } catch (error: any) {
    return { data: [] };
  }
};

export const getNewsBySlug = async (slug: string) => {
  try {
    const response = await api.get(`/news/public/${slug}`);
    return { data: safeGetData(response) };
  } catch (error: any) {
    return { data: null };
  }
};

export const getTeamMembers = async () => {
  try {
    const response = await api.get('/team-members/public');
    return { data: safeGetData(response) || [] };
  } catch (error: any) {
    return { data: [] };
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

export const createContactMessage = async (data: any) => {
  try {
    const response = await api.post('/contact', data);
    return { data: safeGetData(response) };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};
