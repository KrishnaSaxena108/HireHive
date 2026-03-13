import React, { useState } from 'react';
import { gql } from '@apollo/client';
// Import the hook directly from the React index to bypass the export error
import { useMutation } from '@apollo/client/react/index.js'; 
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react';

const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        role
      }
    }
  }
`;

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const [login, { loading, error }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      localStorage.setItem('token', data.login.token);
      localStorage.setItem('userRole', data.login.user.role);
      localStorage.setItem('userId', data.login.user.id);
      
      // Dispatch event so Navbar re-renders immediately
      window.dispatchEvent(new Event('authChange'));
      // Redirect based on role
      if (data.login.user.role === 'FREELANCER') {
        navigate('/freelancer-dashboard');
      } else if (data.login.user.role === 'CLIENT') {
        navigate('/client-dashboard');
      } else if (data.login.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ variables: { ...formData } });
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full ui-glass p-8 md:p-10 rounded-3xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600 mb-2">HireHive Account</p>
          <h2 className="text-3xl font-black text-slate-900">Welcome Back</h2>
          <p className="text-slate-600 mt-2">Sign in to continue managing your projects.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
            <input 
              required type="email" placeholder="Email Address" 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white/90 outline-none focus:ring-2 focus:ring-teal-500"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
            <input 
              required type="password" placeholder="Password" 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white/90 outline-none focus:ring-2 focus:ring-teal-500"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">Invalid Credentials</p>}

          <button disabled={loading} className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-teal-500/30 transition flex justify-center items-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <><span>Sign In</span><ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-500 text-sm">
          New to HireHive? <Link to="/signup" className="text-teal-600 font-bold">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;