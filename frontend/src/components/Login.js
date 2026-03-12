import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react/index.js';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Loader2, Briefcase, ArrowRight } from 'lucide-react';

const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user { id username role }
    }
  }
`;

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const [login, { loading, error }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      localStorage.setItem('token', data.login.token);
      localStorage.setItem('role', data.login.user.role);
      localStorage.setItem('username', data.login.user.username);
      const dash = data.login.user.role === 'CLIENT' ? '/client-dashboard' : '/freelancer-dashboard';
      navigate(dash);
    }
  });

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-950 to-purple-900 p-16 flex-col justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="bg-white/10 p-2 rounded-xl"><Briefcase className="text-white" size={20} /></div>
          <span className="text-white font-extrabold text-xl">HireHive</span>
        </Link>
        <div>
          <blockquote className="text-2xl font-semibold text-white leading-relaxed mb-6">
            "I landed 3 long-term clients in my first month. HireHive's transparent bidding system is a game-changer."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500 text-white font-bold text-lg flex items-center justify-center">AK</div>
            <div>
              <p className="text-white font-semibold">Arjun Kumar</p>
              <p className="text-indigo-300 text-sm">Full-Stack Developer, Mumbai</p>
            </div>
          </div>
        </div>
        <p className="text-indigo-400 text-sm">© 2026 HireHive, Inc.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-900">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">Welcome back</h1>
            <p className="text-slate-500">Sign in to your HireHive account.</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); login({ variables: formData }); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input required type="email" placeholder="you@example.com"
                  className="input-field pl-10"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-slate-700">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input required type="password" placeholder="••••••••"
                  className="input-field pl-10"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                Invalid email or password. Please try again.
              </div>
            )}

            <button disabled={loading} type="submit"
              className="btn-primary w-full py-3.5 text-base mt-2">
              {loading ? <Loader2 className="animate-spin" size={20} /> : <> Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:text-indigo-700">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
