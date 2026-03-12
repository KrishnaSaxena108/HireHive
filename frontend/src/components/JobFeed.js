import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react/index.js';
import { Search, Briefcase, DollarSign, Clock, ChevronRight, Filter, X, AlertCircle } from 'lucide-react';
import ApplyModal from './ApplyModal';

const GET_JOBS = gql`
  query GetJobs {
    jobs {
      id
      title
      description
      budget
      status
      client {
        id
        username
      }
      proposals {
        id
      }
    }
  }
`;

const CATEGORIES = [
  'All', 'Web Development', 'Mobile Development', 'Design', 'Writing',
  'Marketing', 'Data & Analytics', 'DevOps', 'AI / ML', 'Video & Animation',
];

const BUDGETS = [
  { label: 'Any Budget', min: 0, max: Infinity },
  { label: 'Under $500', min: 0, max: 500 },
  { label: '$500 – $2,000', min: 500, max: 2000 },
  { label: '$2,000 – $10,000', min: 2000, max: 10000 },
  { label: '$10,000+', min: 10000, max: Infinity },
];

const SkeletonCard = () => (
  <div className="card animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/5" />
      <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-16" />
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
    </div>
    <div className="flex items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-700">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20" />
    </div>
  </div>
);

const JobCard = ({ job, onApply }) => {
  const isOpen = job.status === 'open';
  const proposalCount = job.proposals?.length ?? 0;

  return (
    <div className="card group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {job.title}
        </h3>
        <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
          isOpen
            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
        }`}>
          {isOpen ? 'Open' : 'Closed'}
        </span>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
        {job.description}
      </p>

      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-indigo-500" />
          <span className="font-medium text-slate-700 dark:text-slate-300">
            ${job.budget.toLocaleString()}
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <Briefcase className="w-4 h-4 text-indigo-500" />
          {job.client?.username ?? 'Unknown client'}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-indigo-500" />
          {proposalCount} proposal{proposalCount !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {['Remote', 'Contract'].map(tag => (
            <span key={tag} className="badge-outline">{tag}</span>
          ))}
        </div>
        {isOpen && (
          <button
            onClick={() => onApply(job)}
            className="btn-primary text-sm py-1.5 px-4 flex items-center gap-1"
          >
            Apply <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

const JobFeed = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBudget, setSelectedBudget] = useState(BUDGETS[0]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_JOBS, { fetchPolicy: 'cache-and-network' });

  const jobs = data?.jobs ?? [];

  const filtered = jobs.filter(job => {
    const matchesSearch =
      !search ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase());

    const matchesBudget =
      job.budget >= selectedBudget.min && job.budget <= selectedBudget.max;

    return matchesSearch && matchesBudget;
  });

  const openJobs = filtered.filter(j => j.status === 'open');
  const closedJobs = filtered.filter(j => j.status !== 'open');

  const handleApply = (job) => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/login';
      return;
    }
    setSelectedJob(job);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedJob(null);
    refetch();
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedBudget(BUDGETS[0]);
  };

  const hasActiveFilters = search || selectedCategory !== 'All' || selectedBudget !== BUDGETS[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Browse Jobs</h1>
        <p className="text-slate-500 dark:text-slate-400">
          {loading ? 'Loading available opportunities…' : `${openJobs.length} open position${openJobs.length !== 1 ? 's' : ''} available`}
        </p>
      </div>

      {/* Search + Filter Bar */}
      <div className="card mb-6">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs by title or keyword…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`btn-secondary flex items-center gap-2 ${showFilters ? 'ring-2 ring-indigo-300 dark:ring-indigo-700' : ''}`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
            )}
          </button>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn-ghost flex items-center gap-1 text-sm text-rose-500 hover:text-rose-600">
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Budget Range
              </label>
              <div className="flex flex-col gap-1.5">
                {BUDGETS.map(b => (
                  <button
                    key={b.label}
                    onClick={() => setSelectedBudget(b)}
                    className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                      selectedBudget === b
                        ? 'bg-indigo-50 text-indigo-700 font-medium dark:bg-indigo-950 dark:text-indigo-300'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="card border border-rose-200 dark:border-rose-800 mb-6">
          <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">Failed to load jobs. Make sure the backend server is running.</p>
          </div>
        </div>
      )}

      {/* Skeleton Loading */}
      {loading && (
        <div className="grid gap-4">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Open Jobs */}
      {!loading && openJobs.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
            Open Positions ({openJobs.length})
          </h2>
          <div className="grid gap-4">
            {openJobs.map(job => (
              <JobCard key={job.id} job={job} onApply={handleApply} />
            ))}
          </div>
        </section>
      )}

      {/* Closed Jobs */}
      {!loading && closedJobs.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
            Closed Positions ({closedJobs.length})
          </h2>
          <div className="grid gap-4 opacity-60">
            {closedJobs.map(job => (
              <JobCard key={job.id} job={job} onApply={handleApply} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No jobs found</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
            {jobs.length === 0
              ? 'No jobs have been posted yet. Check back soon!'
              : 'Try adjusting your search or clearing the filters.'}
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn-secondary mt-4 text-sm">
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Apply Modal */}
      <ApplyModal
        job={selectedJob}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default JobFeed;
