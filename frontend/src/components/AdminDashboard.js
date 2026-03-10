import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client/react/index.js';
import { Users, Briefcase, FileText, BarChart3, UserX, UserCheck, Trash2, AlertTriangle } from 'lucide-react';

const GET_ADMIN_STATS = gql`
  query GetAdminStats {
    adminStats {
      totalUsers
      totalJobs
      totalProposals
      activeJobs
      completedJobs
    }
  }
`;

const GET_ADMIN_USERS = gql`
  query GetAdminUsers {
    adminUsers {
      id
      username
      email
      role
      profilePictureUrl
      createdAt
    }
  }
`;

const GET_ADMIN_JOBS = gql`
  query GetAdminJobs {
    adminJobs {
      id
      title
      status
      budget
      category
      client {
        username
      }
      createdAt
    }
  }
`;

const GET_ADMIN_PROPOSALS = gql`
  query GetAdminProposals {
    adminProposals {
      id
      coverLetter
      bidAmount
      status
      job {
        title
      }
      freelancer {
        username
      }
      createdAt
    }
  }
`;

const SUSPEND_USER = gql`
  mutation SuspendUser($userId: ID!) {
    suspendUser(userId: $userId) {
      id
      username
      role
    }
  }
`;

const ACTIVATE_USER = gql`
  mutation ActivateUser($userId: ID!) {
    activateUser(userId: $userId) {
      id
      username
      role
    }
  }
`;

const DELETE_JOB = gql`
  mutation DeleteJob($jobId: ID!) {
    deleteJob(jobId: $jobId)
  }
`;

