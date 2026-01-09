import api from './api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

// Company Info
export const getCompanyInfo = () => api.get('/company-info', { headers: getAuthHeaders() });
export const createCompanyInfo = (data: any) => api.post('/company-info', data, { headers: getAuthHeaders() });
export const updateCompanyInfo = (id: string, data: any) => api.patch(`/company-info/${id}`, data, { headers: getAuthHeaders() });
export const deleteCompanyInfo = (id: string) => api.delete(`/company-info/${id}`, { headers: getAuthHeaders() });

// Services
export const getServices = () => api.get('/services', { headers: getAuthHeaders() });
export const getService = (id: string) => api.get(`/services/${id}`, { headers: getAuthHeaders() });
export const createService = (data: any) => api.post('/services', data, { headers: getAuthHeaders() });
export const updateService = (id: string, data: any) => api.patch(`/services/${id}`, data, { headers: getAuthHeaders() });
export const deleteService = (id: string) => api.delete(`/services/${id}`, { headers: getAuthHeaders() });

// Projects
export const getProjects = () => api.get('/projects', { headers: getAuthHeaders() });
export const getProject = (id: string) => api.get(`/projects/${id}`, { headers: getAuthHeaders() });
export const createProject = (data: any) => api.post('/projects', data, { headers: getAuthHeaders() });
export const updateProject = (id: string, data: any) => api.patch(`/projects/${id}`, data, { headers: getAuthHeaders() });
export const deleteProject = (id: string) => api.delete(`/projects/${id}`, { headers: getAuthHeaders() });

// News
export const getNews = () => api.get('/news', { headers: getAuthHeaders() });
export const getNewsItem = (id: string) => api.get(`/news/${id}`, { headers: getAuthHeaders() });
export const createNews = (data: any) => api.post('/news', data, { headers: getAuthHeaders() });
export const updateNews = (id: string, data: any) => api.patch(`/news/${id}`, data, { headers: getAuthHeaders() });
export const deleteNews = (id: string) => api.delete(`/news/${id}`, { headers: getAuthHeaders() });

// Team Members
export const getTeamMembers = () => api.get('/team-members', { headers: getAuthHeaders() });
export const getTeamMember = (id: string) => api.get(`/team-members/${id}`, { headers: getAuthHeaders() });
export const createTeamMember = (data: any) => api.post('/team-members', data, { headers: getAuthHeaders() });
export const updateTeamMember = (id: string, data: any) => api.patch(`/team-members/${id}`, data, { headers: getAuthHeaders() });
export const deleteTeamMember = (id: string) => api.delete(`/team-members/${id}`, { headers: getAuthHeaders() });

// Partners
export const getPartners = () => api.get('/partners', { headers: getAuthHeaders() });
export const getPartner = (id: string) => api.get(`/partners/${id}`, { headers: getAuthHeaders() });
export const createPartner = (data: any) => api.post('/partners', data, { headers: getAuthHeaders() });
export const updatePartner = (id: string, data: any) => api.patch(`/partners/${id}`, data, { headers: getAuthHeaders() });
export const deletePartner = (id: string) => api.delete(`/partners/${id}`, { headers: getAuthHeaders() });

// Contact Messages
export const getContactMessages = () => api.get('/contact', { headers: getAuthHeaders() });
export const getContactMessage = (id: string) => api.get(`/contact/${id}`, { headers: getAuthHeaders() });
export const markContactAsRead = (id: string) => api.patch(`/contact/${id}/read`, {}, { headers: getAuthHeaders() });
export const deleteContactMessage = (id: string) => api.delete(`/contact/${id}`, { headers: getAuthHeaders() });

// Upload
export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const token = localStorage.getItem('token');
  return api.post('/upload', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};
