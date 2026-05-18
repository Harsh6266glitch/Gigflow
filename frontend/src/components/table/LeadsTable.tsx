import { useState } from 'react';
import { Eye, Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import { clsx } from 'clsx';
import type { Lead } from '../../types';
import { StatusBadge, SourceBadge } from '../common/Badge';
import Button from '../common/Button';
import { useAuthStore } from '../../store/authStore';

interface LeadsTableProps {
  leads: Lead[];
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

const thClass =
  'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400';

export default function LeadsTable({ leads, onView, onEdit, onDelete }: LeadsTableProps) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'Admin';
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });

  const getCreatorName = (lead: Lead) => {
    if (typeof lead.createdBy === 'object' && 'name' in lead.createdBy) {
      return lead.createdBy.name;
    }
    return 'Unknown';
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse min-w-[700px]">
        <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-700">
          <tr>
            <th className={thClass}>
              <div className="flex items-center gap-1">Name <ArrowUpDown size={12} /></div>
            </th>
            <th className={thClass}>Email</th>
            <th className={thClass}>Status</th>
            <th className={thClass}>Source</th>
            <th className={thClass}>Created By</th>
            <th className={thClass}>Date</th>
            <th className={clsx(thClass, 'text-right')}>Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {leads.map((lead) => (
            <tr
              key={lead._id}
              className={clsx(
                'transition-colors duration-150 cursor-pointer',
                hoveredRow === lead._id
                  ? 'bg-primary-50/60 dark:bg-primary-950/20'
                  : 'bg-white dark:bg-slate-900 hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
              )}
              onMouseEnter={() => setHoveredRow(lead._id)}
              onMouseLeave={() => setHoveredRow(null)}
              onClick={() => onView(lead)}
            >
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">
                    {lead.name[0]}
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[140px]">
                    {lead.name}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                {lead.email}
              </td>
              <td className="px-4 py-3.5">
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-4 py-3.5">
                <SourceBadge source={lead.source} />
              </td>
              <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400">
                {getCreatorName(lead)}
              </td>
              <td className="px-4 py-3.5 text-sm text-slate-400 whitespace-nowrap">
                {formatDate(lead.createdAt)}
              </td>
              <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Eye size={14} />}
                    onClick={() => onView(lead)}
                    title="View lead"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Pencil size={14} />}
                    onClick={() => onEdit(lead)}
                    title="Edit lead"
                  />
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 size={14} className="text-red-400" />}
                      onClick={() => onDelete(lead)}
                      title="Delete lead"
                      className="hover:bg-red-50 dark:hover:bg-red-900/20"
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
