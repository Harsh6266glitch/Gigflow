import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '../api/leads';
import { useLeadsStore } from '../store/leadsStore';
import type { LeadFormData } from '../types';
import toast from 'react-hot-toast';

export const LEADS_QUERY_KEY = 'leads';
export const STATS_QUERY_KEY = 'stats';

export function useLeads() {
  const filters = useLeadsStore((s) => s.filters);
  return useQuery({
    queryKey: [LEADS_QUERY_KEY, filters],
    queryFn: () => leadsApi.getLeads(filters).then((r) => r.data.data),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: [LEADS_QUERY_KEY, id],
    queryFn: () => leadsApi.getLead(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useStats() {
  return useQuery({
    queryKey: [STATS_QUERY_KEY],
    queryFn: () => leadsApi.getStats().then((r) => r.data.data),
    staleTime: 60_000,
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: LeadFormData) => leadsApi.createLead(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      qc.invalidateQueries({ queryKey: [STATS_QUERY_KEY] });
      toast.success('Lead created successfully!');
    },
    onError: () => toast.error('Failed to create lead'),
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LeadFormData> }) =>
      leadsApi.updateLead(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      qc.invalidateQueries({ queryKey: [STATS_QUERY_KEY] });
      toast.success('Lead updated successfully!');
    },
    onError: () => toast.error('Failed to update lead'),
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadsApi.deleteLead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      qc.invalidateQueries({ queryKey: [STATS_QUERY_KEY] });
      toast.success('Lead deleted successfully!');
    },
    onError: () => toast.error('Failed to delete lead'),
  });
}

export function useExportCSV() {
  const filters = useLeadsStore((s) => s.filters);
  return useMutation({
    mutationFn: () => leadsApi.exportCSV(filters),
    onSuccess: (response) => {
      const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `gigflow-leads-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('CSV exported successfully!');
    },
    onError: () => toast.error('Failed to export CSV'),
  });
}
