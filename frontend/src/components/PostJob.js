import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react/index.js'; // The fixed import path
import { useNavigate } from 'react-router-dom';
import { Rocket, DollarSign, AlignLeft, Type, ArrowRight } from 'lucide-react';

const CREATE_JOB = gql`
  mutation CreateJob($title: String!, $description: String!, $budget: Float!, $category: String) {
    createJob(title: $title, description: $description, budget: $budget, category: $category) {
      id
      title
      category
      status
    }
  }
`;

const CATEGORIES = [
  { value: 'WEB_DEV', label: '💻 Web Development' },
  { value: 'MOBILE_DEV', label: '📱 Mobile Development' },
  { value: 'DESIGN', label: '🎨 Design' },
  { value: 'WRITING', label: '✍️ Writing' },
  { value: 'MARKETING', label: '📢 Marketing' },
  { value: 'OTHER', label: '🔧 Other' }
];

const PostJob = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState('WEB_DEV');
  
  // NOTE: deadline and requiredSkills removed because they are not
  // supported by the CREATE_JOB backend schema (see typeDefs.js).
  
  const navigate = useNavigate();

  // 2. Initialize the Mutation Hook
  const [createJob, { loading, error }] = useMutation(CREATE_JOB, {
    onCompleted: () => {
      alert("Project Launched Successfully! 🚀");
      navigate('/client-dashboard'); // Redirect client to their dashboard after posting
    },
    onError: (err) => alert(`Launch Failed: ${err.message}`)
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Launching project..."); 
    
    // 3. Execute the Mutation
    await createJob({ 
      variables: { 
        title, 
        description, 
        budget: parseFloat(budget),
        category
      } 
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 md:px-6">
      <div className="ui-glass rounded-3xl p-10 border border-slate-100">
        <h2 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
          <Rocket className="text-teal-600" /> Post a New Project
        </h2>
        <p className="text-slate-600 mb-8">Craft a clear brief and attract high-quality proposals faster.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
              <Type size={16}/> Project Title
            </label>
            <input 
              required
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build a Food Delivery App" 
              className="w-full p-4 bg-white/90 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
              <AlignLeft size={16}/> Description
            </label>
            <textarea 
              required
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the project requirements..." 
              className="w-full p-4 bg-white/90 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition"
            ></textarea>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
              🏷️ Category
            </label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-4 bg-white/90 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
              <DollarSign size={16}/> Budget (USD)
            </label>
            <input 
              required
              type="number" 
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="500" 
              className="w-full p-4 bg-white/90 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition"
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg">{error.message}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-teal-100 hover:shadow-xl hover:shadow-teal-500/25 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Launching..." : <><span>Launch Project</span><ArrowRight size={20}/></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
