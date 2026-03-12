import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react/index.js';
import { useParams, Link } from 'react-router-dom';
import { Briefcase, DollarSign, User, ArrowLeft } from 'lucide-react';
import ApplyModal from './ApplyModal';

const GET_JOB = gql`
  query GetJob($id: ID!) {
    job(id: $id) {
      id
      title
      description
      budget
      status
      category
      client {
        id
        username
        profilePictureUrl
      }
      proposals {
        id
        freelancer {
          username
        }
        status
      }
    }
  }
`;

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

const JobDetail = () => {
  const { id } = useParams();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const { loading, error, data } = useQuery(GET_JOB, {
    variables: { id }
  });

  // Fetch related jobs
  const job = data?.job;
  const { data: relatedJobsData } = useQuery(SEARCH_JOBS, {
    variables: {
      category: job?.category || null,
      status: 'OPEN'
    },
    skip: !job?.category
  });

  if (loading) return <div className="p-10 text-center">Loading job details...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Error: {error.message}</div>;

  if (!job) return <div className="p-10 text-center">Job not found</div>;

  const userRole = localStorage.getItem('userRole');
  const canApply = userRole === 'FREELANCER' && job.status === 'OPEN';

  // Filter related jobs (exclude current job, limit to 3)
  const relatedJobs = (relatedJobsData?.searchJobs || [])
    .filter(j => j.id !== id)
    .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/browse" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6">
        <ArrowLeft size={20} /> Back to Jobs
      </Link>

      <div className="bg-white rounded-3xl shadow-xl p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">{job.title}</h1>
            <div className="flex items-center gap-4 text-slate-600">
              <div className="flex items-center gap-1">
                <User size={16} />
                <span>{job.client.username}</span>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase size={16} />
                <span>{job.category}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign size={16} />
                <span>${job.budget}</span>
              </div>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${
            job.status === 'OPEN' ? 'bg-green-100 text-green-800' :
            job.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {job.status}
          </span>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Project Description</h2>
          <p className="text-slate-700 leading-relaxed">{job.description}</p>
        </div>

        {/* Proposals Count */}
        <div className="mb-8">
          <p className="text-slate-600">
            {job.proposals.length} proposal{job.proposals.length !== 1 ? 's' : ''} submitted
          </p>
        </div>

        {/* Apply Button */}
        {canApply && (
          <button
            onClick={() => setShowApplyModal(true)}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg"
          >
            Submit Proposal
          </button>
        )}

        {!canApply && userRole === 'FREELANCER' && (
          <p className="text-center text-slate-500 py-4">
            {job.status === 'IN_PROGRESS' ? 'This job is already in progress' : 'You cannot apply to this job'}
          </p>
        )}
      </div>

      {/* Related Jobs Section */}
      {relatedJobs.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Similar Jobs You Might Like</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedJobs.map((relatedJob) => (
              <Link
                key={relatedJob.id}
                to={`/job/${relatedJob.id}`}
                className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-indigo-100 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Briefcase size={20} />
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                    {relatedJob.status}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600">{relatedJob.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{relatedJob.description}</p>
                <div className="flex items-center gap-2 font-bold text-green-600">
                  <DollarSign size={16} />
                  <span>${relatedJob.budget}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <ApplyModal
          job={job}
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
        />
      )}
    </div>
  );
};

export default JobDetail;