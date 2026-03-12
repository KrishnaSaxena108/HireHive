import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Rocket, ShieldCheck, Zap, Star, ArrowRight, Users, Briefcase, Globe, TrendingUp, CheckCircle } from 'lucide-react';

const categories = [
  { name: 'Web Development', icon: '💻', count: '2.4k jobs' },
  { name: 'Graphic Design',  icon: '🎨', count: '1.8k jobs' },
  { name: 'Content Writing', icon: '✍️',  count: '1.2k jobs' },
  { name: 'Mobile Apps',     icon: '📱', count: '980 jobs' },
  { name: 'Data Science',    icon: '📊', count: '760 jobs' },
  { name: 'SEO & Marketing', icon: '📣', count: '640 jobs' },
  { name: 'Video Editing',   icon: '🎬', count: '510 jobs' },
  { name: 'DevOps & Cloud',  icon: '☁️',  count: '430 jobs' },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'Product Manager, TechCorp', avatar: 'SC', text: 'HireHive cut our hiring time by 60%. We found a stellar React developer within 48 hours.', rating: 5 },
  { name: 'Marcus Williams', role: 'Freelance Designer', avatar: 'MW', text: 'I went from 0 to $8k/month in 3 months. The proposal system is incredibly fair and transparent.', rating: 5 },
  { name: 'Priya Sharma', role: 'CEO, StartupLab', avatar: 'PS', text: "The escrow payment system gives us peace of mind. We've safely completed 40+ projects.", rating: 5 },
];

const stats = [
  { icon: <Users size={24} />, value: '50K+', label: 'Freelancers' },
  { icon: <Briefcase size={24} />, value: '120K+', label: 'Jobs Posted' },
  { icon: <Globe size={24} />, value: '95+', label: 'Countries' },
  { icon: <TrendingUp size={24} />, value: '$42M+', label: 'Paid Out' },
];

const Home = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/browse${query ? `?q=${encodeURIComponent(query)}` : ''}`);
  };

  return (
    <div className="bg-white dark:bg-slate-900">
      {/* — HERO — */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/5 rounded-full blur-3xl" />
        </div>

        <div className="page-wrapper relative py-24 lg:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-indigo-200 text-sm font-medium px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Over 2,400 jobs posted this week
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6 animate-slide-up">
            Find the world's best<br />
            <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Freelance Talent.
            </span>
          </h1>

          <p className="text-xl text-indigo-200 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
            HireHive connects ambitious businesses with top-rated independent professionals for any project, any skill, any size.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto animate-slide-up">
            <div className="flex items-center bg-white rounded-2xl p-1.5 shadow-2xl shadow-black/20">
              <Search className="ml-4 text-slate-400 shrink-0" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search 'React Developer', 'Logo Design'..."
                className="flex-grow px-4 py-3 text-slate-800 outline-none bg-transparent placeholder:text-slate-400 text-base"
              />
              <button type="submit" className="btn-primary px-6 py-3 rounded-xl shrink-0">
                Search <ArrowRight size={16} />
              </button>
            </div>
            <p className="text-indigo-300/70 text-sm mt-3">Popular: <span className="text-indigo-200 cursor-pointer hover:underline" onClick={() => { setQuery('React'); navigate('/browse?q=React'); }}>React</span>, <span className="text-indigo-200 cursor-pointer hover:underline" onClick={() => { setQuery('UI Design'); navigate('/browse?q=UI+Design'); }}>UI Design</span>, <span className="text-indigo-200 cursor-pointer hover:underline" onClick={() => { setQuery('Node.js'); navigate('/browse?q=Node.js'); }}>Node.js</span></p>
          </form>
        </div>

        {/* Stats bar */}
        <div className="border-t border-white/10">
          <div className="page-wrapper py-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-white/10">
              {stats.map((s, i) => (
                <div key={i} className="flex flex-col items-center lg:px-8">
                  <span className="text-3xl font-extrabold text-white">{s.value}</span>
                  <span className="text-sm text-indigo-300 mt-0.5">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* — CATEGORIES — */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="page-wrapper">
          <div className="text-center mb-12">
            <h2 className="section-heading mb-3">Explore by Category</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Browse thousands of jobs across every discipline.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <Link key={cat.name} to="/browse"
                className="card-hover p-4 text-center group cursor-pointer hover:-translate-y-1">
                <div className="text-3xl mb-2">{cat.icon}</div>
                <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-700 leading-tight">{cat.name}</p>
                <p className="text-xs text-slate-400 mt-1">{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* — HOW IT WORKS — */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="page-wrapper">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-3">How HireHive Works</h2>
            <p className="text-slate-500 max-w-xl mx-auto">From finding talent to getting paid — we make it seamless.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
            {[
              { icon: <Rocket size={28} />, step: '01', title: 'Post or Find', desc: 'Clients post detailed job listings. Freelancers browse opportunities filtered by skill, budget, and category.' },
              { icon: <ShieldCheck size={28} />, step: '02', title: 'Propose & Hire', desc: 'Freelancers submit tailored proposals. Clients review bids and hire the best fit through our secure system.' },
              { icon: <Zap size={28} />, step: '03', title: 'Work & Get Paid', desc: 'Collaborate with real-time messaging. Payments are held in escrow and released when you approve the work.' },
            ].map((item) => (
              <div key={item.step} className="relative card p-8 text-center group hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                <div className="absolute -top-3 right-4 text-[10px] font-bold text-indigo-400 tracking-widest">{item.step}</div>
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* — TESTIMONIALS — */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="page-wrapper">
          <div className="text-center mb-12">
            <h2 className="section-heading mb-3">Loved by Thousands</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Real people. Real results.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card p-7 flex flex-col gap-4 hover:shadow-card-hover transition-all duration-300">
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* — FEATURES — */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="page-wrapper">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="badge badge-blue mb-4">Why Choose HireHive</span>
              <h2 className="section-heading mb-5">Everything you need to succeed — in one place.</h2>
              <div className="space-y-5">
                {[
                  { title: 'Verified Talent', desc: 'Every freelancer profile is reviewed and verified before publishing.' },
                  { title: 'Secure Escrow Payments', desc: 'Funds are held safely and only released when you approve the delivered work.' },
                  { title: 'Real-time Messaging', desc: 'Built-in chat keeps clients and freelancers always in sync.' },
                  { title: 'Smart Proposals', desc: 'Structured bids make it easy to compare and choose the right freelancer.' },
                ].map((f) => (
                  <div key={f.title} className="flex items-start gap-4">
                    <CheckCircle size={20} className="text-indigo-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-800">{f.title}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 rounded-3xl p-8 grid grid-cols-2 gap-5">
              {[
                { label: 'Avg. Time to Hire', value: '< 48h', color: 'text-emerald-600' },
                { label: 'Client Satisfaction', value: '98.2%', color: 'text-indigo-600' },
                { label: 'Active Freelancers', value: '50K+', color: 'text-purple-600' },
                { label: 'Jobs This Month', value: '12K+', color: 'text-amber-600' },
              ].map((item) => (
                <div key={item.label} className="card p-6 rounded-2xl">
                  <p className={`text-3xl font-black ${item.color}`}>{item.value}</p>
                  <p className="text-sm text-slate-500 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* — CTA — */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="page-wrapper text-center">
          <h2 className="text-4xl font-black mb-4 tracking-tight">Ready to get started?</h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-md mx-auto">Join 50,000+ freelancers and businesses already using HireHive.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-lg">
              Start Hiring <ArrowRight size={18} />
            </Link>
            <Link to="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm">
              Find Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
