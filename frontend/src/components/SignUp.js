import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react/index.js';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, User, Mail, Lock, Loader2, ArrowRight, UserCircle } from 'lucide-react';

const REGISTER_USER = gql`
  mutation Register($username: String!, $email: String!, $password: String!, $role: String!) {
    register(username: $username, email: $email, password: $password, role: $role) {
      token
      user { id username role }
    }
  }
`;

const SignUp = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [role, setRole] = useState('FREELANCER');
  const navigate = useNavigate();

  const [register, { loading, error }] = useMutation(REGISTER_USER, {
    onCompleted: (data) => {
      localStorage.setItem('token', data.register.token);
      localStorage.setItem('role', data.register.user.role);
      localStorage.setItem('username', data.register.user.username);
      const dash = data.register.user.role === 'CLIENT' ? '/client-dashboard' : '/freelancer-dashboard';
      navigate(dash);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    register({ variables: { ...formData, role } });
  };

  const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-950 to-purple-900 p-16 flex-col justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="bg-white/10 p-2 rounded-xl"><Briefcase className="text-white" size={20} /></div>
          <span className="text-white font-extrabold text-xl">HireHive</span>
        </Link>
        <div>
          <h2 className="text-3xl font-extrabold text-white mb-4 leading-snug">
            Join 50,000+<br />professionals worldwide.
          </h2>
          <p className="text-indigo-200 text-lg leading-relaxed mb-8">
            Whether you're hiring top talent or offering your skills, HireHive gives you everything you need to succeed.
          </p>
          <div className="space-y-3">
            {['Free to join — no hidden fees', 'Secure escrow payments', 'Real-time messaging'].map(t => (
              <div key={t} className="flex items-center gap-3 text-indigo-100">
                <span className="w-5 h-5 rounded-full bg-indigo-500/40 flex items-center justify-center text-indigo-300 text-xs">✓</span>
                {t}
              </div>
            ))}
          </div>
        </div>
        <p className="text-indigo-400 text-sm">© 2026 HireHive, Inc.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-900">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="bg-indigo-600 p-1.5 rounded-xl"><Briefcase className="text-white" size={18} /></div>
            <span className="text-slate-900 dark:text-white font-extrabold text-lg">HireHive</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">Create your account</h1>
            <p className="text-slate-500">Start hiring or earning in minutes.</p>
          </div>

          {/* Role toggle */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { value: 'FREELANCER', label: "I'm a Freelancer", icon: UserCircle },
              { value: 'CLIENT', label: "I'm a Client", icon: Briefcase },
            ].map(({ value, label, icon: Icon }) => (
              <button key={value} type="button" onClick={() => setRole(value)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                  role === value
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-500'
                }`}>
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input required type="text" placeholder="johndoe" className="input-field pl-10" onChange={set('username')} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input required type="email" placeholder="you@example.com" className="input-field pl-10" onChange={set('email')} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input required type="password" placeholder="Min. 8 characters" className="input-field pl-10" onChange={set('password')} />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-xl">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                {error.message}
              </div>
            )}

            <button disabled={loading} type="submit" className="btn-primary w-full py-3.5 text-base mt-2">
              {loading
                ? <Loader2 className="animate-spin" size={20} />
                : <>Create Account <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
