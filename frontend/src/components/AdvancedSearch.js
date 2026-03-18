import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react/index.js';
import { useSearchParams } from 'react-router-dom';
import { Briefcase, Filter, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Input, Card, JobCard } from './ui';

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Find Work</h1>
          <p className="text-lg text-gray-600">Browse and apply to hundreds of opportunities</p>
        </div>

        {/* Search and Filters Section */}
        <Card className="mb-8 shadow-lg" padding="lg">
          {/* Search Bar */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search jobs by title or description..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                icon={Search}
              />
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter size={18} />
              Filters
              {activeFilters > 0 && (
                <span className="ml-2 px-2 py-1 bg-amber-400 text-xs rounded-full font-bold">
                  {activeFilters}
                </span>
              )}
            </Button>
            {activeFilters > 0 && (
              <Button
                variant="outline"
                size="md"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X size={18} />
                Clear
              </Button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="pt-6 border-t border-gray-200 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Min Budget */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Min Budget ($)</label>
                <input
                  type="number"
                  placeholder="500"
                  value={minBudget}
                  onChange={(e) => setMinBudget(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              {/* Max Budget */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Max Budget ($)</label>
                <input
                  type="number"
                  placeholder="10000"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                >
                  <option value="">All Status</option>
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </Card>

        {/* Results Count & Sort */}
        <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="text-gray-700 font-semibold text-lg">
            Found <span className="text-blue-600 font-bold">{sortedJobs.length}</span> job{sortedJobs.length !== 1 ? 's' : ''}
          </div>
          <div className="flex gap-4 items-center">
            <label className="text-sm font-semibold text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="p-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
            >
              <option value="latest">Latest</option>
              <option value="budget-high">Budget: High to Low</option>
              <option value="budget-low">Budget: Low to High</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="bg-red-50 border-red-200 text-center py-12">
            <p className="text-red-700 font-semibold text-lg">Error loading jobs: {error.message}</p>
          </Card>
        )}

        {/* No Results State */}
        {!loading && !error && sortedJobs.length === 0 && (
          <Card className="text-center py-16 border-dashed border-2 border-gray-300">
            <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </Card>
        )}

        {/* Jobs Grid */}
        {!loading && !error && sortedJobs.length > 0 && (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {paginatedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onViewDetails={(job) => {
                    // Navigate or open details modal
                    window.location.href = `/job/${job.id}`;
                  }}
                  onApply={(job) => {
                    // Navigate to job details for apply
                    window.location.href = `/job/${job.id}`;
                  }}
                  actionLabel="View & Apply"
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-200">
                <Button
                  variant={currentPage === 1 ? 'outline' : 'primary'}
                  size="md"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft size={18} />
                  Previous
                </Button>

                <div className="flex gap-2 flex-wrap justify-center">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        page === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <Button
                  variant={currentPage === totalPages ? 'outline' : 'primary'}
                  size="md"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight size={18} />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearch;
