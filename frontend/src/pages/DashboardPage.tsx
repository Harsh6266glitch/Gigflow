import { Users, TrendingUp, Star, XCircle } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import { StatsSkeleton } from '../components/common/Skeleton';
import { useStats } from '../hooks/useLeads';
import { useAuthStore } from '../store/authStore';

const statusColors: Record<string, string> = {
  New:       'bg-blue-500',
  Contacted: 'bg-amber-500',
  Qualified: 'bg-emerald-500',
  Lost:      'bg-red-500',
};

const sourceColors: Record<string, string> = {
  Website:   'bg-violet-500',
  Instagram: 'bg-pink-500',
  Referral:  'bg-cyan-500',
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: stats, isLoading, isError } = useStats();

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-sm">
          Here's what's happening with your leads today.
        </p>
      </div>

      {/* KPI Cards */}
      {isLoading ? (
        <StatsSkeleton />
      ) : isError ? (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          Failed to load statistics. Please refresh the page.
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Leads"
            value={stats.total}
            icon={<Users size={22} className="text-primary-600" />}
            iconBg="bg-primary-50 dark:bg-primary-950/30"
            subtitle="All time"
          />
          <StatsCard
            title="Qualified"
            value={stats.byStatus.Qualified ?? 0}
            icon={<Star size={22} className="text-emerald-600" />}
            iconBg="bg-emerald-50 dark:bg-emerald-950/30"
            subtitle="Ready to close"
            trend={12}
          />
          <StatsCard
            title="Contacted"
            value={stats.byStatus.Contacted ?? 0}
            icon={<TrendingUp size={22} className="text-amber-600" />}
            iconBg="bg-amber-50 dark:bg-amber-950/30"
            subtitle="In progress"
          />
          <StatsCard
            title="Lost"
            value={stats.byStatus.Lost ?? 0}
            icon={<XCircle size={22} className="text-red-500" />}
            iconBg="bg-red-50 dark:bg-red-950/30"
            subtitle="Not converted"
            trend={-5}
          />
        </div>
      ) : null}

      {/* Charts row */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Status breakdown */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
              Leads by Status
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.byStatus).map(([status, count]) => {
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{status}</span>
                      <span className="text-slate-500 dark:text-slate-400">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${statusColors[status] ?? 'bg-slate-400'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Source breakdown */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
              Leads by Source
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.bySource).map(([source, count]) => {
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={source}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{source}</span>
                      <span className="text-slate-500 dark:text-slate-400">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${sourceColors[source] ?? 'bg-slate-400'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Quick tips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: '🔍', title: 'Advanced Filtering', desc: 'Use the Leads page to filter by status, source, and search by name or email.' },
          { icon: '📤', title: 'CSV Export', desc: 'Admin users can export filtered leads as CSV from the Leads page.' },
          { icon: '🔐', title: 'Role-Based Access', desc: 'Admins can delete leads. Sales users can create and edit leads.' },
        ].map((tip) => (
          <div key={tip.title} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
            <div className="text-2xl mb-2">{tip.icon}</div>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">{tip.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
