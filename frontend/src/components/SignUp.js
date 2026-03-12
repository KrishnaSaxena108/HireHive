import React, { useState } from 'react';
import { UserCircle, Briefcase, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react/index.js';
// Define the mutation
const REGISTER_USER = gql`
  mutation Register($username: String!, $email: String!, $password: String!, $role: String!) {
    register(username: $username, email: $email, password: $password, role: $role) {
      token
      user {
        id
        username
        role
      }
    }
  }
`;

const SignUp = () => {
  const [role, setRole] = useState('FREELANCER');
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  // Initialize mutation
  const [register, { loading, error }] = useMutation(REGISTER_USER, {
    onCompleted: (data) => {
      localStorage.setItem('token', data.register.token);
      localStorage.setItem('userRole', data.register.user.role);
      // store user id if returned
      if (data.register.user.id) {
        localStorage.setItem('userId', data.register.user.id);
      }
      
      // Dispatch event so Navbar re-renders immediately
      window.dispatchEvent(new Event('authChange'));
      alert("Registration Successful!");
      
      // Redirect based on role
      if (data.register.user.role === 'FREELANCER') {
        navigate('/create-profile');
      } else {
        navigate('/client-dashboard');
      }
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending data to backend...", { ...formData, role });
    try {
      await register({ variables: { ...formData, role } });
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 ui-glass p-10 rounded-3xl">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600 mb-2">Get Started</p>
          <h2 className="text-3xl font-extrabold text-slate-900">Join HireHive</h2>
          <p className="text-slate-600 mt-2">Choose your role and create your professional account.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div 
            onClick={() => setRole('CLIENT')}
            className={`cursor-pointer p-4 border-2 rounded-xl text-center transition ${role === 'CLIENT' ? 'border-teal-500 bg-teal-50 shadow-md shadow-teal-100' : 'border-slate-200 bg-white/80 hover:border-teal-300'}`}
          >
            <UserCircle size={40} className="mx-auto mb-2 text-teal-600" />
            <p className="font-bold">I'm a Client</p>
          </div>
          <div 
            onClick={() => setRole('FREELANCER')}
            className={`cursor-pointer p-4 border-2 rounded-xl text-center transition ${role === 'FREELANCER' ? 'border-teal-500 bg-teal-50 shadow-md shadow-teal-100' : 'border-slate-200 bg-white/80 hover:border-teal-300'}`}
          >
            <Briefcase size={40} className="mx-auto mb-2 text-teal-600" />
            <p className="font-bold">I'm a Freelancer</p>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input 
            required
            type="text" placeholder="Username" 
            className="appearance-none rounded-lg w-full px-3 py-3 border border-slate-300 bg-white/90 focus:ring-teal-500 outline-none"
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
          <input 
            required
            type="email" placeholder="Email address" 
            className="appearance-none rounded-lg w-full px-3 py-3 border border-slate-300 bg-white/90 focus:ring-teal-500 outline-none"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            required
            type="password" placeholder="Password" 
            className="appearance-none rounded-lg w-full px-3 py-3 border border-slate-300 bg-white/90 focus:ring-teal-500 outline-none"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          
          {error && <p className="text-red-500 text-sm">{error.message}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:shadow-xl hover:shadow-teal-500/30 transition"
          >
            {loading ? "Creating Account..." : <><span>{`Join as ${role.toLowerCase()}`}</span><ArrowRight size={16} /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;