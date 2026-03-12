import React, { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react/index.js';
import { useNavigate } from 'react-router-dom';
import { User, DollarSign, Award, Link as LinkIcon, Briefcase, Loader } from 'lucide-react';
import ProfilePictureUpload from './ProfilePictureUpload';
import PortfolioUpload from './PortfolioUpload';

const GET_MY_PROFILE = gql`
  query GetMyProfile {
    me {
      id
      username
      profilePictureUrl
      profile {
        id
        bio
        skills
        hourlyRate
        category
        portfolioUrl
      }
    }
  }
`;

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($bio: String, $skills: String, $hourlyRate: Float, $category: String) {
    updateProfile(bio: $bio, skills: $skills, hourlyRate: $hourlyRate, category: $category) {
      id
      bio
      skills
      hourlyRate
      category
    }
  }
`;

const CreateProfile = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
    hourlyRate: '',
    category: 'OTHER',
    availability: 'PART_TIME'
  });

  const { data: profileData, loading: profileLoading } = useQuery(GET_MY_PROFILE);

  const [updateProfile, { loading: saving }] = useMutation(UPDATE_PROFILE, {
    onCompleted: () => {
      alert('Profile saved successfully!');
      // Redirect based on role
      if (userRole === 'CLIENT') {
        navigate('/client-dashboard');
      } else {
        navigate('/freelancer-dashboard');
      }
    },
    onError: (err) => {
      alert('Failed to save profile: ' + err.message);
    }
  });

  // Load existing profile data if available
  useEffect(() => {
    if (profileData?.me?.profile) {
      const profile = profileData.me.profile;
      setFormData({
        bio: profile.bio || '',
        skills: profile.skills || '',
        hourlyRate: profile.hourlyRate ? String(profile.hourlyRate) : '',
        category: profile.category || 'OTHER',
        availability: 'PART_TIME'
      });
    }
  }, [profileData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    updateProfile({
      variables: {
        bio: formData.bio || null,
        skills: formData.skills || null,
        hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
        category: formData.category || 'OTHER'
      }
    });
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader className="animate-spin text-teal-600" size={32} />
      </div>
    );
  }

  const isEditing = !!profileData?.me?.profile;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto ui-glass rounded-3xl overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-8 text-white">
          <h2 className="text-3xl font-black">{isEditing ? 'Edit Your Profile' : 'Create Your Professional Profile'}</h2>
          <p className="text-teal-50 mt-2 text-lg">Tell clients why you're the perfect fit.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {/* Profile Picture Upload */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-slate-700 font-bold mb-4">
              <User size={18} /> Profile Picture
            </label>
            <ProfilePictureUpload />
          </div>

          {/* Bio Section */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-slate-700 font-bold">
              <User size={18} /> Professional Bio
            </label>
            <textarea 
              placeholder="Describe your experience and what you can offer..."
              className="w-full p-4 h-40 rounded-2xl border border-slate-200 bg-white/90 focus:ring-4 focus:ring-teal-100 focus:border-teal-600 outline-none transition-all"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-slate-700 font-bold">
              <Briefcase size={18} /> Primary Category / Specialty
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full p-4 rounded-xl border border-slate-200 bg-white/90 focus:ring-4 focus:ring-teal-100 focus:border-teal-600 outline-none transition-all"
            >
              <option value="WEB_DEV">Web Development</option>
              <option value="MOBILE_DEV">Mobile Development</option>
              <option value="DESIGN">Design</option>
              <option value="WRITING">Writing</option>
              <option value="MARKETING">Marketing</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Skills Section */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-slate-700 font-bold">
                <Award size={18} /> Skills (Comma separated)
              </label>
              <input 
                type="text" 
                placeholder="React, Node.js, Design..."
                className="w-full p-4 rounded-xl border border-slate-200 bg-white/90 focus:ring-4 focus:ring-teal-100 focus:border-teal-600 outline-none transition-all"
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
              />
            </div>

            {/* Hourly Rate */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-slate-700 font-bold">
                <DollarSign size={18} /> Hourly Rate ($)
              </label>
              <input 
                type="number" 
                placeholder="25"
                className="w-full p-4 rounded-xl border border-slate-200 bg-white/90 focus:ring-4 focus:ring-teal-100 focus:border-teal-600 outline-none transition-all"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
              />
            </div>
          </div>

          {/* Availability Section */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-slate-700 font-bold">
              ⏰ Availability
            </label>
            <select
              value={formData.availability}
              onChange={(e) => setFormData({...formData, availability: e.target.value})}
              className="w-full p-4 rounded-xl border border-slate-200 bg-white/90 focus:ring-4 focus:ring-teal-100 focus:border-teal-600 outline-none transition-all"
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract Based</option>
              <option value="AS_NEEDED">As Needed</option>
            </select>
          </div>

          {/* Portfolio Upload */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-slate-700 font-bold mb-4">
              <LinkIcon size={18} /> Portfolio File (PDF/Word)
            </label>
            <PortfolioUpload />
          </div>

          <button 
            type="submit"
            disabled={saving}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-4 rounded-2xl text-xl font-black shadow-xl shadow-teal-100 hover:shadow-2xl hover:shadow-teal-500/25 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {saving ? (
              <>
                <Loader className="animate-spin" size={24} />
                Saving...
              </>
            ) : (
              isEditing ? 'Update Profile' : 'Save Professional Profile'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;