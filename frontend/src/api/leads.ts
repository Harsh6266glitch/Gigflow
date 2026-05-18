import apiClient from './client';
import type {
  ApiResponse, Lead, LeadsResponse, DashboardStats, LeadFilters, LeadFormData,
} from '../types';

export const leadsApi = {
  getLeads: (filters: Partial<LeadFilters>) => {
    const params = new URLSearchParams();
    if (filters.page)   params.set('page',   String(filters.page));
    if (filters.limit)  params.set('limit',  String(filters.limit));
    if (filters.status) params.set('status', filters.status);
    if (filters.source) params.set('source', filters.source);
    if (filters.search) params.set('search', filters.search);
    if (filters.sort)   params.set('sort',   filters.sort);
    return apiClient.get<ApiResponse<LeadsResponse>>(`/leads?${params.toString()}`);
  },

  getLead: (id: string) =>
    apiClient.get<ApiResponse<Lead>>(`/leads/${id}`),

  createLead: (data: LeadFormData) =>
    apiClient.post<ApiResponse<Lead>>('/leads', data),

  updateLead: (id: string, data: Partial<LeadFormData>) =>
    apiClient.put<ApiResponse<Lead>>(`/leads/${id}`, data),

  deleteLead: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/leads/${id}`),

  getStats: () =>
    apiClient.get<ApiResponse<DashboardStats>>('/leads/stats'),

  exportCSV: (filters: Partial<LeadFilters>) => {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.source) params.set('source', filters.source);
    if (filters.search) params.set('search', filters.search);
    return apiClient.get(`/leads/export/csv?${params.toString()}`, {
      responseType: 'blob',
    });
  },
};
