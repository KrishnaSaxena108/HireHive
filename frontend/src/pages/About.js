import React from 'react';
import { Users, Briefcase, Globe, Award, CheckCircle, Zap, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATS = [
  { icon: Users, label: 'Active Freelancers', value: '50K+', color: 'bg-indigo-50 text-indigo-600' },
  { icon: Briefcase, label: 'Jobs Completed', value: '120K+', color: 'bg-emerald-50 text-emerald-600' },
  { icon: Globe, label: 'Countries', value: '95+', color: 'bg-amber-50 text-amber-600' },
  { icon: Award, label: 'Success Rate', value: '98%', color: 'bg-purple-50 text-purple-600' },
];

const VALUES = [
  { icon: Zap, title: 'Speed', desc: 'Get matched with the right talent in under 24 hours, guaranteed.' },
  { icon: Shield, title: 'Security', desc: 'Escrow payments and verified profiles ensure every engagement is safe.' },
  { icon: Star, title: 'Quality', desc: 'Only the top 3% of applicants pass our vetting process.' },
  { icon: CheckCircle, title: 'Transparency', desc: 'Clear pricing, honest reviews, no hidden fees—ever.' },
];

const TEAM = [
  { name: 'Alex Rivera', role: 'Co-founder & CEO', initials: 'AR', color: 'bg-indigo-100 text-indigo-700' },
  { name: 'Sarah Kim', role: 'Head of Product', initials: 'SK', color: 'bg-purple-100 text-purple-700' },
  { name: 'Marcus Chen', role: 'CTO', initials: 'MC', color: 'bg-emerald-100 text-emerald-700' },
];

const About = () => (
  <div>
    {/* Hero */}
    <section className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 text-white py-28 px-6 text-center relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/20 blur-3xl rounded-full" />
      <div className="relative max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-indigo-200 text-sm font-semibold mb-6">
          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" /> Founded 2024
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Talent is universal.<br /><span className="text-indigo-300">Opportunity should be too.</span>
        </h1>
        <p className="text-lg text-indigo-100 leading-relaxed">
          HireHive was built to bridge the gap between extraordinary talent worldwide and the businesses that need them most.
        </p>
      </div>
    </section>

    {/* Stats bar */}
    <section className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="text-center">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${color}`}>
              <Icon size={22} />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Mission */}
    <section className="page-wrapper py-20">
      <div className="max-w-5xl grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">Our Mission</p>
          <h2 className="section-heading mb-5">Building the future of remote work</h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-6">
            We believe location should never limit potential. HireHive provides the infrastructure, trust, and community to make global collaboration as seamless as working next door.
          </p>
          <ul className="space-y-3">
            {['Transparency in every bid', 'Secure Escrow payments', 'Verified talent only', 'Real-time collaboration tools'].map(item => (
              <li key={item} className="flex items-center gap-3 text-slate-700 font-medium">
                <CheckCircle className="text-indigo-500 shrink-0" size={18} /> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-3 text-indigo-600">
                <Icon size={18} />
              </div>
              <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Team */}
    <section className="bg-slate-50 dark:bg-slate-900/50 py-20">
      <div className="page-wrapper">
        <div className="text-center mb-12">
          <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">The Team</p>
          <h2 className="section-heading">People behind HireHive</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
          {TEAM.map(({ name, role, initials, color }) => (
            <div key={name} className="card p-8 text-center card-hover">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-extrabold ${color}`}>
                {initials}
              </div>
              <p className="font-extrabold text-slate-900">{name}</p>
              <p className="text-sm text-slate-500 mt-0.5">{role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="page-wrapper py-20 text-center">
      <h2 className="section-heading mb-4">Ready to get started?</h2>
      <p className="text-slate-500 mb-8">Join thousands of freelancers and businesses already thriving on HireHive.</p>
      <div className="flex gap-4 justify-center">
        <Link to="/signup" className="btn-primary px-8 py-3 text-base">Create Free Account</Link>
        <Link to="/jobs" className="btn-secondary px-8 py-3 text-base">Browse Jobs</Link>
      </div>
    </section>
  </div>
);

export default About;
