import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, MessageSquare, User, LogOut, ChevronDown, Menu, X, Bell, Moon, Sun } from 'lucide-react';
import Home from './components/Home';
import JobFeed from './components/JobFeed';
import SignUp from './components/SignUp';
import PostJob from './components/PostJob';
import Login from './components/Login';
import FreelancerDashboard from './components/FreelancerDashboard';
import ClientDashboard from './components/ClientDashboard';
import CreateProfile from './components/CreateProfile';
import Messages from './components/Messages';
import About from './pages/About';
import Contact from './pages/Contact';

const NavLink = ({ to, children, mobile, onClick }) => {
  const location = useLocation();
  const active = location.pathname === to;
  if (mobile) {
    return (
      <Link to={to} onClick={onClick}
        className={`block px-4 py-3 rounded-xl font-medium transition-colors ${
          active
            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
        }`}>
        {children}
      </Link>
    );
  }
  return (
    <Link to={to}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800'
      }`}>
      {children}
    </Link>
  );
};

const Navbar = ({ dark, toggleDark }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username') || 'Account';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('[data-profile-dropdown]')) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const logout = () => {
    localStorage.clear();
    setProfileOpen(false);
    navigate('/');
    window.location.reload();
  };

  const dashboardPath = role === 'CLIENT' ? '/client-dashboard' : '/freelancer-dashboard';

  return (
    <header className={`sticky top-0 z-50 border-b transition-all duration-200 ${
      scrolled
        ? 'glass border-slate-200 shadow-sm dark:border-slate-700'
        : 'bg-white border-transparent dark:bg-slate-900 dark:border-slate-800'
    }`}>
      <div className="page-wrapper">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setMobileOpen(false)}>
            <div className="bg-indigo-600 p-2 rounded-xl shadow-md shadow-indigo-200">
              <Briefcase className="text-white" size={18} />
            </div>
            <span className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">HireHive</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/browse">Find Work</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            {token && role === 'CLIENT' && <NavLink to="/post-job">Post a Job</NavLink>}
          </nav>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${
                dark
                  ? 'bg-slate-800 text-amber-400 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {token ? (
              <>
                <Link to="/messages" className="btn-ghost relative">
                  <MessageSquare size={18} />
                  <Bell size={10} className="absolute top-1.5 right-1.5 text-indigo-600" />
                </Link>
                <Link to={dashboardPath} className="btn-ghost">Dashboard</Link>
                <div className="relative" data-profile-dropdown>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all dark:border-slate-600 dark:hover:border-indigo-500 dark:hover:bg-slate-800"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                      {username[0]}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[80px] truncate">{username}</span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-52 card shadow-xl border border-slate-100 dark:border-slate-600 py-1 animate-fade-in">
                      <div className="px-4 py-2.5 border-b border-slate-50 dark:border-slate-700">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{username}</p>
                        <span className="badge badge-blue mt-1">{role}</span>
                      </div>
                      <Link to={dashboardPath} onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                        <User size={15} /> My Dashboard
                      </Link>
                      {role === 'FREELANCER' && (
                        <Link to="/create-profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                          <User size={15} /> Edit Profile
                        </Link>
                      )}
                      <button onClick={logout} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                <Link to="/signup" className="btn-primary text-sm px-5 py-2.5">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile right: dark toggle + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleDark}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${
                dark ? 'bg-slate-800 text-amber-400' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="btn-ghost p-2">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-4 space-y-1 animate-fade-in">
          <NavLink to="/browse" mobile onClick={() => setMobileOpen(false)}>Find Work</NavLink>
          <NavLink to="/about" mobile onClick={() => setMobileOpen(false)}>About</NavLink>
          <NavLink to="/contact" mobile onClick={() => setMobileOpen(false)}>Contact</NavLink>
          {token && role === 'CLIENT' && <NavLink to="/post-job" mobile onClick={() => setMobileOpen(false)}>Post a Job</NavLink>}
          {token ? (
            <>
              <NavLink to={dashboardPath} mobile onClick={() => setMobileOpen(false)}>Dashboard</NavLink>
              <NavLink to="/messages" mobile onClick={() => setMobileOpen(false)}>Messages</NavLink>
              <button onClick={logout} className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl">
                <LogOut size={16} /> Sign Out
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary flex-1 text-sm py-2.5">Sign In</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 text-sm py-2.5">Get Started</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggleDark = () => setDark(d => !d);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        <Navbar dark={dark} toggleDark={toggleDark} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={
              <div className="page-wrapper py-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="section-heading">Browse Opportunities</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Find your next project from hundreds of listings.</p>
                  </div>
                  <Link to="/post-job" className="btn-primary hidden sm:inline-flex">
                    <Briefcase size={16} /> Post a Job
                  </Link>
                </div>
                <JobFeed />
              </div>
            } />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route path="/create-profile" element={<CreateProfile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 mt-auto">
          <div className="page-wrapper py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="bg-indigo-600 p-1.5 rounded-lg"><Briefcase className="text-white" size={16} /></div>
                  <span className="font-extrabold text-slate-900 dark:text-white">HireHive</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">The modern platform connecting world-class freelancers with innovative businesses.</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Platform</h4>
                <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                  <li><Link to="/browse" className="hover:text-indigo-600 transition-colors">Find Work</Link></li>
                  <li><Link to="/post-job" className="hover:text-indigo-600 transition-colors">Post a Job</Link></li>
                  <li><Link to="/signup" className="hover:text-indigo-600 transition-colors">Join Free</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Company</h4>
                <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                  <li><Link to="/about" className="hover:text-indigo-600 transition-colors">About Us</Link></li>
                  <li><Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Legal</h4>
                <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                  <li><span className="cursor-default">Privacy Policy</span></li>
                  <li><span className="cursor-default">Terms of Service</span></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
              <p className="text-xs text-slate-400">Â© 2026 HireHive, Inc. All rights reserved.</p>
              <p className="text-xs text-slate-400">Built with passion for freelancers worldwide.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
