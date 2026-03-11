import React, { useState } from 'react';
import { UserCircle, Briefcase } from 'lucide-react';
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
      localStorage.setItem('role', data.register.user.role);
      // store user id if returned
      if (data.register.user.id) {
        localStorage.setItem('userId', data.register.user.id);
      }
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Join HireHive</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div 
            onClick={() => setRole('CLIENT')}
            className={`cursor-pointer p-4 border-2 rounded-xl text-center transition ${role === 'CLIENT' ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-gray-100'}`}
          >
            <UserCircle size={40} className="mx-auto mb-2 text-indigo-600" />
            <p className="font-bold">I'm a Client</p>
          </div>
          <div 
            onClick={() => setRole('FREELANCER')}
            className={`cursor-pointer p-4 border-2 rounded-xl text-center transition ${role === 'FREELANCER' ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-gray-100'}`}
          >
            <Briefcase size={40} className="mx-auto mb-2 text-indigo-600" />
            <p className="font-bold">I'm a Freelancer</p>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input 
            required
            type="text" placeholder="Username" 
            className="appearance-none rounded-lg w-full px-3 py-3 border border-gray-300 focus:ring-indigo-500 outline-none"
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
          <input 
            required
            type="email" placeholder="Email address" 
            className="appearance-none rounded-lg w-full px-3 py-3 border border-gray-300 focus:ring-indigo-500 outline-none"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            required
            type="password" placeholder="Password" 
            className="appearance-none rounded-lg w-full px-3 py-3 border border-gray-300 focus:ring-indigo-500 outline-none"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          
          {error && <p className="text-red-500 text-sm">{error.message}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg transition"
          >
            {loading ? "Creating Account..." : `Join as ${role.toLowerCase()}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;