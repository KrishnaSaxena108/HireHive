import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react/index.js';
import { Link } from 'react-router-dom';
import { Briefcase, DollarSign, Filter, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const SEARCH_JOBS = gql`
  query SearchJobs($keyword: String, $category: String, $minBudget: Float, $maxBudget: Float, $status: String) {
    searchJobs(keyword: $keyword, category: $category, minBudget: $minBudget, maxBudget: $maxBudget, status: $status) {
      id
      title
      description
      budget
      category
      status
    }
  }
`;

const CATEGORIES = [
  { value: 'WEB_DEV', label: '💻 Web Development' },
  { value: 'MOBILE_DEV', label: '📱 Mobile Development' },
  { value: 'DESIGN', label: '🎨 Design' },
  { value: 'WRITING', label: '✍️ Writing' },
  { value: 'MARKETING', label: '📢 Marketing' },
  { value: 'OTHER', label: '🔧 Other' },
];

const STATUS_OPTIONS = [
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
];

const AdvancedSearch = () => {
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minBudget, setMinBudget] = useState(searchParams.get('minBudget') || '');
  const [maxBudget, setMaxBudget] = useState(searchParams.get('maxBudget') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('latest'); // latest, budget-high, budget-low
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const { loading, error, data } = useQuery(SEARCH_JOBS, {
    variables: {
      keyword: keyword || null,
      category: category || null,
      minBudget: minBudget ? parseFloat(minBudget) : null,
      maxBudget: maxBudget ? parseFloat(maxBudget) : null,
      status: status || null,
    },
    skip: false,
  });

  const jobs = data?.searchJobs || [];
  const activeFilters = [keyword, category, minBudget, maxBudget, status].filter(Boolean).length;

  // Sort jobs
  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortBy === 'budget-high') return b.budget - a.budget;
    if (sortBy === 'budget-low') return a.budget - b.budget;
    // latest (default)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Paginate jobs
  const totalPages = Math.ceil(sortedJobs.length / itemsPerPage);
  const paginatedJobs = sortedJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearFilters = () => {
    setKeyword('');
    setCategory('');
    setMinBudget('');
    setMaxBudget('');
    setStatus('');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search jobs by title or description..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all"
          >
            <Filter size={20} /> Filters
            {activeFilters > 0 && (
              <span className="ml-2 px-2 py-1 bg-yellow-500 text-xs rounded-full font-bold">{activeFilters}</span>
            )}
          </button>
          {activeFilters > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-3 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-all"
            >
              <X size={18} /> Clear
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Min Budget */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Min Budget ($)</label>
              <input
                type="number"
                placeholder="500"
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Max Budget */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Max Budget ($)</label>
              <input
                type="number"
                placeholder="10000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">All Status</option>
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count & Sort */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-slate-600 font-semibold">
          Found <span className="text-indigo-600">{sortedJobs.length}</span> job{sortedJobs.length !== 1 ? 's' : ''}
        </div>
        <div className="flex gap-4 items-center">
          <label className="text-sm font-semibold text-slate-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          >
            <option value="latest">Latest</option>
            <option value="budget-high">Budget: High to Low</option>
            <option value="budget-low">Budget: Low to High</option>
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-red-500 p-10 text-center bg-red-50 rounded-xl">Error: {error.message}</p>}

      {/* No Results */}
      {!loading && !error && sortedJobs.length === 0 && (
        <p className="text-center text-slate-500 py-10 text-lg">No jobs match your search criteria. Try adjusting your filters.</p>
      )}

      {/* Jobs Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedJobs.map((job) => (
          <div key={job.id} className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Briefcase size={24} />
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full block mb-1">
                    {job.status}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                    {job.category}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">{job.title}</h3>
              <p className="text-slate-500 text-sm line-clamp-3 mb-4">{job.description}</p>

              {/* Budget */}
              <div className="flex items-center gap-2 text-slate-700 font-bold mb-6">
                <DollarSign size={18} className="text-green-600" />
                <span className="text-lg">${job.budget}</span>
                <span className="text-xs text-slate-400 font-normal">(Fixed Price)</span>
              </div>
            </div>

            {/* Action Button */}
            <Link 
              to={`/job/${job.id}`}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200 text-center block"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-200">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={20} /> Previous
          </button>
          
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  page === currentPage
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
