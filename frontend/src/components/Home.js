import React, { useMemo, useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react/index.js';
import { Rocket, ShieldCheck, Zap, Code, Palette, Pen, TrendingUp, Users, ArrowRight } from 'lucide-react';
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
    <div className="px-4 md:px-8 pb-8">
      {/* Hero Section */}
      <section className="ui-glass rounded-3xl text-slate-900 py-16 md:py-20 px-6 md:px-10 text-center overflow-hidden relative">
        <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-teal-300/30 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-orange-300/30 blur-3xl" />

        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight relative z-10">
          Build With Elite
          <span className="block text-teal-600">Freelance Talent</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-6 max-w-2xl mx-auto relative z-10">
          HireHive connects businesses with top-rated freelancers for any project, any size.
        </p>
        {/* login/join buttons */}
        <div className="mb-8 relative z-10">
          {(() => {
            const userId = localStorage.getItem('userId');
            if (userId) {
              return null; // already logged in; navbar shows logout
            }
            return (
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <a href="/login" className="text-slate-700 font-semibold hover:text-teal-600">
                  Login
                </a>
                <a href="/signup" className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-2.5 rounded-xl font-bold hover:shadow-xl hover:shadow-teal-500/25">
                  Join
                </a>
              </div>
            );
          })()}
        </div>
        
        {/* Search Bar */}
        <div className="max-w-3xl mx-auto bg-white/90 rounded-2xl p-2 flex flex-col md:flex-row gap-2 md:gap-0 shadow-xl border border-slate-200 relative z-10">
          <input 
            type="text" 
            placeholder="Search for 'Logo Design' or 'React Developer'..." 
            className="flex-grow px-6 py-3 text-slate-800 outline-none rounded-xl md:rounded-l-xl md:rounded-r-none"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button 
            onClick={handleSearch}
            className="bg-gradient-to-r from-teal-500 to-cyan-500 px-8 py-3 rounded-xl md:rounded-l-none md:rounded-r-xl text-white font-bold hover:shadow-lg hover:shadow-teal-500/30 flex items-center justify-center gap-2"
          >
            Search
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="py-16 max-w-7xl mx-auto px-2">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-12 text-center">Browse by Category</h2>
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
              className="ui-glass ui-card-hover p-6 rounded-2xl text-center hover:border-teal-300 hover:bg-teal-50/50 cursor-pointer"
            >
              <div className="text-3xl mb-2">{cat.label.split(' ')[0]}</div>
              <p className="font-semibold text-slate-700 text-sm">{cat.label.split(' ').slice(1).join(' ')}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Platform Stats Section */}
      <section className="py-14 px-2">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-12 text-center">Why Choose HireHive?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="ui-glass ui-card-hover p-8 rounded-2xl text-center">
              <div className="text-5xl font-black text-teal-600 mb-2">50K+</div>
              <p className="text-slate-600 font-semibold">Projects Completed</p>
            </div>
            <div className="ui-glass ui-card-hover p-8 rounded-2xl text-center">
              <div className="text-5xl font-black text-green-600 mb-2">10K+</div>
              <p className="text-slate-600 font-semibold">Active Freelancers</p>
            </div>
            <div className="ui-glass ui-card-hover p-8 rounded-2xl text-center">
              <div className="text-5xl font-black text-blue-600 mb-2">99%</div>
              <p className="text-slate-600 font-semibold">Client Satisfaction</p>
            </div>
            <div className="ui-glass ui-card-hover p-8 rounded-2xl text-center">
              <div className="text-5xl font-black text-orange-500 mb-2">120+</div>
              <p className="text-slate-600 font-semibold">Countries Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 max-w-7xl mx-auto px-2 grid md:grid-cols-3 gap-8 text-center">
        <div className="ui-glass ui-card-hover p-8 rounded-2xl">
          <div className="bg-teal-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-teal-700">
            <Rocket size={32} />
          </div>
          <h3 className="text-xl font-bold mb-3">Post a Job</h3>
          <p className="text-slate-500">Describe your project and receive competitive proposals within minutes.</p>
        </div>
        <div className="ui-glass ui-card-hover p-8 rounded-2xl">
          <div className="bg-cyan-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-cyan-700">
            <ShieldCheck size={32} />
          </div>
          <h3 className="text-xl font-bold mb-3">Safe Payments</h3>
          <p className="text-slate-500">Funds are held in escrow and only released when you approve the work.</p>
        </div>
        <div className="ui-glass ui-card-hover p-8 rounded-2xl">
          <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-orange-700">
            <Zap size={32} />
          </div>
          <h3 className="text-xl font-bold mb-3">Top Talent</h3>
          <p className="text-slate-500">Browse verified portfolios and reviews to find the perfect match.</p>
        </div>
      </section>

      {/* Featured Freelancers Section */}
      <section className="py-16 px-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Featured Freelancers</h2>
            <a href="/freelancers" className="text-teal-600 font-bold hover:text-teal-700 inline-flex items-center gap-2">View All <ArrowRight size={16} /></a>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {freelancerLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="ui-glass p-6 rounded-2xl animate-pulse">
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
              <div key={freelancer.id} className="ui-glass ui-card-hover p-6 rounded-2xl">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Users className="text-teal-700" size={32} />
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
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-500/25 text-sm"
                >
                  Contact Freelancer
                </button>
              </div>
            ))) : (
              <div className="md:col-span-3 ui-glass p-10 rounded-2xl text-center text-slate-500">
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