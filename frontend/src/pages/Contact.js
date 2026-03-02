import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    // Simulate API call
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
        
        {/* Contact Info Column */}
        <div className="lg:col-span-1 space-y-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-4">Get in touch.</h1>
            <p className="text-gray-600">Have questions about our platform? We're here to help you 24/7.</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-white p-3 rounded-xl shadow-sm text-indigo-600"><Mail /></div>
              <div><p className="font-bold">Email us</p><p className="text-gray-500">support@hirehive.com</p></div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-white p-3 rounded-xl shadow-sm text-indigo-600"><Phone /></div>
              <div><p className="font-bold">Call us</p><p className="text-gray-500">+1 (555) 000-HIRE</p></div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-white p-3 rounded-xl shadow-sm text-indigo-600"><MapPin /></div>
              <div><p className="font-bold">Visit us</p><p className="text-gray-500">123 Tech Avenue, San Francisco, CA</p></div>
            </div>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-10">
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Full Name</label>
              <input type="text" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Email Address</label>
              <input type="email" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-gray-700">Subject</label>
              <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                <option>General Inquiry</option>
                <option>Billing Question</option>
                <option>Report an Issue</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-gray-700">Message</label>
              <textarea rows="5" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
            </div>
            
            <button 
              disabled={status === 'sending'}
              className="md:col-span-2 bg-indigo-600 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-indigo-700 transition"
            >
              {status === 'success' ? 'Message Sent!' : status === 'sending' ? 'Sending...' : (
                <><Send size={20} /> <span>Send Message</span></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;