import { useState, useEffect } from 'react';
import { Search, Plus, RotateCcw, Download, Filter, SortAsc, SortDesc } from 'lucide-react';
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead, useExportCSV } from '../hooks/useLeads';
import { useLeadsStore } from '../store/leadsStore';
import { useAuthStore } from '../store/authStore';
import { useDebounce } from '../hooks/useDebounce';
import LeadsTable from '../components/table/LeadsTable';
import PaginationControls from '../components/table/Pagination';
import Modal from '../components/common/Modal';
import ConfirmModal from '../components/common/ConfirmModal';
import LeadForm from '../components/forms/LeadForm';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { TableSkeleton } from '../components/common/Skeleton';
import { StatusBadge, SourceBadge } from '../components/common/Badge';
import type { Lead, LeadFormData, LeadStatus, LeadSource } from '../types';

export default function LeadsPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'Admin';

  const filters = useLeadsStore((s) => s.filters);
  const { setSearch, setStatus, setSource, setSort, resetFilters } = useLeadsStore();

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 450);

  // Sync debounced search to store
  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  // Modal state
  const [viewLead, setViewLead]         = useState<Lead | null>(null);
  const [editLead, setEditLead]         = useState<Lead | null>(null);
  const [deleteLead, setDeleteLead]     = useState<Lead | null>(null);
  const [showCreate, setShowCreate]     = useState(false);

  const { data, isLoading, isError, isFetching } = useLeads();
  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();
  const deleteMutation = useDeleteLead();
  const exportMutation = useExportCSV();

  const hasFilters =
    !!filters.status || !!filters.source || !!filters.search;

  const handleCreate = async (formData: LeadFormData) => {
    await createMutation.mutateAsync(formData);
    setShowCreate(false);
  };

  const handleUpdate = async (formData: LeadFormData) => {
    if (!editLead) return;
    await updateMutation.mutateAsync({ id: editLead._id, data: formData });
    setEditLead(null);
  };

  const handleDelete = async () => {
    if (!deleteLead) return;
    await deleteMutation.mutateAsync(deleteLead._id);
    setDeleteLead(null);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Leads</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            {data?.pagination.totalRecords ?? 0} total leads
            {isFetching && !isLoading && (
              <span className="ml-2 text-primary-500 text-xs animate-pulse">Refreshing…</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              icon={<Download size={14} />}
              loading={exportMutation.isPending}
              onClick={() => exportMutation.mutate()}
              id="export-csv-btn"
            >
              Export CSV
            </Button>
          )}
          <Button
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => setShowCreate(true)}
            id="create-lead-btn"
          >
            Add Lead
          </Button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="leads-search"
              type="text"
              placeholder="Search by name or email…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              id="status-filter"
              value={filters.status ?? ''}
              onChange={(e) => setStatus((e.target.value as LeadStatus) || undefined)}
              className="pl-8 pr-8 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 appearance-none cursor-pointer transition-all"
            >
              <option value="">All Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          {/* Source filter */}
          <div className="relative">
            <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              id="source-filter"
              value={filters.source ?? ''}
              onChange={(e) => setSource((e.target.value as LeadSource) || undefined)}
              className="pl-8 pr-8 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 appearance-none cursor-pointer transition-all"
            >
              <option value="">All Sources</option>
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
            </select>
          </div>

          {/* Sort */}
          <button
            id="sort-toggle"
            onClick={() => setSort(filters.sort === 'latest' ? 'oldest' : 'latest')}
            className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-primary-400 transition-all"
          >
            {filters.sort === 'latest' ? <SortDesc size={14} /> : <SortAsc size={14} />}
            {filters.sort === 'latest' ? 'Latest' : 'Oldest'}
          </button>

          {/* Reset */}
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              icon={<RotateCcw size={13} />}
              onClick={() => { resetFilters(); setSearchInput(''); }}
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={10} />
        ) : isError ? (
          <div className="p-8 text-center text-red-500">
            Failed to load leads. Please try again.
          </div>
        ) : !data?.leads.length ? (
          <EmptyState
            title="No leads found"
            description={hasFilters ? 'Try adjusting your filters or search query.' : 'Create your first lead to get started.'}
            action={
              !hasFilters ? (
                <Button icon={<Plus size={14} />} onClick={() => setShowCreate(true)}>
                  Add Lead
                </Button>
              ) : (
                <Button variant="outline" icon={<RotateCcw size={13} />} onClick={() => { resetFilters(); setSearchInput(''); }}>
                  Clear Filters
                </Button>
              )
            }
          />
        ) : (
          <>
            <LeadsTable
              leads={data.leads}
              onView={(l) => setViewLead(l)}
              onEdit={(l) => setEditLead(l)}
              onDelete={(l) => setDeleteLead(l)}
            />
            <PaginationControls pagination={data.pagination} />
          </>
        )}
      </div>

      {/* ── Modals ── */}

      {/* View Lead */}
      <Modal isOpen={!!viewLead} onClose={() => setViewLead(null)} title="Lead Details" size="md">
        {viewLead && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white text-xl font-bold uppercase">
                {viewLead.name[0]}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{viewLead.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{viewLead.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                <p className="text-xs text-slate-400 mb-1">Status</p>
                <StatusBadge status={viewLead.status} />
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                <p className="text-xs text-slate-400 mb-1">Source</p>
                <SourceBadge source={viewLead.source} />
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                <p className="text-xs text-slate-400 mb-1">Created</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{formatDate(viewLead.createdAt)}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                <p className="text-xs text-slate-400 mb-1">Updated</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{formatDate(viewLead.updatedAt)}</p>
              </div>
            </div>
            {viewLead.notes && (
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">Notes</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{viewLead.notes}</p>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setViewLead(null)} className="flex-1">Close</Button>
              <Button onClick={() => { setEditLead(viewLead); setViewLead(null); }} className="flex-1">Edit Lead</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Lead */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Lead">
        <LeadForm
          mode="create"
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>

      {/* Edit Lead */}
      <Modal isOpen={!!editLead} onClose={() => setEditLead(null)} title="Edit Lead">
        <LeadForm
          mode="edit"
          defaultValues={editLead ?? undefined}
          onSubmit={handleUpdate}
          onCancel={() => setEditLead(null)}
          isLoading={updateMutation.isPending}
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={!!deleteLead}
        onClose={() => setDeleteLead(null)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete "${deleteLead?.name}"? This action cannot be undone.`}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
