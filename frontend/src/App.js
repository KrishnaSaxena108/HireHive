import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Briefcase, User, MessageSquare } from 'lucide-react';
import NotificationBell from './components/NotificationBell';
import Navbar from './components/Navbar'; // Import the new Navbar
import Home from './components/Home';
import JobFeed from './components/JobFeed';
import SignUp from './components/SignUp';
import PostJob from './components/PostJob';
import Login from './components/Login';
import FreelancerDashboard from './components/FreelancerDashboard';
import ClientDashboard from './components/ClientDashboard';
import CreateProfile from './components/CreateProfile';
import Messages from './components/Messages';
import SubmitReview from './components/SubmitReview';
import About from './pages/About'; // Make sure the path matches where you saved the file
import Contact from './pages/Contact';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        {/* Navigation - Requirement #23: Search/Nav */}
        <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Briefcase className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">HireHive</h1>
          </Link>
          
          <div className="flex gap-6 text-slate-500 font-medium items-center">
            <Link to="/browse" className="hover:text-indigo-600 transition">Find Work</Link>
            <Link to="/messages" className="hover:text-indigo-600 transition flex items-center gap-1">
              <MessageSquare size={18} /> Messages
            </Link>
            <Link to="/submit-review" className="hover:text-indigo-600 transition">
              Leave Review
            </Link>
            <NotificationBell />
            <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
              Join
            </Link>
            <User className="cursor-pointer hover:text-indigo-600" />
          </div>
        </nav>

        {/* Dynamic Page Content */}
        <Routes>
          {/* Feature #1: Home Page */}
          <Route path="/" element={<Home />} />

          {/* Feature #3: Browse Jobs Page */}
          <Route path="/browse" element={
            <main className="max-w-6xl mx-auto py-12">
              <div className="flex justify-between items-center px-6 mb-8">
                <h3 className="text-2xl font-bold text-slate-800">Latest Opportunities</h3>
                <Link to="/post-job" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700">
                  Post a Job
                </Link>
              </div>
              <JobFeed />
            </main>
          } />

          {/* Feature #6: Sign Up Page */}
          <Route path="/signup" element={<SignUp />} />

          {/* Feature #16: Post a Job Page */}
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/login" element={<Login />} />
          <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
<Route path="/client-dashboard" element={<ClientDashboard />} />
<Route path="/create-profile" element={<CreateProfile />} />
<Route path="/messages" element={<Messages />} />
<Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/submit-review" element={<SubmitReview />} />
        </Routes>

        {/* Global Footer (Optional but good for #4/#5) */}
        <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
          <p>© 2026 HireHive. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;