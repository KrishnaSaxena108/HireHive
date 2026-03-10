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

const JobDetail = () => {
  const { id } = useParams();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const { loading, error, data } = useQuery(GET_JOB, {
    variables: { id }
  });

  if (loading) return <div className="p-10 text-center">Loading job details...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Error: {error.message}</div>;

  const job = data?.job;
  if (!job) return <div className="p-10 text-center">Job not found</div>;

  const userRole = localStorage.getItem('role');
  const canApply = userRole === 'FREELANCER' && job.status === 'OPEN';

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