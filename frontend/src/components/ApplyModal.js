import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react/index.js';
import { X, Send, DollarSign, AlertCircle } from 'lucide-react';

const SUBMIT_PROPOSAL = gql`
  mutation SubmitProposal($jobId: ID!, $coverLetter: String!, $bidAmount: Float!) {
    submitProposal(jobId: $jobId, coverLetter: $coverLetter, bidAmount: $bidAmount) {
      id
      status
    }
  }
`;

const ApplyModal = ({ job, isOpen, onClose }) => {
  const [formData, setFormData] = useState({ coverLetter: '', bidAmount: '' });

  const [submitProposal, { loading, error }] = useMutation(SUBMIT_PROPOSAL, {
    onCompleted: () => {
      alert("Proposal Sent! The client has been notified.");
      onClose();
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    submitProposal({
      variables: {
        jobId: job.id,
        coverLetter: formData.coverLetter,
        bidAmount: parseFloat(formData.bidAmount)
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg h-full p-8 shadow-2xl flex flex-col animate-slide-in">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900">Submit Proposal</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        <div className="bg-indigo-50 p-4 rounded-2xl mb-8 border border-indigo-100">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">Applying for:</p>
          <h3 className="text-lg font-bold text-slate-800">{job.title}</h3>
          <p className="text-sm text-slate-500">Client Budget: ${job.budget}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 flex-grow">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Your Bid Amount ($)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3.5 text-slate-400" size={20} />
              <input 
                required type="number" placeholder="Enter your bid..."
                className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all"
                onChange={(e) => setFormData({...formData, bidAmount: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Cover Letter</label>
            <textarea 
              required placeholder="Explain why you are the best fit for this project..."
              className="w-full p-4 h-64 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all"
              onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              <AlertCircle size={16} /> {error.message}
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Sending..." : <><Send size={18} /> Send Proposal</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;