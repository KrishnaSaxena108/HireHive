import React, { useState } from 'react';
import { User, DollarSign, Award, Link as LinkIcon } from 'lucide-react';
import ProfilePictureUpload from './ProfilePictureUpload';
import PortfolioUpload from './PortfolioUpload';

const CreateProfile = () => {
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
    hourlyRate: '',
    portfolioUrl: ''
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-indigo-600 p-8 text-white">
          <h2 className="text-3xl font-black">Create Your Professional Profile</h2>
          <p className="text-indigo-100 mt-2 text-lg">Tell clients why you're the perfect fit.</p>
        </div>

        <form className="p-10 space-y-8">
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
              className="w-full p-4 h-40 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all"
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Skills Section */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-slate-700 font-bold">
                <Award size={18} /> Skills (Comma separated)
              </label>
              <input 
                type="text" placeholder="React, Node.js, Design..."
                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all"
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
              />
            </div>

            {/* Hourly Rate */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-slate-700 font-bold">
                <DollarSign size={18} /> Hourly Rate ($)
              </label>
              <input 
                type="number" placeholder="25"
                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all"
                onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
              />
            </div>
          </div>

          {/* Portfolio Upload */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-slate-700 font-bold mb-4">
              <LinkIcon size={18} /> Portfolio File (PDF/Word)
            </label>
            <PortfolioUpload />
          </div>

          <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl text-xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
            Save Professional Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;