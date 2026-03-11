import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react/index.js';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

const SUBMIT_REVIEW = gql`
  mutation SubmitReview($revieweeId: ID!, $jobId: ID!, $rating: Int!, $comment: String) {
    submitReview(revieweeId: $revieweeId, jobId: $jobId, rating: $rating, comment: $comment) {
      id
      rating
    }
  }
`;

const GET_MY_PROPOSALS = gql`
  query GetMyProposals {
    myProposals {
      id
      status
      job {
        id
        title
        status
      }
      freelancer {
        id
        username
      }
    }
  }
`;

const GET_PAST_REVIEWS = gql`
  query GetPastReviews($revieweeId: ID!) {
    pastReviews(revieweeId: $revieweeId) {
      id
      rating
      comment
      reviewer {
        username
      }
      createdAt
    }
  }
`;

const SubmitReview = () => {
  const [form, setForm] = useState({ revieweeId: '', jobId: '', rating: 5, comment: '' });
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();

  const { data: proposalsData } = useQuery(GET_MY_PROPOSALS);
  const { data: reviewsData } = useQuery(GET_PAST_REVIEWS, {
    variables: { revieweeId: form.revieweeId || 'null' },
    skip: !form.revieweeId
  });

  const [submitReview, { loading, error }] = useMutation(SUBMIT_REVIEW, {
    onCompleted: () => {
      alert('Review submitted!');
      navigate('/');
    }
  });

  const handleJobSelect = (proposal) => {
    setSelectedJob(proposal);
    setForm({
      ...form,
      revieweeId: proposal.freelancer.id,
      jobId: proposal.job.id
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.jobId || !form.revieweeId) {
      alert('Please select a project');
      return;
    }
    submitReview({ variables: { ...form, rating: parseInt(form.rating) } });
  };

  const completedProposals = (proposalsData?.myProposals || []).filter(
    p => p.status === 'COMPLETED' || p.job.status === 'COMPLETED'
  );

  const pastReviews = reviewsData?.pastReviews || [];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100 mb-8">
          <h2 className="text-3xl font-bold mb-2 text-slate-900">Submit a Review</h2>
          <p className="text-slate-600 mb-8">Share your experience working with freelancers to help the community.</p>

          {completedProposals.length === 0 ? (
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200 text-blue-700">
              <p>You don't have any completed projects to review yet.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Selection */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Select Project</label>
                <div className="grid gap-3 max-h-60 overflow-y-auto">
                  {completedProposals.map((proposal) => (
                    <button
                      key={proposal.id}
                      type="button"
                      onClick={() => handleJobSelect(proposal)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedJob?.id === proposal.id
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-slate-300 bg-white hover:border-indigo-400'
                      }`}
                    >
                      <p className="font-bold text-slate-900">{proposal.job.title}</p>
                      <p className="text-sm text-slate-600">Freelancer: @{proposal.freelancer.username}</p>
                    </button>
                  ))}
                </div>
              </div>

              {selectedJob && (
                <>
                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setForm({ ...form, rating: star })}
                          className="transition-all"
                        >
                          <Star
                            size={32}
                            className={`${
                              star <= form.rating
                                ? 'fill-yellow-500 text-yellow-500'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Review (Optional)</label>
                    <textarea
                      placeholder="Share your experience working with this freelancer..."
                      className="w-full p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                      rows="5"
                      value={form.comment}
                      onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error.message}</p>}

                  <button
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {loading ? 'Submitting…' : 'Submit Review'}
                  </button>
                </>
              )}
            </form>
          )}
        </div>

        {/* Past Reviews Section */}
        {form.revieweeId && pastReviews.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Reviews for @{selectedJob?.freelancer.username}</h3>
            <div className="space-y-4">
              {pastReviews.map((review) => (
                <div key={review.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-slate-900">@{review.reviewer.username}</p>
                    <div className="flex gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} size={16} className="fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm">{review.comment}</p>
                  <p className="text-xs text-slate-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitReview;
