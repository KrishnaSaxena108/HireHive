import React, { useMemo, useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react/index.js';
import { Rocket, ShieldCheck, Zap, Code, Palette, Pen, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GET_FEATURED_FREELANCERS = gql`
  query GetFeaturedFreelancers {
    searchFreelancers {
      id
      username
      averageRating
      profile {
        bio
        skills
        hourlyRate
      }
    }
  }
`;

const Home = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();
  const { data: freelancerData, loading: freelancerLoading } = useQuery(GET_FEATURED_FREELANCERS);

  const featuredFreelancers = useMemo(() => {
    const freelancers = freelancerData?.searchFreelancers || [];

    return [...freelancers]
      .sort((left, right) => {
        const ratingDiff = (right.averageRating || 0) - (left.averageRating || 0);
        if (ratingDiff !== 0) return ratingDiff;

        const leftRate = Number(left.profile?.hourlyRate || 0);
        const rightRate = Number(right.profile?.hourlyRate || 0);
        return rightRate - leftRate;
      })
      .slice(0, 3);
  }, [freelancerData]);

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      navigate(`/browse?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/browse?category=${category}`);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-indigo-900 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-black mb-6 leading-tight">
          Find the world's best <span className="text-indigo-400">Freelance Talent.</span>
        </h1>
        <p className="text-xl text-indigo-100 mb-6 max-w-2xl mx-auto">
          HireHive connects businesses with top-rated freelancers for any project, any size.
        </p>
        {/* login/join buttons */}
        <div className="mb-8">
          {(() => {
            const userId = localStorage.getItem('userId');
            if (userId) {
              return null; // already logged in; navbar shows logout
            }
            return (
              <div className="space-x-4">
                <a href="/login" className="text-white font-semibold hover:underline">
                  Login
                </a>
                <a href="/signup" className="bg-white text-indigo-600 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition">
                  Join
                </a>
              </div>
            );
          })()}
        </div>
        
        {/* Search Bar */}
        <div className="max-w-3xl mx-auto bg-white rounded-full p-2 flex shadow-2xl">
          <input 
            type="text" 
            placeholder="Search for 'Logo Design' or 'React Developer'..." 
            className="flex-grow px-6 py-3 text-gray-800 outline-none rounded-full"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button 
            onClick={handleSearch}
            className="bg-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-indigo-500 transition shadow-lg"
          >
            Search
          </button>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-black text-slate-900 mb-12 text-center">Browse by Category</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: '💻 Web Dev', value: 'WEB_DEV', icon: <Code className="w-8 h-8" /> },
            { label: '📱 Mobile', value: 'MOBILE_DEV', icon: <TrendingUp className="w-8 h-8" /> },
            { label: '🎨 Design', value: 'DESIGN', icon: <Palette className="w-8 h-8" /> },
            { label: '✍️ Writing', value: 'WRITING', icon: <Pen className="w-8 h-8" /> },
            { label: '📢 Marketing', value: 'MARKETING', icon: <TrendingUp className="w-8 h-8" /> },
            { label: '🔧 Other', value: 'OTHER', icon: <Code className="w-8 h-8" /> }
          ].map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryClick(cat.value)}
              className="bg-white border-2 border-slate-100 p-6 rounded-2xl text-center hover:border-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="text-3xl mb-2">{cat.label.split(' ')[0]}</div>
              <p className="font-semibold text-slate-700 text-sm">{cat.label.split(' ').slice(1).join(' ')}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Platform Stats Section */}
      <section className="bg-indigo-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-12 text-center">Why Choose HireHive?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-slate-100">
              <div className="text-5xl font-black text-indigo-600 mb-2">50K+</div>
              <p className="text-slate-600 font-semibold">Projects Completed</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-slate-100">
              <div className="text-5xl font-black text-green-600 mb-2">10K+</div>
              <p className="text-slate-600 font-semibold">Active Freelancers</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-slate-100">
              <div className="text-5xl font-black text-blue-600 mb-2">99%</div>
              <p className="text-slate-600 font-semibold">Client Satisfaction</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-slate-100">
              <div className="text-5xl font-black text-purple-600 mb-2">120+</div>
              <p className="text-slate-600 font-semibold">Countries Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
        <div>
          <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
            <Rocket size={32} />
          </div>
          <h3 className="text-xl font-bold mb-3">Post a Job</h3>
          <p className="text-gray-500">Describe your project and receive competitive proposals within minutes.</p>
        </div>
        <div>
          <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
            <ShieldCheck size={32} />
          </div>
          <h3 className="text-xl font-bold mb-3">Safe Payments</h3>
          <p className="text-gray-500">Funds are held in escrow and only released when you approve the work.</p>
        </div>
        <div>
          <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
            <Zap size={32} />
          </div>
          <h3 className="text-xl font-bold mb-3">Top Talent</h3>
          <p className="text-gray-500">Browse verified portfolios and reviews to find the perfect match.</p>
        </div>
      </section>

      {/* Featured Freelancers Section */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-black text-slate-900">Featured Freelancers</h2>
            <a href="/freelancers" className="text-indigo-600 font-bold hover:text-indigo-700">View All →</a>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {freelancerLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-pulse">
                  <div className="w-16 h-16 bg-slate-200 rounded-full mb-4 mx-auto"></div>
                  <div className="h-5 bg-slate-200 rounded w-2/3 mx-auto mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto mb-3"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/3 mx-auto mb-3"></div>
                  <div className="h-3 bg-slate-200 rounded w-5/6 mx-auto mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/3 mx-auto mb-4"></div>
                  <div className="h-10 bg-slate-200 rounded-lg w-full"></div>
                </div>
              ))
            ) : featuredFreelancers.length > 0 ? (
              featuredFreelancers.map((freelancer) => (
              <div key={freelancer.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Users className="text-indigo-600" size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 text-center mb-1">{freelancer.username}</h3>
                <p className="text-sm text-slate-600 text-center mb-3">
                  {freelancer.profile?.bio || 'Available for new work on HireHive'}
                </p>
                <div className="flex justify-center items-center gap-2 mb-3">
                  <span className="text-yellow-500 font-bold">★ {(freelancer.averageRating || 0).toFixed(1)}</span>
                  <span className="text-slate-500 text-sm">
                    {freelancer.profile?.hourlyRate ? `$${freelancer.profile.hourlyRate}/hr` : 'Rate on request'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 text-center mb-4">
                  {freelancer.profile?.skills || 'Skills not added yet'}
                </p>
                <button
                  onClick={() => navigate(`/messages?user=${freelancer.id}&username=${encodeURIComponent(freelancer.username)}`)}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition text-sm"
                >
                  Contact Freelancer
                </button>
              </div>
            ))) : (
              <div className="md:col-span-3 bg-white p-10 rounded-2xl shadow-sm border border-slate-100 text-center text-slate-500">
                No freelancers are available yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;