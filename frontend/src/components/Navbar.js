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
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Left: Logo and Navigation Links */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="bg-gradient-to-br from-blue-600 to-emerald-600 p-2.5 rounded-xl text-white shadow-md group-hover:scale-110 transition-transform">
                <Rocket size={22} />
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tight hidden sm:inline">HireHive</span>
            </Link>

            {/* Nav Links - Desktop */}
            <div className="hidden lg:flex items-center gap-8">
              {userRole === 'CLIENT' ? (
                <Link to="/client-dashboard" className="text-gray-600 font-semibold text-sm hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600">
                  Dashboard
                </Link>
              ) : userRole === 'FREELANCER' ? (
                <Link to="/freelancer-dashboard" className="text-gray-600 font-semibold text-sm hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600">
                  Dashboard
                </Link>
              ) : null}

              {userRole === 'CLIENT' ? (
                <Link to="/freelancers" className="text-gray-600 font-semibold text-sm hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600">
                  Find Freelancers
                </Link>
              ) : userRole === 'FREELANCER' ? (
                <Link to="/browse" className="text-gray-600 font-semibold text-sm hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600">
                  Find Work
                </Link>
              ) : null}

              <Link to="/about" className="text-gray-600 font-semibold text-sm hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600">
                About Us
              </Link>
              <Link to="/contact" className="text-gray-600 font-semibold text-sm hover:text-blue-600 transition-colors border-b-2 border-transparent hover:border-blue-600">
                Contact
              </Link>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            {userId && (
              <>
                {/* Messages Link - Desktop */}
                <Link 
                  to="/messages" 
                  className="hidden md:flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold text-sm px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <MessageSquare size={18} />
                  <span>Messages</span>
                </Link>
                
                {/* Notifications */}
                <div className="flex items-center text-gray-600">
                  <NotificationBell />
                </div>
              </>
            )}
            
            {!userId ? (
              <>
                {/* Login/Signup Buttons */}
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-blue-600 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 text-sm transition-all"
                >
                  Join
                </Link>
              </>
            ) : (
              <>
                {/* Logout Button - Desktop */}
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-2 text-gray-600 hover:text-red-600 font-semibold text-sm px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>

                {/* Profile Avatar and Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-300 hover:border-blue-500 shadow-sm hover:shadow-md transition-all"
                  >
                    {profilePictureUrl ? (
                      <img 
                        src={`http://localhost:4000${profilePictureUrl}`} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User size={20} />
                      </div>
                    )}
                  </button>
                  
                  {/* Profile Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-3 w-56 bg-white shadow-xl rounded-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-bold text-gray-900 text-sm">{profileData?.me?.username || 'User'}</p>
                        <p className="text-xs text-gray-500 capitalize">{userRole?.toLowerCase()}</p>
                      </div>
                      <Link 
                        to="/create-profile" 
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:bg-blue-50 hover:text-blue-700 text-sm transition-colors"
                      >
                        <Settings size={16} />
                        Edit Profile
                      </Link>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          handleLogout();
                        }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:bg-red-50 hover:text-red-600 text-sm transition-colors"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;