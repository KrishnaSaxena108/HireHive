import React from 'react';
import { Search, Rocket, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-indigo-900 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-black mb-6 leading-tight">
          Find the world's best <span className="text-indigo-400">Freelance Talent.</span>
        </h1>
        <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
          HireHive connects businesses with top-rated freelancers for any project, any size.
        </p>
        
        {/* Search Bar (#23 Search System Foundation) */}
        <div className="max-w-3xl mx-auto bg-white rounded-full p-2 flex shadow-2xl">
          <input 
            type="text" 
            placeholder="Search for 'Logo Design' or 'React Developer'..." 
            className="flex-grow px-6 py-3 text-gray-800 outline-none rounded-full"
          />
          <button className="bg-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-indigo-500 transition shadow-lg">
            Search
          </button>
        </div>
      </section>

      {/* Trust Badges / How it Works */}
      <section className="py-20 max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
        <div>
          <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
            <Rocket size={32} />
          </div>
          <h3 className="text-xl font-bold mb-3">Post a Job</h3>
          <p className="text-gray-500">Describe your project and receive competitive proposals within minutes.</p>
        </div>
        <div>
          <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
            <ShieldCheck size={32} />
          </div>
          <h3 className="text-xl font-bold mb-3">Safe Payments</h3>
          <p className="text-gray-500">Funds are held in escrow and only released when you approve the work.</p>
        </div>
        <div>
          <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
            <Zap size={32} />
          </div>
          <h3 className="text-xl font-bold mb-3">Top Talent</h3>
          <p className="text-gray-500">Browse verified portfolios and reviews to find the perfect match.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;