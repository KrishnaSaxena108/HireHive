import React, { useEffect, useMemo, useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react/index.js';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Star } from 'lucide-react';

const SUBMIT_REVIEW = gql`
  mutation SubmitReview($revieweeId: ID!, $jobId: ID!, $rating: Int!, $comment: String) {
    submitReview(revieweeId: $revieweeId, jobId: $jobId, rating: $rating, comment: $comment) {
      id
      rating
    }
  }
`;

const GET_CLIENT_COMPLETED_JOBS = gql`
  query GetClientCompletedJobs {
    jobs {
      id
      title
      status
      client {
        id
      }
      proposals {
        id
        status
        freelancer {
          id
          username
        }
      }
    }
  }
`;

const GET_REVIEWS_BY_JOB = gql`
  query GetReviewsByJob($jobId: ID!) {
    reviewsByJob(jobId: $jobId) {
      id
      rating
      comment
      reviewer {
        id
        username
      }
      createdAt
    }
  }
`;

const SubmitReview = () => {
  const [form, setForm] = useState({ revieweeId: '', jobId: '', rating: 5, comment: '' });
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const queryJobId = searchParams.get('jobId');
  const queryRevieweeId = searchParams.get('revieweeId');

  const { loading: jobsLoading, error: jobsError, data: jobsData } = useQuery(GET_CLIENT_COMPLETED_JOBS);
  const { data: reviewsData } = useQuery(GET_REVIEWS_BY_JOB, {
    variables: { jobId: form.jobId },
    skip: !form.jobId
  });

  const completedTargets = useMemo(() => {
    const jobs = jobsData?.jobs || [];
    return jobs
      .filter((job) => job.client?.id === userId && job.status === 'COMPLETED')
      .map((job) => {
        const acceptedProposal = (job.proposals || []).find((proposal) => proposal.status === 'ACCEPTED');
        if (!acceptedProposal?.freelancer?.id) return null;
        return {
          jobId: job.id,
          jobTitle: job.title,
          revieweeId: acceptedProposal.freelancer.id,
          freelancerUsername: acceptedProposal.freelancer.username || 'Unknown Freelancer'
        };
      })
      .filter(Boolean);
  }, [jobsData, userId]);

  useEffect(() => {
    if (!completedTargets.length) return;

    const alreadySelected = selectedTarget && completedTargets.some(
      (target) => target.jobId === selectedTarget.jobId && target.revieweeId === selectedTarget.revieweeId
    );
    if (alreadySelected) return;

    let initialTarget = null;
    if (queryJobId && queryRevieweeId) {
      initialTarget = completedTargets.find(
        (target) => target.jobId === queryJobId && target.revieweeId === queryRevieweeId
      );
    }
    if (!initialTarget && queryJobId) {
      initialTarget = completedTargets.find((target) => target.jobId === queryJobId);
    }
    if (!initialTarget && queryRevieweeId) {
      initialTarget = completedTargets.find((target) => target.revieweeId === queryRevieweeId);
    }
    if (!initialTarget) {
      initialTarget = completedTargets[0];
    }

    setSelectedTarget(initialTarget);
    setForm((prev) => ({
      ...prev,
      revieweeId: initialTarget.revieweeId,
      jobId: initialTarget.jobId
    }));
  }, [completedTargets, queryJobId, queryRevieweeId, selectedTarget]);

  const existingMyReview = (reviewsData?.reviewsByJob || []).find(
    (review) => String(review.reviewer?.id) === String(userId)
  );

  const [submitReview, { loading, error }] = useMutation(SUBMIT_REVIEW, {
    onCompleted: () => {
      alert('Review submitted!');
      navigate('/client-dashboard');
    }
  });

  const handleTargetSelect = (target) => {
    setSelectedTarget(target);
    setForm({
      ...form,
      revieweeId: target.revieweeId,
      jobId: target.jobId
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.jobId || !form.revieweeId) {
      alert('Please select a project');
      return;
    }
    if (existingMyReview) {
      alert('You already reviewed this project.');
      return;
    }
    submitReview({ variables: { ...form, rating: parseInt(form.rating, 10) } });
  };

  const jobReviews = reviewsData?.reviewsByJob || [];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100 mb-8">
          <h2 className="text-3xl font-bold mb-2 text-slate-900">Submit a Review</h2>
          <p className="text-slate-600 mb-8">Rate the freelancer you hired after project completion.</p>

          {jobsLoading && (
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-200 text-indigo-700 mb-6">
              <p>Loading completed projects...</p>
            </div>
          )}

          {jobsError && (
            <div className="bg-red-50 p-6 rounded-2xl border border-red-200 text-red-700 mb-6">
              <p>Error loading review targets: {jobsError.message}</p>
            </div>
          )}

          {!jobsLoading && !jobsError && completedTargets.length === 0 ? (
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200 text-blue-700">
              <p>You do not have any completed projects with hired freelancers to review yet.</p>
            </div>
          ) : !jobsLoading && !jobsError ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Selection */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Select Project</label>
                <div className="grid gap-3 max-h-60 overflow-y-auto">
                  {completedTargets.map((target) => (
                    <button
                      key={`${target.jobId}-${target.revieweeId}`}
                      type="button"
                      onClick={() => handleTargetSelect(target)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedTarget?.jobId === target.jobId && selectedTarget?.revieweeId === target.revieweeId
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-slate-300 bg-white hover:border-indigo-400'
                      }`}
                    >
                      <p className="font-bold text-slate-900">{target.jobTitle}</p>
                      <p className="text-sm text-slate-600">Freelancer: @{target.freelancerUsername}</p>
                    </button>
                  ))}
                </div>
              </div>

              {selectedTarget && (
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

                  {existingMyReview && (
                    <p className="text-amber-700 text-sm bg-amber-50 p-3 rounded-lg border border-amber-200">
                      You have already submitted a review for this project.
                    </p>
                  )}

                  {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error.message}</p>}

                  <button
                    disabled={loading || !!existingMyReview}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {loading ? 'Submitting…' : 'Submit Review'}
                  </button>
                </>
              )}
            </form>
          ) : null}
        </div>

        {/* Existing Reviews For Selected Job */}
        {form.jobId && jobReviews.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Reviews For This Project</h3>
            <div className="space-y-4">
              {jobReviews.map((review) => (
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
