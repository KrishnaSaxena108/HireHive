import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react/index.js';
import { Search, User, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SEARCH_FREELANCERS = gql`
  query SearchFreelancers($query: String, $category: String) {
    searchFreelancers(query: $query, category: $category) {
      id
      username
      email
      role
      averageRating
      profile {
        bio
        skills
        hourlyRate
      }
    }
  }
`;

const FreelancerSearch = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const { loading, error, data } = useQuery(SEARCH_FREELANCERS, {
    variables: {
      query: query || null,
      category: category || null
    }
  });

  const allFreelancers = data?.searchFreelancers || [];

  // Filter by rating and rate
  const filtered = allFreelancers.filter((f) => {
    const rating = f.averageRating || 0;
    const rate = f.profile?.hourlyRate || 0;
    
    if (minRating && rating < parseFloat(minRating)) return false;
    if (maxRate && rate > parseFloat(maxRate)) return false;
    return true;
  });

  // Paginate
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedFreelancers = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-black text-slate-900 mb-8">Find Freelancers</h1>

      {/* Search Filters */}
      <div className="bg-white p-6 rounded-3xl shadow-xl mb-8">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by skills, bio..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">All Categories</option>
            <option value="WEB_DEV">Web Development</option>
            <option value="MOBILE_DEV">Mobile Development</option>
            <option value="DESIGN">Design</option>
            <option value="WRITING">Writing</option>
            <option value="MARKETING">Marketing</option>
            <option value="OTHER">Other</option>
          </select>
          <div>
            <input
              type="number"
              placeholder="Min Rating (0-5)"
              min="0"
              max="5"
              step="0.5"
              value={minRating}
              onChange={(e) => {
                setMinRating(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Max Rate ($/hr)"
              min="0"
              value={maxRate}
              onChange={(e) => {
                setMaxRate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-slate-600 font-semibold">
        Found <span className="text-indigo-600">{filtered.length}</span> freelancer{filtered.length !== 1 ? 's' : ''}
      </div>

      {/* Loading */}
      {loading && <div className="text-center py-10">Loading freelancers...</div>}
      {error && <div className="text-center py-10 text-red-500">Error: {error.message}</div>}

      {/* No Results */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-10">
          <p className="text-slate-500">No freelancers found matching your criteria.</p>
        </div>
      )}

      {/* Freelancers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedFreelancers.map((freelancer) => (
          <div key={freelancer.id} className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <User size={32} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{freelancer.username}</h3>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500 fill-current" />
                  <span className="text-slate-600 text-sm">{freelancer.averageRating?.toFixed(1) || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-slate-700 mb-2 text-sm">{freelancer.profile?.bio || 'No bio available'}</p>
              <p className="text-xs text-slate-500 mb-2">
                <strong>Skills:</strong> {freelancer.profile?.skills || 'Not specified'}
              </p>
              {freelancer.profile?.hourlyRate && (
                <p className="text-sm text-green-600 font-bold">
                  ${freelancer.profile.hourlyRate}/hour
                </p>
              )}
            </div>

            <Link
              to={`/messages?user=${freelancer.id}`}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition text-center block text-sm"
            >
              Contact Freelancer
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

export default FreelancerSearch;