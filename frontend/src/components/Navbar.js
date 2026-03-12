import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react/index.js';
import { MessageSquare, Rocket, User, LogOut, Settings } from 'lucide-react';
import NotificationBell from './NotificationBell';

const GET_MY_PROFILE_PICTURE = gql`
  query GetMyProfilePicture {
    me {
      id
      username
      profilePictureUrl
    }
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { data: profileData, refetch } = useQuery(GET_MY_PROFILE_PICTURE, {
    skip: !userId
  });

  useEffect(() => {
    // Standard storage event (works across tabs)
    const handleStorageChange = () => {
      setUserId(localStorage.getItem('userId'));
      setUserRole(localStorage.getItem('userRole'));
    };

    // Custom event to trigger re-render in the same tab after login/logout
    const handleAuthChange = () => {
      setUserId(localStorage.getItem('userId'));
      setUserRole(localStorage.getItem('userRole'));
      if (localStorage.getItem('userId')) {
        refetch();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, [refetch]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  const profilePictureUrl = profileData?.me?.profilePictureUrl;

  return (
    <nav className="sticky top-0 z-50 px-3 md:px-6 pt-3">
      <div className="ui-glass rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 md:gap-10">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="bg-teal-500 p-2 rounded-lg text-white shadow-md shadow-teal-500/30 group-hover:scale-105 transition-transform">
            <Rocket size={20} />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">HireHive</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden lg:flex items-center gap-7 text-slate-600 font-semibold text-sm">

          {userRole === 'CLIENT' ? (
            <Link to="/client-dashboard" className="hover:text-teal-600 hover:-translate-y-0.5">Dashboard</Link>
          ) : (
            <Link to="/freelancer-dashboard" className="hover:text-teal-600 hover:-translate-y-0.5">Dashboard</Link>
          )}

          {userRole === 'CLIENT' ? (
            <Link to="/freelancers" className="hover:text-teal-600 hover:-translate-y-0.5">Find Freelancers</Link>
          ) : (
            <Link to="/browse" className="hover:text-teal-600 hover:-translate-y-0.5">Find Work</Link>
          )}

          <Link to="/about" className="hover:text-teal-600 text-slate-500 hover:-translate-y-0.5">About Us</Link>
          <Link to="/contact" className="hover:text-teal-600 text-slate-500 hover:-translate-y-0.5">Contact Us</Link>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3 md:gap-5">
        {userId && (
          <>
            <Link to="/messages" className="hidden md:flex items-center space-x-2 text-slate-600 hover:text-teal-600 font-semibold text-sm px-3 py-1.5 rounded-lg hover:bg-teal-50">
              <MessageSquare size={18} />
              <span>Messages</span>
            </Link>
            <div className="flex items-center text-slate-600 hover:text-teal-600">
              <NotificationBell />
            </div>
          </>
        )}
        {!userId ? (
          <>
            <Link to="/login" className="text-slate-600 hover:text-teal-600 font-semibold text-sm px-3 py-1.5 rounded-lg hover:bg-teal-50">
              Login
            </Link>
            <Link to="/signup" className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-teal-500/30 text-sm">
              Join
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center space-x-2 text-slate-600 hover:text-teal-600 font-semibold text-sm px-3 py-1.5 rounded-lg hover:bg-teal-50"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        )}
        {userId && (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/70 hover:border-teal-400 shadow-sm hover:shadow-md cursor-pointer"
            >
              {profilePictureUrl ? (
                <img 
                  src={`http://localhost:4000${profilePictureUrl}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <User size={20} />
                </div>
              )}
            </button>
            
            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white/90 backdrop-blur-lg rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-900 text-sm">{profileData?.me?.username || 'User'}</p>
                  <p className="text-xs text-slate-500 capitalize">{userRole?.toLowerCase()}</p>
                </div>
                <Link 
                  to="/create-profile" 
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-teal-50 hover:text-teal-700 text-sm"
                >
                  <Settings size={16} />
                  Edit Profile
                </Link>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    handleLogout();
                  }}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-rose-50 hover:text-rose-600 text-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </nav>
  );
};

export default Navbar;