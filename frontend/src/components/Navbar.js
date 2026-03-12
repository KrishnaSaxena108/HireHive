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
    <nav className="flex items-center justify-between px-10 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="flex items-center space-x-10">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
            <Rocket size={20} />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tighter">HireHive</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center space-x-8 text-gray-600 font-semibold text-sm">

          {userRole === 'CLIENT' ? (
            <Link to="/client-dashboard" className="hover:text-indigo-600">Dashboard</Link>
          ) : (
            <Link to="/freelancer-dashboard" className="hover:text-indigo-600">Dashboard</Link>
          )}

          {userRole === 'CLIENT' ? (
            <Link to="/freelancers" className="hover:text-indigo-600">Find Freelancers</Link>
          ) : (
            <Link to="/browse" className="hover:text-indigo-600">Find Work</Link>
          )}

          <Link to="/about" className="hover:text-indigo-600 text-gray-500">About Us</Link>
          <Link to="/contact" className="hover:text-indigo-600 text-gray-500">Contact Us</Link>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-6">
        {userId && (
          <>
            <Link to="/messages" className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 font-semibold text-sm">
              <MessageSquare size={20} />
              <span>Messages</span>
            </Link>
            <div className="flex items-center text-gray-600 hover:text-indigo-600">
              <NotificationBell />
            </div>
          </>
        )}
        {!userId ? (
          <>
            <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-semibold text-sm">
              Login
            </Link>
            <Link to="/signup" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition text-sm">
              Join
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 font-semibold text-sm"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        )}
        {userId && (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-transparent hover:border-indigo-600 transition-all cursor-pointer"
            >
              {profilePictureUrl ? (
                <img 
                  src={`http://localhost:4000${profilePictureUrl}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <User size={20} />
                </div>
              )}
            </button>
            
            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-bold text-gray-900 text-sm">{profileData?.me?.username || 'User'}</p>
                  <p className="text-xs text-gray-500 capitalize">{userRole?.toLowerCase()}</p>
                </div>
                <Link 
                  to="/create-profile" 
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 text-sm"
                >
                  <Settings size={16} />
                  Edit Profile
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;