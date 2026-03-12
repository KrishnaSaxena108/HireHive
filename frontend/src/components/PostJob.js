import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react/index.js';
import { useNavigate } from 'react-router-dom';
import { Briefcase, DollarSign, FileText, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

const CREATE_JOB = gql`
  mutation CreateJob($title: String!, $description: String!, $budget: Float!) {
    createJob(title: $title, description: $description, budget: $budget) {
      id
      title
      budget
      status
    }
  }
`;

const CATEGORIES = [
  'Web Development', 'Mobile Development', 'Design & Creative',
  'Writing & Translation', 'Marketing & SEO', 'Data & Analytics',
  'DevOps & Cloud', 'AI / Machine Learning', 'Video & Animation', 'Other',
];

const PostJob = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    budget: '',
    category: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const [createJob, { loading }] = useMutation(CREATE_JOB, {
    onCompleted: () => {
      setSuccess(true);
      setTimeout(() => navigate('/client-dashboard'), 2500);
    },
    onError: (err) => {
      setErrors({ server: err.message });
    },
  });

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Job title is required.';
    if (!form.description.trim()) e.description = 'Description is required.';
    else if (form.description.trim().length < 50)
      e.description = 'Please provide at least 50 characters of detail.';
    if (!form.budget) e.budget = 'Budget is required.';
    else if (isNaN(form.budget) || Number(form.budget) <= 0)
      e.budget = 'Enter a valid positive number.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }

    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    createJob({
      variables: {
        title: form.title.trim(),
        description: form.description.trim(),
        budget: parseFloat(form.budget),
      },
    });
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Job Posted!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Your job is live. Freelancers can now discover and apply.
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500">Redirecting to your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Post a New Job</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Hire the best freelancers on HireHive</p>
          </div>
        </div>
      </div>

      {/* Server Error */}
      {errors.server && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <p className="text-sm text-rose-700 dark:text-rose-300">{errors.server}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Job Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. React Developer for E-commerce Platform"
            className={`input-field ${errors.title ? 'border-rose-400 focus:ring-rose-400' : ''}`}
          />
          {errors.title && (
            <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />{errors.title}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select a category (optional)</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Job Description <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={7}
              placeholder="Describe the project scope, deliverables, required skills, timeline, and any other relevant details..."
              className={`input-field resize-none ${errors.description ? 'border-rose-400 focus:ring-rose-400' : ''}`}
            />
            <span className="absolute bottom-3 right-3 text-xs text-slate-400 dark:text-slate-500">
              {form.description.length} chars
            </span>
          </div>
          {errors.description && (
            <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />{errors.description}
            </p>
          )}
          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
            Minimum 50 characters. Be specific to attract the right talent.
          </p>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Budget (USD) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="number"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              min="1"
              step="1"
              placeholder="500"
              className={`input-field pl-9 ${errors.budget ? 'border-rose-400 focus:ring-rose-400' : ''}`}
            />
          </div>
          {errors.budget && (
            <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />{errors.budget}
            </p>
          )}
          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
            Enter your total project budget. You can negotiate with applicants later.
          </p>
        </div>

        {/* Tips Card */}
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl border border-indigo-100 dark:border-indigo-900">
          <div className="flex gap-3">
            <FileText className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-1">Tips for a great posting</p>
              <ul className="text-xs text-indigo-600 dark:text-indigo-400 space-y-1 list-disc list-inside">
                <li>Be specific about required skills (e.g. React 18, TypeScript)</li>
                <li>Mention expected timeline or deadline</li>
                <li>Include any design assets or references if available</li>
                <li>Set a realistic budget to attract quality proposals</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Posting…
              </>
            ) : (
              <>
                <Briefcase className="w-4 h-4" />
                Post Job
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
