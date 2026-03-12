import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react/index.js';
import { Briefcase, Users, CheckCircle, MessageCircle, Plus, DollarSign, Clock, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const GET_CLIENT_JOBS = gql`
  query GetClientJobs {
    jobs {
      id title budget status
      proposals {
        id coverLetter bidAmount status
        freelancer { username email }
      }
    }
  }
`;

const ACCEPT_PROPOSAL = gql`
  mutation AcceptProposal($proposalId: ID!) {
    acceptProposal(proposalId: $proposalId) { id status }
  }
`;

const statusColor = (s) => ({ OPEN: 'badge-green', IN_PROGRESS: 'badge-blue', CLOSED: 'badge-red' }[s] || 'badge');

const JobCard = ({ job, acceptProposal, hiring }) => {
  const [expanded, setExpanded] = useState(false);
  const proposalCount = job.proposals?.length || 0;
  const hasHired = job.proposals?.some(p => p.status === 'ACCEPTED');

  return (
    <div className="card overflow-hidden">
      {/* Job header */}
      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0">
            <Briefcase className="text-indigo-600" size={22} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{job.title}</h3>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <span className={`badge ${statusColor(job.status)}`}>{job.status}</span>
              <span className="flex items-center gap-1 text-sm text-slate-500"><DollarSign size={13} />${Number(job.budget).toLocaleString()} budget</span>
              <span className="flex items-center gap-1 text-sm text-slate-500"><Users size={13} />{proposalCount} proposal{proposalCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
        {proposalCount > 0 && (
          <button onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors shrink-0">
            {expanded ? 'Hide' : 'View'} Proposals {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>

      {/* Proposals list */}
      {expanded && proposalCount > 0 && (
        <div className="border-t border-slate-100 divide-y divide-slate-50">
          {job.proposals.map((p) => (
            <div key={p.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
                    {(p.freelancer?.username || '?')[0].toUpperCase()}
                  </div>
                  <span className="font-bold text-slate-900">@{p.freelancer?.username || 'Unknown'}</span>
                  <span className="text-sm font-semibold text-indigo-600 ml-auto sm:ml-0">${Number(p.bidAmount).toLocaleString()}</span>
                  {p.status === 'ACCEPTED' && <span className="badge badge-green">Hired</span>}
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 ml-10">{p.coverLetter}</p>
              </div>
              <div className="flex items-center gap-2 sm:ml-4 shrink-0">
                <button title="Message freelancer" className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors text-slate-500">
                  <MessageCircle size={16} />
                </button>
                <button
                  disabled={hiring || p.status === 'ACCEPTED' || hasHired}
                  onClick={() => acceptProposal({ variables: { proposalId: p.id } })}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                    p.status === 'ACCEPTED'
                      ? 'bg-emerald-500 text-white cursor-default'
                      : hasHired
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'btn-primary py-2 text-sm'
                  }`}>
                  {hiring ? <Loader2 size={14} className="animate-spin" /> : p.status === 'ACCEPTED' ? <><CheckCircle size={14} /> Hired</> : 'Hire'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {expanded && proposalCount === 0 && (
        <div className="border-t border-slate-100 p-8 text-center text-slate-400 text-sm">No proposals yet.</div>
      )}
    </div>
  );
};

const ClientDashboard = () => {
  const username = localStorage.getItem('username') || 'Client';
  const { loading, error, data } = useQuery(GET_CLIENT_JOBS);
  const [acceptProposal, { loading: hiring }] = useMutation(ACCEPT_PROPOSAL, {
    refetchQueries: [{ query: GET_CLIENT_JOBS }],
  });

  const jobs = data?.jobs || [];
  const totalProposals = jobs.reduce((a, j) => a + (j.proposals?.length || 0), 0);
  const activeJobs = jobs.filter(j => j.status === 'IN_PROGRESS').length;

  return (
    <div className="page-wrapper py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-sm font-medium text-indigo-600 mb-1">Welcome back</p>
          <h1 className="text-3xl font-extrabold text-slate-900">@{username}</h1>
          <p className="text-slate-500 mt-1">Manage your jobs and hire top talent</p>
        </div>
        <Link to="/post-job" className="btn-primary shrink-0"><Plus size={16} /> Post New Job</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mb-10">
        {[
          { label: 'Total Jobs', value: jobs.length, Icon: Briefcase, color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Active Projects', value: activeJobs, Icon: Clock, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Total Proposals', value: totalProposals, Icon: Users, color: 'bg-amber-50 text-amber-600' },
        ].map(({ label, value, Icon, color }) => (
          <div key={label} className="card p-6">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${color}`}>
              <Icon size={20} />
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{value}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="card p-6 mb-6 text-red-600 text-sm font-semibold">{error.message}</div>
      )}

      {/* Jobs */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="card p-6 h-24 animate-pulse" />)}
        </div>
      ) : jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map(job => (
            <JobCard key={job.id} job={job} acceptProposal={acceptProposal} hiring={hiring} />
          ))}
        </div>
      ) : (
        <div className="card p-16 text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase className="text-indigo-400" size={28} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">No jobs posted yet</h2>
          <p className="text-slate-500 mb-6 text-sm">Post your first job and start receiving proposals from top freelancers.</p>
          <Link to="/post-job" className="btn-primary inline-flex"><Plus size={16} /> Post First Job</Link>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
