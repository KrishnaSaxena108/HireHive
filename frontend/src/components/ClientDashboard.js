import React from 'react';
import { gql } from '@apollo/client'; 
import { useQuery, useMutation } from '@apollo/client/react/index.js'; 
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  CheckCircle, 
  MessageCircle,
  PlusCircle,
  Clock,
  DollarSign,
  Download,
  FileText
} from 'lucide-react';

// --- 1. DEFINE THE QUERY ---
const GET_CLIENT_JOBS = gql`
  query GetClientJobs {
    jobs {
      id
      title
      budget
      status
      category
      deliverableUrl
      deliverableFileName
      client {
        id
      }
      proposals {
        id
        coverLetter
        bidAmount
        status
        freelancer {
          id
          username
          email
        }
      }
    }
  }
`;

// --- 2. DEFINE THE MUTATION ---
const ACCEPT_PROPOSAL = gql`
  mutation AcceptProposal($proposalId: ID!) {
    acceptProposal(proposalId: $proposalId) {
      id
      status
    }
  }
`;

const ClientDashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const getAcceptedProposal = (job) => {
    if (!job?.proposals?.length) return null;
    return job.proposals.find((proposal) => proposal.status === 'ACCEPTED') || null;
  };

  // --- 3. EXECUTE THE HOOKS ---
  const { loading, error, data } = useQuery(GET_CLIENT_JOBS);

  const [acceptProposal, { loading: hiring }] = useMutation(ACCEPT_PROPOSAL, {
    onCompleted: () => {
      alert("Success! You have officially hired a freelancer. The job is now in progress.");
    },
    onError: (err) => alert(`Hiring failed: ${err.message}`),
    refetchQueries: [{ query: GET_CLIENT_JOBS }] 
  });

  if (loading) return <div className="p-10 text-center animate-pulse text-teal-600 font-bold">Loading Your Workspace...</div>;
  if (error) return <div className="p-10 text-center text-red-500 bg-red-50 rounded-xl">Error: {error.message}</div>;

  // Filter jobs to only show those belonging to the current client
  const myJobs = data?.jobs?.filter(job => job.client && job.client.id === userId) || [];
  
  // Calculate some stats for the hero section
  const activeJobs = myJobs.filter(j => j.status === 'OPEN').length;
  const inProgressJobs = myJobs.filter(j => j.status === 'IN_PROGRESS').length;
  const totalProposals = myJobs.reduce((acc, job) => acc + (job.proposals?.length || 0), 0);

  return (
    <div className="p-4 md:p-8 min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl p-8 md:p-12 mb-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between">
        <div>
          <h2 className="text-4xl font-black mb-2">Client Workspace</h2>
          <p className="text-teal-50 text-lg mb-6">Manage your projects, review bids, and hire top talent.</p>
          
          <div className="flex gap-6 text-sm font-medium">
            <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
              <span className="block text-2xl font-black">{activeJobs}</span> Open Projects
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
              <span className="block text-2xl font-black">{inProgressJobs}</span> In Progress
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
              <span className="block text-2xl font-black">{myJobs.filter(j => j.status === 'COMPLETED').length}</span> Completed
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
              <span className="block text-2xl font-black">{totalProposals}</span> Total Bids
            </div>
          </div>
        </div>
        
        <Link 
          to="/post-job" 
          className="mt-8 md:mt-0 bg-white text-teal-700 font-bold px-8 py-4 rounded-2xl shadow-lg hover:bg-slate-50 hover:scale-105 transition-all flex items-center gap-3 text-lg"
        >
          <PlusCircle size={24} /> Post New Project
        </Link>
      </div>

      {/* --- JOB LISTINGS --- */}
      <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
        <Briefcase className="text-teal-500" /> My Projects
      </h3>

      {myJobs.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-slate-200 shadow-sm">
          <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase size={32} className="text-slate-400" />
          </div>
          <h4 className="text-xl font-bold text-slate-800 mb-2">No projects yet</h4>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">You haven't posted any jobs. Create your first project to start receiving bids from talented freelancers.</p>
          <Link to="/post-job" className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-teal-500/25 transition">
            <PlusCircle size={20} /> Post a Job
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {myJobs.map((job) => {
            const acceptedProposal = getAcceptedProposal(job);
            return (
            <div key={job.id} className="ui-glass rounded-3xl border border-slate-200 overflow-hidden transition-all hover:shadow-lg">
              
              {/* Job Status Bar */}
              <div className={`h-2 w-full ${
                job.status === 'OPEN' ? 'bg-green-400' : 
                job.status === 'IN_PROGRESS' ? 'bg-blue-500' : 
                job.status === 'COMPLETED' ? 'bg-purple-500' : 'bg-slate-400'
              }`}></div>
              
              {/* Job Header Info */}
              <div className="p-6 md:px-8 md:pt-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 text-xs font-black rounded-full uppercase tracking-wide ${
                      job.status === 'OPEN' ? 'bg-green-100 text-green-700' : 
                      job.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 
                      job.status === 'COMPLETED' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {job.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide bg-slate-100 px-3 py-1 rounded-full">{job.category}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-teal-600 transition-colors">{job.title}</h3>
                </div>
                
                <div className="flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-xl text-teal-700 font-bold border border-teal-100">
                  <DollarSign size={18} />
                  <span>{job.budget.toLocaleString()}</span>
                </div>
              </div>

              {/* Client Review CTA for completed projects */}
              {job.status === 'COMPLETED' && acceptedProposal?.freelancer?.id && (
                <div className="px-6 md:px-8 py-4 bg-amber-50 border-b border-amber-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <p className="text-sm text-amber-800 font-semibold">
                    Project finished with @{acceptedProposal.freelancer.username}. Leave a review to help the freelancer community.
                  </p>
                  <button
                    onClick={() => {
                      if (!acceptedProposal?.freelancer?.id) return;
                      navigate(
                        `/submit-review?jobId=${job.id}&revieweeId=${acceptedProposal.freelancer.id}&username=${encodeURIComponent(acceptedProposal.freelancer.username || '')}`
                      );
                    }}
                    className="px-5 py-2.5 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all"
                  >
                    Give Review
                  </button>
                </div>
              )}

              {/* Deliverable Section for COMPLETED jobs */}
              {job.status === 'COMPLETED' && job.deliverableUrl && (
                <div className="p-6 md:px-8 bg-purple-50 border-b border-purple-100">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-3 rounded-xl">
                        <FileText className="text-purple-600" size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-purple-900">Project Deliverable</h4>
                        <p className="text-sm text-purple-600">{job.deliverableFileName}</p>
                      </div>
                    </div>
                    <a
                      href={job.deliverableUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      <Download size={18} />
                      Download File
                    </a>
                  </div>
                </div>
              )}

              {/* Proposals Section */}
              <div className="p-6 md:p-8 bg-slate-50/50">
                <h4 className="text-sm font-black text-slate-500 uppercase mb-4 flex items-center gap-2 tracking-wider">
                  <Users size={16}/> Freelancer Bids ({job.proposals?.length || 0})
                </h4>
                
                {(!job.proposals || job.proposals.length === 0) ? (
                  <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-slate-300">
                    <Clock size={24} className="mx-auto text-slate-400 mb-2" />
                    <p className="text-slate-500 text-sm">Waiting for proposals. Check back soon!</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {job.proposals.map((proposal) => (
                      <div key={proposal.id} className={`bg-white p-5 rounded-2xl border transition-all flex flex-col md:flex-row justify-between gap-6 shadow-sm ${
                        proposal.status === 'ACCEPTED' ? 'border-green-300 bg-green-50/30' : 'border-slate-200 hover:border-teal-300'
                      }`}>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-black text-lg text-slate-900 flex items-center gap-2">
                              @{proposal.freelancer?.username || "Unknown Freelancer"}
                              {proposal.status === 'ACCEPTED' && (
                                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <CheckCircle size={12} /> Hired
                                </span>
                              )}
                            </span>
                            <span className="font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-lg text-sm border border-teal-100">
                              Bid: ${proposal.bidAmount}
                            </span>
                          </div>
                          
                          <div className="bg-slate-50 p-4 rounded-xl text-slate-600 text-sm leading-relaxed border border-slate-100">
                            <span className="font-bold text-xs text-slate-400 uppercase tracking-wider block mb-1">Cover Letter</span>
                            {proposal.coverLetter}
                          </div>
                        </div>

                        <div className="flex md:flex-col gap-3 justify-end items-end shrink-0 pt-2 md:pt-0">
                          {/* Chat Button */}
                          <button 
                            onClick={() => navigate(`/messages?user=${proposal.freelancer?.id}&username=${encodeURIComponent(proposal.freelancer?.username || '')}`)}
                            className="w-full justify-center md:w-auto flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-600 rounded-xl hover:border-teal-600 hover:text-teal-600 font-bold transition group"
                            title="Discuss with freelancer"
                          >
                            <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
                            <span>Discuss</span>
                          </button>
                          
                          {/* Hire Button */}
                          {job.status === 'OPEN' && proposal.status === 'PENDING' && (
                            <button 
                              disabled={hiring}
                              onClick={() => {
                                if(window.confirm(`Are you sure you want to hire @${proposal.freelancer?.username}? This will close the job and reject other bids.`)) {
                                  acceptProposal({ variables: { proposalId: proposal.id } });
                                }
                              }}
                              className="w-full justify-center md:w-auto flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-teal-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                            >
                              {hiring ? "Processing..." : "Hire Talent"}
                            </button>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;