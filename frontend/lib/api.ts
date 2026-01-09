import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

// Public API functions
export const getCompanyInfo = () => api.get('/company-info/public');
export const getServices = () => api.get('/services/public');
export const getServiceBySlug = (slug: string) => api.get(`/services/public/${slug}`);
export const getProjects = (featured?: boolean) => 
  api.get('/projects/public', { params: { featured } });
export const getProjectBySlug = (slug: string) => api.get(`/projects/public/${slug}`);
export const getNews = (featured?: boolean, limit?: number) => 
  api.get('/news/public', { params: { featured, limit } });
export const getNewsBySlug = (slug: string) => api.get(`/news/public/${slug}`);
export const getTeamMembers = () => api.get('/team-members/public');
export const getPartners = () => api.get('/partners/public');
export const createContactMessage = (data: any) => api.post('/contact', data);
