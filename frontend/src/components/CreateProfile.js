import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react/index.js';
import { User, DollarSign, Award, Link as LinkIcon, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($bio: String, $skills: String, $hourlyRate: Float) {
    updateProfile(bio: $bio, skills: $skills, hourlyRate: $hourlyRate) {
      id bio skills hourlyRate
    }
  }
`;

const CreateProfile = () => {
  const [formData, setFormData] = useState({ bio: '', skills: '', hourlyRate: '', portfolioUrl: '' });
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  const [updateProfile, { loading, error }] = useMutation(UPDATE_PROFILE, {
    onCompleted: () => {
      setSaved(true);
      setTimeout(() => navigate('/freelancer-dashboard'), 1800);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({ variables: {
      bio: formData.bio,
      skills: formData.skills,
      hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
    }});
  };

  return (
    <div className="page-wrapper py-12">
      <Link to="/freelancer-dashboard" className="btn-ghost mb-6 inline-flex"><ArrowLeft size={16} /> Back to Dashboard</Link>
      <div className="max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-heading">Professional Profile</h1>
          <p className="text-slate-500 mt-2">A complete profile gets 5Ã— more invitations from clients.</p>
        </div>

        <div className="card p-8">
          {saved ? (
            <div className="py-12 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="text-emerald-600" size={32} />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-1">Profile Saved!</h2>
              <p className="text-slate-500 text-sm">Redirecting to your dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <User size={14} className="text-indigo-500" /> Professional Bio
                </label>
                <textarea rows={5} placeholder="Describe your experience, expertise, and what makes you unique. Clients read this first."
                  className="input-field resize-none"
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
                <p className="text-xs text-slate-400 mt-1">{formData.bio.length}/500</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <Award size={14} className="text-indigo-500" /> Skills
                  </label>
                  <input type="text" placeholder="React, Node.js, UI Design, Python..."
                    className="input-field"
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })} />
                  <p className="text-xs text-slate-400 mt-1">Separate with commas</p>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <DollarSign size={14} className="text-indigo-500" /> Hourly Rate (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">$</span>
                    <input type="number" min="1" placeholder="50"
                      className="input-field pl-8"
                      onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })} />
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <LinkIcon size={14} className="text-indigo-500" /> Portfolio / GitHub URL
                </label>
                <input type="url" placeholder="https://github.com/yourprofile"
                  className="input-field"
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })} />
              </div>

              {error && (
                <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-1 shrink-0" />
                  {error.message}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary py-3.5 px-8 text-base">
                {loading ? <><Loader2 className="animate-spin" size={18} /> Saving...</> : <><CheckCircle size={18} /> Save Profile</>}
              </button>
            </form>
          )}
        </div>

        {/* Tips */}
        <div className="mt-5 card p-6 bg-indigo-50 border-indigo-100">
          <p className="text-sm font-semibold text-indigo-800 mb-3">Profile Completion Tips</p>
          <div className="grid sm:grid-cols-3 gap-3 text-sm text-indigo-700">
            {['Add a detailed bio to build trust', 'List specific technical skills', 'Set a competitive hourly rate'].map((t) => (
              <div key={t} className="flex items-start gap-2">
                <CheckCircle size={14} className="mt-0.5 shrink-0" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
