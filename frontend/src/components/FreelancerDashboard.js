import React, { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react/index.js';
import { DollarSign, Briefcase, FileText, Bell, CheckCircle, Clock, Upload, Loader, Star } from 'lucide-react';
import { Button, Card, Badge, StatCard } from './ui';
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Freelancer Workspace</h1>
          <div className="flex items-center gap-2">
            <span className="text-lg text-gray-600">Your rating:</span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                />
              ))}
              <span className="ml-2 font-bold text-gray-900">{averageRating.toFixed(1)} / 5</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={DollarSign}
            label="Total Earnings"
            value={`$${activeProjects.reduce((acc, curr) => acc + (curr.bidAmount || 0), 0).toLocaleString()}`}
            backgroundColor="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <StatCard
            icon={Briefcase}
            label="Active Projects"
            value={activeProjects.length}
            backgroundColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            icon={Clock}
            label="Pending Bids"
            value={pendingBids.length}
            backgroundColor="bg-amber-50"
            iconColor="text-amber-600"
          />
          <StatCard
            icon={Bell}
            label="Notifications"
            value={unreadNotificationsCount}
            backgroundColor="bg-purple-50"
            iconColor="text-purple-600"
          />
        </div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Active Projects */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CheckCircle size={28} className="text-blue-600" />
              Active Projects
            </h2>
            {activeProjects.length > 0 ? (
              <div className="space-y-4">
                {activeProjects.map((project) => (
                  <Card key={project.id} padding="md" className="border-l-4 border-l-blue-500">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg">{project.job.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          <DollarSign size={14} className="inline text-emerald-600" />
                          {` Earnings: $${project.bidAmount}`}
                        </p>
                      </div>
                      <Badge
                        variant={project.job.status === 'COMPLETED' ? 'success' : 'primary'}
                        size="sm"
                      >
                        {project.job.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
                      </Badge>
                    </div>

                    {project.job.status === 'IN_PROGRESS' && (
                      <label className="block mt-4 pt-4 border-t border-gray-200">
                        <Button
                          variant="primary"
                          size="md"
                          fullWidth
                          disabled={uploadingJobId === project.job.id}
                          className={uploadingJobId === project.job.id ? 'opacity-50' : ''}
                        >
                          {uploadingJobId === project.job.id ? (
                            <>
                              <Loader size={16} className="animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload size={16} />
                              Upload & Complete Project
                            </>
                          )}
                        </Button>
                        <input
                          type="file"
                          className="hidden"
                          disabled={uploadingJobId === project.job.id}
                          accept=".pdf,.doc,.docx,.zip,.rar,.png,.jpg,.jpeg,.webp"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (window.confirm(`Upload "${file.name}" and mark this project as complete?`)) {
                                handleFileUpload(project.job.id, file);
                              }
                            }
                            e.target.value = '';
                          }}
                        />
                        <p className="text-xs text-gray-500 text-center mt-2">
                          PDF, DOC, ZIP, or images accepted
                        </p>
                      </label>
                    )}

                    {project.job.status === 'COMPLETED' && project.job.deliverableUrl && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <a
                          href={project.job.deliverableUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-semibold hover:bg-emerald-200 transition text-sm"
                        >
                          <FileText size={16} />
                          View Submitted
                        </a>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12 border-dashed border-2 border-gray-300">
                <Briefcase size={40} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600 font-medium">No active projects yet</p>
                <p className="text-sm text-gray-500 mt-1">Start bidding on jobs to get started!</p>
              </Card>
            )}
          </div>

          {/* Pending Bids */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock size={28} className="text-amber-600" />
              Pending Bids
            </h2>
            {pendingBids.length > 0 ? (
              <div className="space-y-3">
                {pendingBids.map((bid) => (
                  <Card key={bid.id} padding="md" className="border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900">{bid.job.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">Bid amount: ${bid.bidAmount}</p>
                      </div>
                      <Clock size={20} className="text-amber-500 flex-shrink-0" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12 border-dashed border-2 border-gray-300">
                <Clock size={40} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600 font-medium">No pending bids</p>
                <p className="text-sm text-gray-500 mt-1">Your proposals are awaiting client response</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;