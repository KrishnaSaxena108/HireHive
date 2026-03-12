import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react/index.js';
import { X, Send, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';

const SUBMIT_PROPOSAL = gql`
  mutation SubmitProposal($jobId: ID!, $coverLetter: String!, $bidAmount: Float!) {
    submitProposal(jobId: $jobId, coverLetter: $coverLetter, bidAmount: $bidAmount) {
      id status
    }
  }
`;

const ApplyModal = ({ job, isOpen, onClose }) => {
  const [formData, setFormData] = useState({ coverLetter: '', bidAmount: '' });
  const [submitted, setSubmitted] = useState(false);

  const [submitProposal, { loading, error }] = useMutation(SUBMIT_PROPOSAL, {
    onCompleted: () => setSubmitted(true),
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    submitProposal({
      variables: { jobId: job.id, coverLetter: formData.coverLetter, bidAmount: parseFloat(formData.bidAmount) },
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg h-full shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Submit Proposal</h2>
            <p className="text-sm text-slate-500 mt-0.5">Stand out with a personalized pitch</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {submitted ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5">
              <CheckCircle className="text-emerald-600" size={40} />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Proposal Sent!</h3>
            <p className="text-slate-500 mb-6">The client has been notified. Good luck!</p>
            <button onClick={onClose} className="btn-primary">Close</button>
          </div>
        ) : (
          <>
            {/* Job info */}
            <div className="p-6 bg-slate-50 border-b border-slate-100">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">Applying for</p>
              <h3 className="font-bold text-slate-900">{job.title}</h3>
              <p className="text-sm text-slate-500 mt-0.5">Client Budget: <span className="font-semibold text-slate-700">${Number(job.budget).toLocaleString()}</span></p>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Your Bid Amount (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input required type="number" min="1" step="0.01" placeholder="Enter your bid..."
                    className="input-field pl-10"
                    onChange={(e) => setFormData({ ...formData, bidAmount: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Cover Letter</label>
                <textarea required rows={8}
                  placeholder="Introduce yourself and explain why you're the best fit. Mention relevant experience and how you'd approach this project..."
                  className="input-field resize-none"
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })} />
                <p className="text-xs text-slate-400 mt-1">Tip: Personalized proposals get 3Ã— more responses.</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl">
                  <AlertCircle size={16} className="shrink-0" /> {error.message}
                </div>
              )}

              <button disabled={loading} type="submit" className="btn-primary w-full py-3.5 text-base">
                {loading ? 'Submitting...' : <><Send size={16} /> Send Proposal</>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ApplyModal;
