import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// icons used only in components, not here
import Home from './components/Home';
import Navbar from './components/Navbar';
import SignUp from './components/SignUp';
import PostJob from './components/PostJob';
import Login from './components/Login';
import FreelancerDashboard from './components/FreelancerDashboard';
import ClientDashboard from './components/ClientDashboard';
import CreateProfile from './components/CreateProfile';
import Messages from './components/Messages';
import SubmitReview from './components/SubmitReview';
import AdvancedSearch from './components/AdvancedSearch';
import JobDetail from './components/JobDetail';
import FreelancerSearch from './components/FreelancerSearch';
import AdminDashboard from './components/AdminDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <Router>
      <div className="app-shell">
        <div className="app-glow app-glow-a" />
        <div className="app-glow app-glow-b" />
        <div className="app-glow app-glow-c" />

        {/* Navigation bar */}
        <Navbar />

        {/* Dynamic Page Content */}
        <main className="app-content route-fade">
          <Routes>
            {/* Feature #1: Home Page */}
            <Route path="/" element={<Home />} />

            {/* Feature #3: Browse Jobs Page - Advanced Search */}
            <Route path="/browse" element={<AdvancedSearch />} />

            {/* Feature #6: Sign Up Page */}
            <Route path="/signup" element={<SignUp />} />

            {/* Login Page */}
            <Route path="/login" element={<Login />} />

            {/* Feature #5: Post a Job Page - CLIENT ONLY */}
            <Route path="/post-job" element={<ProtectedRoute element={<PostJob />} requiredRole="CLIENT" />} />

            {/* Feature #6: Freelancer Dashboard - FREELANCER ONLY */}
            <Route path="/freelancer-dashboard" element={<ProtectedRoute element={<FreelancerDashboard />} requiredRole="FREELANCER" />} />

            {/* Feature #7: Client Dashboard - CLIENT ONLY */}
            <Route path="/client-dashboard" element={<ProtectedRoute element={<ClientDashboard />} requiredRole="CLIENT" />} />

            {/* Feature #10: Create Profile - FREELANCER ONLY */}
            <Route path="/create-profile" element={<ProtectedRoute element={<CreateProfile />} requiredRole="FREELANCER" />} />

            {/* Feature #9: Messages - AUTHENTICATED */}
            <Route path="/messages" element={<ProtectedRoute element={<Messages />} />} />

            {/* Feature #8: Admin Dashboard - ADMIN ONLY */}
            <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} requiredRole="ADMIN" />} />

            {/* Feature #3: Job Detail Page */}
            <Route path="/job/:id" element={<JobDetail />} />

            {/* Feature #4: Freelancer Search */}
            <Route path="/freelancers" element={<FreelancerSearch />} />

            {/* Feature #11: Submit Review - AUTHENTICATED */}
            <Route path="/submit-review" element={<ProtectedRoute element={<SubmitReview />} />} />

            {/* Feature #14: About Page */}
            <Route path="/about" element={<About />} />

            {/* Feature #15: Contact Page */}
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {/* Global Footer (Optional but good for #4/#5) */}
        <footer className="app-footer py-8 text-center text-slate-600 text-sm">
          <p>© 2026 HireHive. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;