import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react/index.js';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare, Clock } from 'lucide-react';

const SUBMIT_CONTACT = gql`
  mutation SubmitContactForm($name: String!, $email: String!, $message: String!) {
    submitContactForm(name: $name, email: $email, message: $message) {
      success message
    }
  }
`;

const CONTACT_INFO = [
  { icon: Mail, label: 'Email us', value: 'support@hirehive.com', color: 'bg-indigo-50 text-indigo-600' },
  { icon: Phone, label: 'Call us', value: '+1 (555) 000-HIRE', color: 'bg-emerald-50 text-emerald-600' },
  { icon: MapPin, label: 'Visit us', value: '123 Tech Ave, San Francisco', color: 'bg-amber-50 text-amber-600' },
  { icon: Clock, label: 'Support hours', value: 'Mon–Fri, 9am–6pm PST', color: 'bg-purple-50 text-purple-600' },
];

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const [submitContact, { loading, error }] = useMutation(SUBMIT_CONTACT, {
    onCompleted: () => setSubmitted(true),
  });

  const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitContact({ variables: { name: formData.name, email: formData.email, message: `[${formData.subject}] ${formData.message}` } });
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 text-white py-20 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <MessageSquare size={26} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Get in touch</h1>
          <p className="text-indigo-200 text-lg">Have questions? We'd love to hear from you. Our team responds within 24 hours.</p>
        </div>
      </section>

      <section className="page-wrapper py-16">
        <div className="grid lg:grid-cols-3 gap-12 max-w-5xl">

          {/* Info column */}
          <div className="space-y-5">
            <div className="mb-2">
              <h2 className="text-xl font-extrabold text-slate-900 mb-1">Contact details</h2>
              <p className="text-sm text-slate-500">Multiple ways to reach our team.</p>
            </div>
            {CONTACT_INFO.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="card p-5 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form column */}
          <div className="lg:col-span-2 card p-8">
            {submitted ? (
              <div className="py-16 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="text-emerald-600" size={32} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-1">Message Received!</h3>
                <p className="text-slate-500 text-sm">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-xl font-extrabold text-slate-900 mb-2">Send a message</h2>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                    <input required type="text" placeholder="Jane Smith" className="input-field" onChange={set('name')} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                    <input required type="email" placeholder="jane@example.com" className="input-field" onChange={set('email')} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject</label>
                  <select className="input-field" onChange={set('subject')}>
                    <option>General Inquiry</option>
                    <option>Billing Question</option>
                    <option>Report an Issue</option>
                    <option>Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message</label>
                  <textarea required rows={5} placeholder="Tell us how we can help..." className="input-field resize-none" onChange={set('message')} />
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl">
                    {error.message}
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-primary py-3.5 px-8 text-base">
                  {loading ? 'Sending...' : <><Send size={16} /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
