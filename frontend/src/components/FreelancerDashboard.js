import React, { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react/index.js';
import { DollarSign, Briefcase, FileText, Bell, CheckCircle, Clock, Upload, Loader } from 'lucide-react';
import { socket } from '../socket';

// 1. Query to fetch only THIS freelancer's proposals and jobs
const GET_FREELANCER_DASHBOARD = gql`
  query GetFreelancerDashboard($userId: ID!) {
    me {
      id
      username
      averageRating
    }
    myProposals {  
      id
      status
      bidAmount
      job {
        id
        title
        status
        budget
        deliverableUrl
        deliverableFileName
      }
    }
    notifications(userId: $userId) {
      id
      isRead
    }
  }
`;

const COMPLETE_JOB = gql`
  mutation CompleteJob($jobId: ID!, $deliverableUrl: String!, $deliverableFileName: String!) {
    completeJob(jobId: $jobId, deliverableUrl: $deliverableUrl, deliverableFileName: $deliverableFileName) {
      id
      status
      deliverableUrl
      deliverableFileName
    }
  }
`;

// ... (imports and query stay the same)

const FreelancerDashboard = () => {
  const userId = localStorage.getItem('userId');
  const [uploadingJobId, setUploadingJobId] = useState(null);

  const { loading, error, data, refetch } = useQuery(GET_FREELANCER_DASHBOARD, {
    variables: { userId },
    skip: !userId
  });

  const [completeJob] = useMutation(COMPLETE_JOB, {
    onCompleted: () => {
      setUploadingJobId(null);
      alert('Project completed successfully! The client has been notified.');
      refetch();
    },
    onError: (err) => {
      setUploadingJobId(null);
      alert('Failed to complete project: ' + err.message);
    }
  });

  const handleFileUpload = async (jobId, file) => {
    if (!file) return;

    setUploadingJobId(jobId);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobId', jobId);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/upload/deliverable', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      // Now complete the job with the uploaded file URL
      await completeJob({
        variables: {
          jobId,
          deliverableUrl: result.deliverableUrl,
          deliverableFileName: result.deliverableFileName
        }
      });
    } catch (err) {
      setUploadingJobId(null);
      alert('Upload failed: ' + err.message);
    }
  };

  useEffect(() => {
    if (userId) {
      socket.emit('register_private_room', userId);

      const handleUpdate = () => {
        refetch();
      };

      socket.on('proposal_accepted', handleUpdate);
      socket.on('notification', handleUpdate);

      return () => {
        socket.off('proposal_accepted', handleUpdate);
        socket.off('notification', handleUpdate);
      };
    }
  }, [userId, refetch]);

  if (loading) return <div className="p-10 text-center animate-pulse text-teal-600 font-bold">Loading Freelancer Stats...</div>;
  if (error) return <div className="p-10 text-center text-red-500 bg-red-50 rounded-xl">Error: {error.message}</div>;

  const averageRating = data?.me?.averageRating || 0;

  // --- 3. FIXED LOGIC: Use 'myProposals' to match the query above ---
  const activeProjects = data?.myProposals?.filter(p => p.status === 'ACCEPTED') || [];
  const pendingBids = data?.myProposals?.filter(p => p.status === 'PENDING') || [];

  const unreadNotificationsCount = data?.notifications?.filter(n => !n.isRead).length || 0;

  const stats = [
    { 
      label: 'Total Earnings', 
      value: `$${activeProjects.reduce((acc, curr) => acc + (curr.bidAmount || 0), 0).toLocaleString()}`, 
      icon: <DollarSign />, 
      color: 'bg-green-500' 
    },
    { label: 'Active Projects', value: activeProjects.length, icon: <Briefcase />, color: 'bg-blue-500' },
    { label: 'Pending Bids', value: pendingBids.length, icon: <FileText />, color: 'bg-orange-500' },
    { label: 'Notifications', value: unreadNotificationsCount.toString(), icon: <Bell />, color: 'bg-purple-500' },
  ];

  // ... (rest of the return statement stays exactly the same)

  return (
    <div className="p-8 min-h-screen">
      <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Freelancer Workspace</h2>
      <p className="mb-4 text-lg">Your rating: <span className="font-bold">{averageRating.toFixed(1)} / 5</span></p>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="ui-glass p-6 rounded-3xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg`}>{stat.icon}</div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Active Projects List (#13) */}
        <div className="ui-glass p-8 rounded-3xl border border-slate-100">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <CheckCircle className="text-blue-500" size={20}/> Active Projects
          </h3>
          {activeProjects.length > 0 ? (
            <div className="space-y-4">
              {activeProjects.map((p) => (
                <div key={p.id} className="p-4 bg-white/80 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-slate-900">{p.job.title}</h4>
                      <p className="text-sm text-slate-500">Earnings: ${p.bidAmount}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      p.job.status === 'COMPLETED' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {p.job.status === 'COMPLETED' ? 'COMPLETED' : 'IN PROGRESS'}
                    </span>
                  </div>
                  
                  {/* Show upload button for IN_PROGRESS jobs */}
                  {p.job.status === 'IN_PROGRESS' && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-teal-500/25 transition cursor-pointer disabled:opacity-50">
                        {uploadingJobId === p.job.id ? (
                          <>
                            <Loader size={18} className="animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload size={18} />
                            <span>Upload & Complete Project</span>
                          </>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          disabled={uploadingJobId === p.job.id}
                          accept=".pdf,.doc,.docx,.zip,.rar,.png,.jpg,.jpeg,.webp"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (window.confirm(`Upload "${file.name}" and mark this project as complete?`)) {
                                handleFileUpload(p.job.id, file);
                              }
                            }
                            e.target.value = '';
                          }}
                        />
                      </label>
                      <p className="text-xs text-slate-400 text-center mt-2">
                        Upload your deliverable (PDF, DOC, ZIP, or images)
                      </p>
                    </div>
                  )}
                  
                  {/* Show deliverable link for COMPLETED jobs */}
                  {p.job.status === 'COMPLETED' && p.job.deliverableUrl && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <a 
                        href={p.job.deliverableUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl font-semibold hover:bg-green-200 transition text-sm"
                      >
                        <FileText size={16} />
                        View Submitted: {p.job.deliverableFileName}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-10">No active projects yet. Start bidding!</p>
          )}
        </div>
        
        {/* Pending Bids Section */}
        <div className="ui-glass p-8 rounded-3xl border border-slate-100">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Clock className="text-orange-500" size={20}/> My Pending Bids
          </h3>
          {pendingBids.length > 0 ? (
            <div className="space-y-4">
               {pendingBids.map((p) => (
                <div key={p.id} className="p-4 border-b border-slate-50 last:border-0 flex justify-between items-center">
                  <span className="text-slate-700 font-medium">{p.job.title}</span>
                  <span className="text-slate-400 text-sm">${p.bidAmount}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-10">No pending bids.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;