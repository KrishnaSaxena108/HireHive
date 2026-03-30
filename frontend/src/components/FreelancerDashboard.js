import React, { useEffect, useState, useRef } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react/index.js';
import { DollarSign, Briefcase, FileText, Bell, CheckCircle, Clock, Upload, Loader, Star } from 'lucide-react';
import { Button, Card, Badge, StatCard } from './ui';
import { socket } from '../socket';

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

const FreelancerDashboard = () => {
  const userId = localStorage.getItem('userId');
  const [uploadingJobId, setUploadingJobId] = useState(null);
  
  // Create a ref to access the hidden file input
  const fileInputRef = useRef(null);

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
      const handleUpdate = () => refetch();
      socket.on('proposal_accepted', handleUpdate);
      socket.on('notification', handleUpdate);

      return () => {
        socket.off('proposal_accepted', handleUpdate);
        socket.off('notification', handleUpdate);
      };
    }
  }, [userId, refetch]);

  if (loading) return <div className="p-10 text-center animate-pulse text-teal-600 font-bold">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-500 bg-red-50 rounded-xl">Error: {error.message}</div>;

  const averageRating = data?.me?.averageRating || 0;
  const activeProjects = data?.myProposals?.filter(p => p.status === 'ACCEPTED') || [];
  const pendingBids = data?.myProposals?.filter(p => p.status === 'PENDING') || [];
  const unreadNotificationsCount = data?.notifications?.filter(n => !n.isRead).length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
        
        {/* Header & Stats */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Freelancer Workspace</h1>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className={i < Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
            ))}
            <span className="ml-2 font-bold">{averageRating.toFixed(1)} / 5</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard icon={DollarSign} label="Total Earnings" value={`$${activeProjects.reduce((acc, curr) => acc + (curr.bidAmount || 0), 0)}`} backgroundColor="bg-emerald-50" iconColor="text-emerald-600" />
          <StatCard icon={Briefcase} label="Active Projects" value={activeProjects.length} backgroundColor="bg-blue-50" iconColor="text-blue-600" />
          <StatCard icon={Clock} label="Pending Bids" value={pendingBids.length} backgroundColor="bg-amber-50" iconColor="text-amber-600" />
          <StatCard icon={Bell} label="Notifications" value={unreadNotificationsCount} backgroundColor="bg-purple-50" iconColor="text-purple-600" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Active Projects Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><CheckCircle className="text-blue-600" /> Active Projects</h2>
            {activeProjects.length > 0 ? (
              <div className="space-y-4">
                {activeProjects.map((project) => (
                  <Card key={project.id} className="border-l-4 border-l-blue-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg">{project.job.title}</h4>
                        <p className="text-sm text-gray-600">Earnings: ${project.bidAmount}</p>
                      </div>
                      <Badge variant={project.job.status === 'COMPLETED' ? 'success' : 'primary'}>
                        {project.job.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
                      </Badge>
                    </div>

                    {/* ACTION AREA */}
                    {project.job.status !== 'COMPLETED' && (
                      <div className="mt-4 pt-4 border-t">
                        <Button 
                          variant="primary" 
                          fullWidth 
                          onClick={() => fileInputRef.current.click()} // Triggers the hidden input
                          disabled={uploadingJobId === project.job.id}
                        >
                          {uploadingJobId === project.job.id ? <Loader className="animate-spin" /> : <Upload size={16} />}
                          {uploadingJobId === project.job.id ? ' Uploading...' : ' Upload & Complete Project'}
                        </Button>
                        
                        <input
                          type="file"
                          ref={fileInputRef} // Linked to the button via Ref
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && window.confirm(`Upload "${file.name}"?`)) {
                              handleFileUpload(project.job.id, file);
                            }
                            e.target.value = ''; // Reset input
                          }}
                        />
                      </div>
                    )}

                    {project.job.status === 'COMPLETED' && project.job.deliverableUrl && (
                      <div className="mt-4 pt-4 border-t text-center">
                        <a href={project.job.deliverableUrl} target="_blank" rel="noreferrer" className="text-emerald-600 text-sm font-bold flex items-center justify-center gap-1">
                          <FileText size={14} /> View Submitted Work
                        </a>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-10 border-dashed border-2">No projects found.</Card>
            )}
          </div>

          {/* Pending Bids Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Clock className="text-amber-600" /> Pending Bids</h2>
            <div className="space-y-3">
              {pendingBids.map((bid) => (
                <Card key={bid.id} className="border-l-4 border-l-amber-500">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-bold">{bid.job.title}</h4>
                      <p className="text-sm text-gray-600">Bid: ${bid.bidAmount}</p>
                    </div>
                    <Clock size={18} className="text-amber-500" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;