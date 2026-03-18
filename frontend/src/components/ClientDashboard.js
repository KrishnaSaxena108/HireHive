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
  FileText,
  Star
} from 'lucide-react';
import { Button, Card, Badge, StatCard } from './ui';

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

  if (loading) return (
    <div className="p-10 text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-600 mt-4 font-medium">Loading your workspace...</p>
    </div>
  );
  if (error) return (
    <div className="max-w-7xl mx-auto p-8">
      <Card className="bg-red-50 border-red-200">
        <p className="text-red-700 font-semibold">Error: {error.message}</p>
      </Card>
    </div>
  );

  // Filter jobs to only show those belonging to the current client
  const myJobs = data?.jobs?.filter(job => job.client && job.client.id === userId) || [];
  
  // Calculate stats
  const activeJobs = myJobs.filter(j => j.status === 'OPEN').length;
  const inProgressJobs = myJobs.filter(j => j.status === 'IN_PROGRESS').length;
  const completedJobs = myJobs.filter(j => j.status === 'COMPLETED').length;
  const totalProposals = myJobs.reduce((acc, job) => acc + (job.proposals?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
        
        {/* Header with Title and CTA */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Client Workspace</h1>
            <p className="text-lg text-gray-600">Manage your projects, review proposals, and hire top talent</p>
          </div>
          <Link to="/post-job">
            <Button variant="primary" size="lg" className="flex items-center gap-2">
              <PlusCircle size={20} />
              Post New Project
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={Briefcase}
            label="Open Projects"
            value={activeJobs}
            backgroundColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            icon={Clock}
            label="In Progress"
            value={inProgressJobs}
            backgroundColor="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <StatCard
            icon={CheckCircle}
            label="Completed"
            value={completedJobs}
            backgroundColor="bg-purple-50"
            iconColor="text-purple-600"
          />
          <StatCard
            icon={Users}
            label="Total Proposals"
            value={totalProposals}
            backgroundColor="bg-amber-50"
            iconColor="text-amber-600"
          />
        </div>

        {/* Projects Section */}
        {myJobs.length === 0 ? (
          <Card className="text-center py-16">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase size={40} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Create your first project to start receiving proposals from talented freelancers</p>
            <Link to="/post-job">
              <Button variant="primary" size="lg">
                <PlusCircle size={20} />
                Post Your First Project
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {myJobs.map((job) => {
              const acceptedProposal = getAcceptedProposal(job);
              const statusConfig = {
                OPEN: { color: 'success', bgColor: 'bg-green-50', borderColor: 'border-l-4 border-green-500' },
                IN_PROGRESS: { color: 'warning', bgColor: 'bg-blue-50', borderColor: 'border-l-4 border-blue-500' },
                COMPLETED: { color: 'neutral', bgColor: 'bg-purple-50', borderColor: 'border-l-4 border-purple-500' },
              };
              const config = statusConfig[job.status] || statusConfig.OPEN;

              return (
                <Card
                  key={job.id}
                  className={`overflow-hidden border border-gray-200 ${config.borderColor}`}
                  shadow="md"
                  padding="lg"
                >
                  {/* Job Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={config.color} size="sm">
                          {job.status.replace(/_/g, ' ')}
                        </Badge>
                        {job.category && (
                          <Badge variant="neutral" size="sm">
                            {job.category}
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-200">
                      <DollarSign size={20} className="text-emerald-600" />
                      <span className="text-2xl font-bold text-emerald-600">${job.budget.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Review Reminder */}
                  {job.status === 'COMPLETED' && acceptedProposal?.freelancer?.id && (
                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                      <Star size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold text-amber-900 text-sm mb-2">
                          Complete the cycle by leaving a review
                        </p>
                        <p className="text-amber-700 text-sm mb-3">
                          Help @{acceptedProposal.freelancer.username} get recognized for exceptional work
                        </p>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => {
                            navigate(
                              `/submit-review?jobId=${job.id}&revieweeId=${acceptedProposal.freelancer.id}&username=${encodeURIComponent(acceptedProposal.freelancer.username || '')}`
                            );
                          }}
                        >
                          <Star size={16} />
                          Leave Review
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Deliverable Section */}
                  {job.status === 'COMPLETED' && job.deliverableUrl && (
                    <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2.5 rounded-lg">
                          <FileText size={20} className="text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-purple-900">Deliverable</h4>
                          <p className="text-sm text-purple-600">{job.deliverableFileName}</p>
                        </div>
                      </div>
                      <a
                        href={job.deliverableUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                      >
                        <Download size={16} />
                        Download
                      </a>
                    </div>
                  )}

                  {/* Proposals Section */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Users size={16} />
                      Proposals ({job.proposals?.length || 0})
                    </h4>

                    {!job.proposals || job.proposals.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <Clock size={32} className="mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-600 font-medium">Waiting for freelancers to submit proposals...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {job.proposals.map((proposal) => (
                          <div
                            key={proposal.id}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              proposal.status === 'ACCEPTED'
                                ? 'bg-green-50 border-green-300'
                                : 'bg-white border-gray-200 hover:border-blue-300'
                            }`}
                          >
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-bold text-lg text-gray-900">
                                    @{proposal.freelancer?.username || 'Unknown'}
                                  </span>
                                  {proposal.status === 'ACCEPTED' && (
                                    <Badge variant="success" size="sm">
                                      <CheckCircle size={14} />
                                      Hired
                                    </Badge>
                                  )}
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg text-gray-700 text-sm">
                                  {proposal.coverLetter}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200 whitespace-nowrap">
                                <DollarSign size={16} className="text-blue-600" />
                                <span className="font-bold text-blue-600">${proposal.bidAmount}</span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate(`/messages?user=${proposal.freelancer?.id}&username=${encodeURIComponent(proposal.freelancer?.username || '')}`)}
                              >
                                <MessageCircle size={16} />
                                Discuss
                              </Button>

                              {job.status === 'OPEN' && proposal.status === 'PENDING' && (
                                <Button
                                  size="sm"
                                  variant="primary"
                                  disabled={hiring}
                                  onClick={() => {
                                    if (window.confirm(`Hire @${proposal.freelancer?.username}? This will close the job for other proposals.`)) {
                                      acceptProposal({ variables: { proposalId: proposal.id } });
                                    }
                                  }}
                                >
                                  {hiring ? 'Processing...' : 'Hire'}
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;