import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react/index.js';
import { Briefcase, DollarSign, Clock, Filter } from 'lucide-react';

const GET_JOBS_BY_CATEGORY = gql`
  query JobsByCategory($category: String!) {
    jobsByCategory(category: $category) {
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
];

const JobFilter = () => {
  const [selectedCategory, setSelectedCategory] = useState('WEB_DEV');
  const { loading, error, data } = useQuery(GET_JOBS_BY_CATEGORY, {
    variables: { category: selectedCategory }
  });

  const jobs = data?.jobsByCategory || [];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Category Filter */}
      <div className="mb-8 flex items-center gap-4 flex-wrap ui-glass rounded-2xl p-4">
        <div className="flex items-center gap-2 text-slate-700 font-bold">
          <Filter size={20} /> Category:
        </div>
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              selectedCategory === cat.value
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/25'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Jobs Grid */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      )}

      {error && <p className="text-red-500 p-10 text-center bg-red-50 rounded-xl">Error: {error.message}</p>}

      {!loading && !error && jobs.length === 0 && (
        <p className="text-center text-slate-500 py-10">No jobs in this category yet.</p>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <div key={job.id} className="group ui-glass ui-card-hover p-8 rounded-3xl border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-teal-50 rounded-2xl text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Briefcase size={24} />
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  {job.status}
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">{job.title}</h3>
              <p className="text-slate-500 text-sm line-clamp-3 mb-4">{job.description}</p>

              <div className="flex items-center gap-4 text-slate-700 font-bold mb-6">
                <div className="flex items-center gap-1">
                  <DollarSign size={18} className="text-green-600" />
                  <span>${job.budget}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 font-medium text-sm">
                  <Clock size={16} />
                  <span>Fixed</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-slate-900 to-slate-700 text-white py-4 rounded-2xl font-black hover:from-teal-600 hover:to-cyan-600 transition-all active:scale-95 shadow-lg shadow-slate-200">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobFilter;
