import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react/index.js';
import { useNavigate } from 'react-router-dom';

const SUBMIT_REVIEW = gql`
  mutation SubmitReview($revieweeId: ID!, $jobId: ID!, $rating: Int!, $comment: String) {
    submitReview(revieweeId: $revieweeId, jobId: $jobId, rating: $rating, comment: $comment) {
      id
      rating
    }
  }
`;

const SubmitReview = () => {
  const [form, setForm] = useState({ revieweeId: '', jobId: '', rating: 5, comment: '' });
  const [submitReview, { loading, error }] = useMutation(SUBMIT_REVIEW, {
    onCompleted: () => {
      alert('Review submitted!');
      navigate('/');
    }
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    submitReview({ variables: { ...form, rating: parseInt(form.rating) } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl">
        <h2 className="text-2xl font-bold mb-6">Submit a Review</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required type="number" placeholder="Reviewee User ID"
            className="w-full p-3 border rounded-lg"
            onChange={e=>setForm({...form, revieweeId: e.target.value})}
          />
          <input
            required type="number" placeholder="Job ID"
            className="w-full p-3 border rounded-lg"
            onChange={e=>setForm({...form, jobId: e.target.value})}
          />
          <div>
            <label className="block mb-1">Rating</label>
            <select
              className="w-full p-3 border rounded-lg"
              value={form.rating}
              onChange={e=>setForm({...form, rating: e.target.value})}
            >
              {[1,2,3,4,5].map(n=><option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <textarea
            placeholder="Comment (optional)"
            className="w-full p-3 border rounded-lg h-32"
            onChange={e=>setForm({...form, comment: e.target.value})}
          />

          {error && <p className="text-red-500">{error.message}</p>}

          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
          >
            {loading ? 'Submitting…' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitReview;
