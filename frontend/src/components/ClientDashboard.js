import React from 'react';
import { gql } from '@apollo/client'; 
import { useQuery, useMutation } from '@apollo/client/react/index.js'; 
import { 
  Briefcase, 
  Users, 
  CheckCircle, 
  MessageCircle 
} from 'lucide-react';

// --- 1. DEFINE THE QUERY ---
const GET_CLIENT_JOBS = gql`
  query GetClientJobs {
    jobs {
      id
      title
      budget
      status
      proposals {
        id
        coverLetter
        bidAmount
        status
        freelancer {
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
  // --- 3. EXECUTE THE HOOKS ---
  const { loading, error, data } = useQuery(GET_CLIENT_JOBS);

  const [acceptProposal, { loading: hiring }] = useMutation(ACCEPT_PROPOSAL, {
    onCompleted: () => {
      alert("Success! You have officially hired a freelancer.");
    },
    onError: (err) => alert(`Hiring failed: ${err.message}`),
    refetchQueries: [{ query: GET_CLIENT_JOBS }] 
  });

  if (loading) return <div className="p-10 text-center animate-pulse text-indigo-600 font-bold">Loading Your Workspace...</div>;
  if (error) return <div className="p-10 text-center text-red-500 bg-red-50 rounded-xl">Error: {error.message}</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <header className="mb-10">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight text-center lg:text-left">Client Dashboard</h2>
      </header>

      <div className="space-y-8">
        {data.jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Job Header Info */}
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Briefcase className="text-indigo-400" />
                <h3 className="text-xl font-bold">{job.title}</h3>
              </div>
              <p className="font-mono text-indigo-300">Budget: ${job.budget} | Status: {job.status}</p>
            </div>

            <div className="p-6">
              <h4 className="text-sm font-black text-slate-400 uppercase mb-4 flex items-center gap-2">
                <Users size={16}/> Received Proposals ({job.proposals.length})
              </h4>
              
              <div className="grid gap-4">
                {job.proposals.map((proposal) => (
                  <div key={proposal.id} className="group bg-slate-50 p-6 rounded-2xl border border-transparent hover:border-indigo-200 transition-all flex justify-between items-center shadow-sm">
                    <div>
                      {/* FIXED SECTION: Added ?. and || fallback to prevent crashing */}
                      <span className="font-bold text-slate-900">
                        @{proposal.freelancer?.username || "Unknown Freelancer"}
                      </span>
                      <p className="text-slate-600 text-sm mt-1">{proposal.coverLetter}</p>
                    </div>

                    <div className="flex gap-2">
                      <button className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:text-indigo-600 transition">
                        <MessageCircle size={20} />
                      </button>
                      
                      <button 
                        disabled={hiring || proposal.status === 'ACCEPTED'}
                        onClick={() => acceptProposal({ variables: { proposalId: proposal.id } })}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition shadow-lg ${
                          proposal.status === 'ACCEPTED' 
                          ? 'bg-green-500 text-white cursor-default' 
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                        }`}
                      >
                        {hiring ? "Processing..." : proposal.status === 'ACCEPTED' ? "Hired" : "Hire"}
                        {proposal.status === 'ACCEPTED' && <CheckCircle size={18} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientDashboard;