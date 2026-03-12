import React from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react/index.js';
import { DollarSign, Briefcase, FileText, CheckCircle, Clock, TrendingUp, Plus, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const GET_FREELANCER_DASHBOARD = gql`
  query GetFreelancerDashboard {
    myProposals {
      id status bidAmount
      job { id title status budget }
    }
  }
`;

const StatusBadge = ({ status }) => {
  const map = { ACCEPTED: 'badge-green', PENDING: 'badge-orange', REJECTED: 'badge-red', IN_PROGRESS: 'badge-blue' };
  return <span className={`badge ${map[status] || 'badge'}`}>{status}</span>;
};

const SkeletonCard = () => (
  <div className="card p-6 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 bg-slate-200 rounded-2xl" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="h-7 bg-slate-200 rounded w-1/2" />
      </div>
    </div>
  </div>
);

const FreelancerDashboard = () => {
  const username = localStorage.getItem('username') || 'Freelancer';
  const { loading, error, data } = useQuery(GET_FREELANCER_DASHBOARD);

  if (error) return (
    <div className="page-wrapper py-12">
      <div className="max-w-md mx-auto card p-8 text-center">
        <p className="text-red-500 font-semibold">{error.message}</p>
      </div>
    </div>
  );

  const proposals = data?.myProposals || [];
  const activeProjects = proposals.filter(p => p.status === 'ACCEPTED');
  const pendingBids = proposals.filter(p => p.status === 'PENDING');
  const totalEarnings = activeProjects.reduce((acc, p) => acc + (p.bidAmount || 0), 0);
  const winRate = proposals.length > 0 ? Math.round((activeProjects.length / proposals.length) * 100) : 0;

  const stats = [
    { label: 'Total Earnings', value: `$${totalEarnings.toLocaleString()}`, icon: DollarSign, color: 'bg-emerald-500', light: 'bg-emerald-50 text-emerald-600' },
    { label: 'Active Projects', value: activeProjects.length, icon: Briefcase, color: 'bg-indigo-500', light: 'bg-indigo-50 text-indigo-600' },
    { label: 'Pending Bids', value: pendingBids.length, icon: FileText, color: 'bg-amber-500', light: 'bg-amber-50 text-amber-600' },
    { label: 'Win Rate', value: `${winRate}%`, icon: TrendingUp, color: 'bg-purple-500', light: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="page-wrapper py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <p className="text-sm font-medium text-indigo-600 mb-1">Welcome back</p>
          <h1 className="text-3xl font-extrabold text-slate-900">@{username}</h1>
          <p className="text-slate-500 mt-1">Here's your workspace overview</p>
        </div>
        <div className="flex gap-3">
          <Link to="/create-profile" className="btn-secondary"><FileText size={16} /> Edit Profile</Link>
          <Link to="/jobs" className="btn-primary"><Plus size={16} /> Find Work</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {loading ? [1,2,3,4].map(i => <SkeletonCard key={i} />) : stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card card-hover p-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${s.light}`}>
                <Icon size={22} />
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{s.label}</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Active Projects */}
        <div className="card p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <CheckCircle className="text-emerald-500" size={20} /> Active Projects
            </h3>
            <span className="badge badge-green">{activeProjects.length}</span>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}</div>
          ) : activeProjects.length > 0 ? (
            <div className="space-y-3">
              {activeProjects.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors group">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{p.job.title}</p>
                    <p className="text-sm text-slate-500">Bid: <span className="font-semibold text-emerald-600">${Number(p.bidAmount).toLocaleString()}</span></p>
                  </div>
                  <ExternalLink size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors ml-3 shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Briefcase className="text-slate-400" size={22} />
              </div>
              <p className="text-slate-500 text-sm font-medium">No active projects yet</p>
              <Link to="/jobs" className="text-indigo-600 text-sm font-semibold hover:underline mt-1 inline-block">Browse open jobs â†’</Link>
            </div>
          )}
        </div>

        {/* Pending Bids */}
        <div className="card p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Clock className="text-amber-500" size={20} /> Pending Bids
            </h3>
            <span className="badge badge-orange">{pendingBids.length}</span>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />)}</div>
          ) : pendingBids.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {pendingBids.map((p) => (
                <div key={p.id} className="py-4 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate text-sm">{p.job.title}</p>
                    <p className="text-xs text-slate-400">Client budget: ${Number(p.job.budget).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3 shrink-0">
                    <span className="text-sm font-bold text-amber-600">${Number(p.bidAmount).toLocaleString()}</span>
                    <StatusBadge status={p.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <FileText className="text-slate-400" size={22} />
              </div>
              <p className="text-slate-500 text-sm font-medium">No pending bids</p>
              <Link to="/jobs" className="text-indigo-600 text-sm font-semibold hover:underline mt-1 inline-block">Apply to jobs â†’</Link>
            </div>
          )}
        </div>
      </div>

      {/* All proposals table */}
      {!loading && proposals.length > 0 && (
        <div className="card p-8 mt-8">
          <h3 className="text-lg font-extrabold text-slate-900 mb-6">All Proposals</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Job Title', 'Budget', 'Your Bid', 'Status'].map(h => (
                    <th key={h} className="text-left pb-3 pr-6 text-xs font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {proposals.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 pr-6 font-semibold text-slate-900">{p.job.title}</td>
                    <td className="py-4 pr-6 text-slate-500">${Number(p.job.budget).toLocaleString()}</td>
                    <td className="py-4 pr-6 font-semibold text-indigo-600">${Number(p.bidAmount).toLocaleString()}</td>
                    <td className="py-4"><StatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FreelancerDashboard;