const DELETE_PROPOSAL = gql`
  mutation DeleteProposal($proposalId: ID!) {
    deleteProposal(proposalId: $proposalId)
  }
`;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [confirmAction, setConfirmAction] = useState(null);

  const { loading: statsLoading, error: statsError, data: statsData, refetch: refetchStats } = useQuery(GET_ADMIN_STATS);
  const { loading: usersLoading, error: usersError, data: usersData, refetch: refetchUsers } = useQuery(GET_ADMIN_USERS, {
    skip: activeTab !== 'users'
  });
  const { loading: jobsLoading, error: jobsError, data: jobsData, refetch: refetchJobs } = useQuery(GET_ADMIN_JOBS, {
    skip: activeTab !== 'jobs'
  });
  const { loading: proposalsLoading, error: proposalsError, data: proposalsData, refetch: refetchProposals } = useQuery(GET_ADMIN_PROPOSALS, {
    skip: activeTab !== 'proposals'
  });

  const [suspendUser] = useMutation(SUSPEND_USER, {
    onCompleted: () => {
      refetchUsers();
      refetchStats();
      setConfirmAction(null);
    }
  });

  const [activateUser] = useMutation(ACTIVATE_USER, {
    onCompleted: () => {
      refetchUsers();
      refetchStats();
      setConfirmAction(null);
    }
  });

  const [deleteJob] = useMutation(DELETE_JOB, {
    onCompleted: () => {
      refetchJobs();
      refetchStats();
      setConfirmAction(null);
    }
  });

  const [deleteProposal] = useMutation(DELETE_PROPOSAL, {
    onCompleted: () => {
      refetchProposals();
      refetchStats();
      setConfirmAction(null);
    }
  });

  const handleAction = (action, id) => {
    setConfirmAction({ action, id });
  };

  const confirmActionHandler = () => {
    if (!confirmAction) return;

    const { action, id } = confirmAction;

    switch (action) {
      case 'suspend':
        suspendUser({ variables: { userId: id } });
        break;
      case 'activate':
        activateUser({ variables: { userId: id } });
        break;
      case 'deleteJob':
        deleteJob({ variables: { jobId: id } });
        break;
      case 'deleteProposal':
        deleteProposal({ variables: { proposalId: id } });
        break;
      default:
        break;
    }
  };

  const tabs = [
    { id: 'stats', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'proposals', label: 'Proposals', icon: FileText }
  ];

  const stats = statsData?.adminStats || {};
  const users = usersData?.adminUsers || [];
  const jobs = jobsData?.adminJobs || [];
  const proposals = proposalsData?.adminProposals || [];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600 text-lg">Manage users, jobs, and platform content</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Stats Dashboard */}
          {activeTab === 'stats' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Platform Statistics</h2>
              
              {statsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              ) : statsError ? (
                <p className="text-red-500 text-center py-8">Error loading stats: {statsError.message}</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl">
                    <Users size={32} className="mb-3" />
                    <div className="text-3xl font-black">{stats.totalUsers || 0}</div>
                    <div className="text-blue-100">Total Users</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl">
                    <Briefcase size={32} className="mb-3" />
                    <div className="text-3xl font-black">{stats.totalJobs || 0}</div>
                    <div className="text-green-100">Total Jobs</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl">
                    <FileText size={32} className="mb-3" />
                    <div className="text-3xl font-black">{stats.totalProposals || 0}</div>
                    <div className="text-purple-100">Total Proposals</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl">
                    <Briefcase size={32} className="mb-3" />
                    <div className="text-3xl font-black">{stats.activeJobs || 0}</div>
                    <div className="text-orange-100">Active Jobs</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-6 rounded-2xl">
                    <BarChart3 size={32} className="mb-3" />
                    <div className="text-3xl font-black">{stats.completedJobs || 0}</div>
                    <div className="text-teal-100">Completed Jobs</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Users Management */}
          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">User Management</h2>
              
              {usersLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              ) : usersError ? (
                <p className="text-red-500 text-center py-8">Error loading users: {usersError.message}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-4 px-4 font-bold text-slate-900">User</th>
                        <th className="text-left py-4 px-4 font-bold text-slate-900">Email</th>
                        <th className="text-left py-4 px-4 font-bold text-slate-900">Role</th>
                        <th className="text-left py-4 px-4 font-bold text-slate-900">Joined</th>
                        <th className="text-left py-4 px-4 font-bold text-slate-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              {user.profilePictureUrl ? (
                                <img src={`http://localhost:4000${user.profilePictureUrl}`} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
                              ) : (
                                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                                  <Users size={16} className="text-slate-500" />
                                </div>
                              )}
                              <span className="font-semibold text-slate-900">{user.username}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-slate-600">{user.email}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                              user.role === 'CLIENT' ? 'bg-blue-100 text-blue-700' :
                              user.role === 'FREELANCER' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-600">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              {user.role !== 'SUSPENDED' && user.role !== 'ADMIN' && (
                                <button
                                  onClick={() => handleAction('suspend', user.id)}
                                  className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1"
                                >
                                  <UserX size={14} />
                                  Suspend
                                </button>
                              )}
                              {user.role === 'SUSPENDED' && (
                                <button
                                  onClick={() => handleAction('activate', user.id)}
                                  className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1"
                                >
                                  <UserCheck size={14} />
                                  Activate
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Jobs Management */}
          {activeTab === 'jobs' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Job Management</h2>
              
              {jobsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              ) : jobsError ? (
                <p className="text-red-500 text-center py-8">Error loading jobs: {jobsError.message}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-4 px-4 font-bold text-slate-900">Title</th>
                        <th className="text-left py-4 px-4 font-bold text-slate-900">Client</th>
                        <th className="text-left py-4 px-4 font-bold text-slate-900">Budget</th>
                        <th className="text-left py-4 px-4 font-bold text-slate-900">Status</th>
                        <th className="text-left py-4 px-4 font-bold text-slate-900">Category</th>
                        <th className="text-left py-4 px-4 font-bold text-slate-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job) => (
                        <tr key={job.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-4 px-4 font-semibold text-slate-900">{job.title}</td>
                          <td className="py-4 px-4 text-slate-600">{job.client?.username}</td>
                          <td className="py-4 px-4 font-bold text-green-600">${job.budget}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              job.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                              job.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-600">{job.category}</td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleAction('deleteJob', job.id)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Proposals Management */}
          {activeTab === 'proposals' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Proposal Management</h2>
              
              {proposalsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              ) : proposalsError ? (
                <p className="text-red-500 text-center py-8">Error loading proposals: {proposalsError.message}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-4 px-4 font-bold text-slate-900">Job</th>
                        <th className="text-left py-4 px-4 font-bold text-slate-900">Freelancer</th>
                        <th className="text-left py-4 px-4 font-bold text-slate-900">Bid</th>
                        <th className="text-left py-4 px-4 font-bold text-slate-900">Status</th>
                        <th className="text-left py-4 px-4 font-bold text-slate-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proposals.map((proposal) => (
                        <tr key={proposal.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-4 px-4 font-semibold text-slate-900">{proposal.job?.title}</td>
                          <td className="py-4 px-4 text-slate-600">{proposal.freelancer?.username}</td>
                          <td className="py-4 px-4 font-bold text-green-600">${proposal.bidAmount}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              proposal.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                              proposal.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {proposal.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => handleAction('deleteProposal', proposal.id)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {confirmAction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-yellow-500" size={24} />
                <h3 className="text-xl font-bold text-slate-900">Confirm Action</h3>
              </div>
              <p className="text-slate-600 mb-6">
                Are you sure you want to {confirmAction.action === 'suspend' ? 'suspend' : 
                                         confirmAction.action === 'activate' ? 'activate' :
                                         confirmAction.action === 'deleteJob' ? 'delete this job' :
                                         'delete this proposal'}?
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmActionHandler}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
