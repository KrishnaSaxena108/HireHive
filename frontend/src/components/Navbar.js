import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Rocket, User, LogOut } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

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
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

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
            {console.log(userId)}
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
            {console.log(userId)}
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        )}
        {userId && (
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-200 cursor-pointer">
            <User size={20} />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;