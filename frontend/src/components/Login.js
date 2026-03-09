import React, { useState } from 'react';
import { gql } from '@apollo/client';
// Import the hook directly from the React index to bypass the export error
import { useMutation } from '@apollo/client/react/index.js'; 
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Loader2 } from 'lucide-react';

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
      localStorage.setItem('role', data.login.user.role);
      localStorage.setItem('userId', data.login.user.id);
      navigate('/'); // Redirect to Home or Dashboard
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ variables: { ...formData } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl border border-slate-100">
        <h2 className="text-3xl font-black text-center text-slate-900 mb-8">Welcome Back</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
            <input 
              required type="email" placeholder="Email Address" 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
            <input 
              required type="password" placeholder="Password" 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">Invalid Credentials</p>}

          <button disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg flex justify-center">
            {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-500">
          New to HireHive? <Link to="/signup" className="text-indigo-600 font-bold">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;