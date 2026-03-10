import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react/index.js';
import { Search, User, Star } from 'lucide-react';
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

  const { loading, error, data } = useQuery(SEARCH_FREELANCERS, {
    variables: {
      query: query || null,
      category: category || null
    }
  });

  const freelancers = data?.searchFreelancers || [];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-black text-slate-900 mb-8">Find Freelancers</h1>

      {/* Search Filters */}
      <div className="bg-white p-6 rounded-3xl shadow-xl mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by skills, bio..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
        </div>
      </div>

      {/* Results */}
      {loading && <div className="text-center py-10">Loading freelancers...</div>}
      {error && <div className="text-center py-10 text-red-500">Error: {error.message}</div>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {freelancers.map((freelancer) => (
          <div key={freelancer.id} className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <User size={32} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{freelancer.username}</h3>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500 fill-current" />
                  <span className="text-slate-600">{freelancer.averageRating?.toFixed(1) || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-slate-700 mb-2">{freelancer.profile?.bio || 'No bio available'}</p>
              <p className="text-sm text-slate-500">
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
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition text-center block"
            >
              Contact Freelancer
            </Link>
          </div>
        ))}
      </div>

      {!loading && freelancers.length === 0 && (
        <div className="text-center py-10">
          <p className="text-slate-500">No freelancers found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default FreelancerSearch;