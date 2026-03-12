import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ChevronDown } from 'lucide-react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react/index.js';

const SUBMIT_CONTACT_FORM = gql`
  mutation SubmitContactForm($name: String!, $email: String!, $message: String!) {
    submitContactForm(name: $name, email: $email, message: $message) {
      id
    }
  }
`;

const Contact = () => {
  const [status, setStatus] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');

  const [submitContactForm] = useMutation(SUBMIT_CONTACT_FORM, {
    onCompleted: () => setStatus('success'),
    onError: () => setStatus('error')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    const fullMessage = `[${subject}] ${message}`;
    submitContactForm({ variables: { name, email, message: fullMessage } });
  };

  const faqs = [
    {
      question: 'How do I post a job?',
      answer: 'To post a job, log in as a client, click "Post a Job" in the navigation, fill out the job details including title, description, budget, and deadline, then submit. Freelancers will start bidding on your job.'
    },
    {
      question: 'How are freelancers rated?',
      answer: 'Freelancers are rated based on completed projects and client reviews. After a project is completed, clients can submit a star rating (1-5) and written review. The average rating appears on the freelancer\'s profile.'
    },
    {
      question: 'What payment methods are available?',
      answer: 'We support credit card, debit card, and bank transfer. All payments are held in escrow until the project is completed and approved by the client.'
    },
    {
      question: 'Can I cancel a contract?',
      answer: 'Yes, contracts can be canceled by either party with mutual agreement. If there\'s a dispute, our support team will mediate the situation.'
    },
    {
      question: 'How long does it take to find a freelancer?',
      answer: 'Most projects receive proposals within hours of posting. The time to find the right freelancer depends on your project clarity and budget competitiveness.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we use industry-standard encryption for all data transmission. Your personal information is never shared with third parties without your consent.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Contact Section */}
        <div className="grid lg:grid-cols-3 gap-12 mb-20">
          
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
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-700">Subject</label>
                <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option>General Inquiry</option>
                  <option>Billing Question</option>
                  <option>Report an Issue</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-700">Message</label>
                <textarea rows="5" value={message} onChange={(e) => setMessage(e.target.value)} required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
              </div>
              
              <button 
                disabled={status === 'sending'}
                className="md:col-span-2 bg-indigo-600 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-indigo-700 transition"
              >
                {status === 'success' ? 'Message Sent!' : status === 'sending' ? 'Sending...' : status === 'error' ? 'Error Sending' : (
                  <><Send size={20} /> <span>Send Message</span></>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full p-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-bold text-gray-900 text-left">{faq.question}</h3>
                  <ChevronDown
                    size={24}
                    className={`text-indigo-600 transition-transform ${expandedFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedFaq === i && (
                  <div className="px-6 pb-6 border-t border-gray-200">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;