import React from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react/index.js';
import { DollarSign, Briefcase, FileText, Bell, CheckCircle, Clock } from 'lucide-react';

// 1. Query to fetch only THIS freelancer's proposals and jobs
const GET_FREELANCER_DASHBOARD = gql`
  query GetFreelancerDashboard {
    myProposals {  
      id
      status
      bidAmount
      job {
        id
        title
        status
        budget
      }
    }
  }
`;

// ... (imports and query stay the same)

const FreelancerDashboard = () => {
  const { loading, error, data } = useQuery(GET_FREELANCER_DASHBOARD);

  if (loading) return <div className="p-10 text-center animate-pulse text-blue-600 font-bold">Loading Freelancer Stats...</div>;
  if (error) return <div className="p-10 text-center text-red-500 bg-red-50 rounded-xl">Error: {error.message}</div>;

  // --- 3. FIXED LOGIC: Use 'myProposals' to match the query above ---
  const activeProjects = data?.myProposals?.filter(p => p.status === 'ACCEPTED') || [];
  const pendingBids = data?.myProposals?.filter(p => p.status === 'PENDING') || [];

  const stats = [
    { 
      label: 'Total Earnings', 
      value: `$${activeProjects.reduce((acc, curr) => acc + (curr.bidAmount || 0), 0).toLocaleString()}`, 
      icon: <DollarSign />, 
      color: 'bg-green-500' 
    },
    { label: 'Active Projects', value: activeProjects.length, icon: <Briefcase />, color: 'bg-blue-500' },
    { label: 'Pending Bids', value: pendingBids.length, icon: <FileText />, color: 'bg-orange-500' },
    { label: 'Notifications', value: '5', icon: <Bell />, color: 'bg-purple-500' },
  ];

  // ... (rest of the return statement stays exactly the same)

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Freelancer Workspace</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
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
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <CheckCircle className="text-blue-500" size={20}/> Active Projects
          </h3>
          {activeProjects.length > 0 ? (
            <div className="space-y-4">
              {activeProjects.map((p) => (
                <div key={p.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-900">{p.job.title}</h4>
                    <p className="text-sm text-slate-500">Earnings: ${p.bidAmount}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">IN PROGRESS</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-10">No active projects yet. Start bidding!</p>
          )}
        </div>
        
        {/* Pending Bids Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
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