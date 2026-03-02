import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react/index.js';
import ApplyModal from './ApplyModal'; // Import the modal we created
import { Briefcase, DollarSign, Clock } from 'lucide-react';

const GET_JOBS = gql`
  query GetJobs {
    jobs {
      id
      title
      description
      budget
      status
    }
  }
`;

const JobFeed = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const { loading, error, data } = useQuery(GET_JOBS);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
  
  if (error) return <p className="text-red-500 p-10 text-center bg-red-50 rounded-xl">Error: {error.message}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.jobs.map((job) => (
          <div key={job.id} className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Briefcase size={24} />
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">
                  {job.status}
                </span>
              </div>
              
              <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">{job.title}</h3>
              <p className="text-slate-500 text-sm line-clamp-3 mb-4">{job.description}</p>
              
              <div className="flex items-center gap-4 text-slate-700 font-bold mb-6">
                <div className="flex items-center gap-1">
                  <DollarSign size={18} className="text-green-600" />
                  <span>{job.budget}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 font-medium text-sm">
                  <Clock size={16} />
                  <span>Fixed Price</span>
                </div>
              </div>
            </div>

            {/* Feature #11 Trigger */}
            <button 
              onClick={() => setSelectedJob(job)}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>

      {/* Feature #11: The Slide-over Proposal Form */}
      {selectedJob && (
        <ApplyModal 
          job={selectedJob} 
          isOpen={!!selectedJob} 
          onClose={() => setSelectedJob(null)} 
        />
      )}
    </div>
  );
};

export default JobFeed;