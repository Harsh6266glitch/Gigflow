import { create } from 'zustand';
import type { LeadFilters, SortOrder } from '../types';

interface LeadsState {
  filters: LeadFilters;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setStatus: (status: LeadFilters['status']) => void;
  setSource: (source: LeadFilters['source']) => void;
  setSort: (sort: SortOrder) => void;
  resetFilters: () => void;
}

const defaultFilters: LeadFilters = {
  page: 1,
  limit: 10,
  sort: 'latest',
};

export const useLeadsStore = create<LeadsState>((set) => ({
  filters: { ...defaultFilters },

  setPage: (page) => set((s) => ({ filters: { ...s.filters, page } })),

  setSearch: (search) =>
    set((s) => ({ filters: { ...s.filters, search: search || undefined, page: 1 } })),

  setStatus: (status) =>
    set((s) => ({ filters: { ...s.filters, status, page: 1 } })),

  setSource: (source) =>
    set((s) => ({ filters: { ...s.filters, source, page: 1 } })),

  setSort: (sort) =>
    set((s) => ({ filters: { ...s.filters, sort, page: 1 } })),

  resetFilters: () => set({ filters: { ...defaultFilters } }),
}));
