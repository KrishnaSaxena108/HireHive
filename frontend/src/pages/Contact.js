import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ChevronDown, MessageCircle, Clock } from 'lucide-react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react/index.js';
import { Button, Card, Input, SectionHeading } from '../components/ui';

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [submitContactForm, { loading: isSubmitting }] = useMutation(SUBMIT_CONTACT_FORM, {
    onCompleted: () => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      setTimeout(() => setStatus(''), 5000);
    },
    onError: () => {
      setStatus('error');
      setTimeout(() => setStatus(''), 5000);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    const fullMessage = `[${formData.subject}] ${formData.message}`;
    submitContactForm({ 
      variables: { 
        name: formData.name, 
        email: formData.email, 
        message: fullMessage 
      } 
    });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email us',
      value: 'support@hirehive.com',
      description: 'We respond within 24 hours',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Phone,
      title: 'Call us',
      value: '+1 (555) 000-HIRE',
      description: 'Available Mon-Fri 9AM-6PM EST',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      icon: MapPin,
      title: 'Visit us',
      value: '123 Tech Avenue, San Francisco, CA',
      description: 'Our headquarters',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
  ];

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        
        {/* Intro Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? We're here to help you succeed on HireHive. Reach out to our support team anytime.
          </p>
        </div>

        {/* Contact Methods and Form  */}
        <div className="grid lg:grid-cols-3 gap-12 mb-20">
          
          {/* Contact Info Column */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h2>
            <div className="space-y-6">
              {contactMethods.map((method, idx) => {
                const Icon = method.icon;
                return (
                  <Card key={idx} padding="md" className={method.bgColor}>
                    <Icon size={28} className={`${method.color} mb-3`} />
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{method.title}</h3>
                    <p className="text-gray-700 font-semibold mb-1">{method.value}</p>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </Card>
                );
              })}
            </div>

            {/* Quick Response Info */}
            <Card padding="md" className="mt-8 border-l-4 border-l-blue-600 bg-blue-50">
              <Clock size={24} className="text-blue-600 mb-2" />
              <p className="text-sm text-gray-700 font-semibold">
                <strong>Average Response Time:</strong> 2-4 hours during business hours
              </p>
            </Card>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-2">
            <Card padding="lg" shadow="lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    type="text"
                    label="Full Name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    type="email"
                    label="Email Address"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                  <select 
                    value={formData.subject} 
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  >
                    <option>General Inquiry</option>
                    <option>Billing Question</option>
                    <option>Technical Support</option>
                    <option>Report an Issue</option>
                    <option>Feature Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                  <textarea 
                    rows="6" 
                    placeholder="Tell us what's on your mind..." 
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                {/* Status Messages */}
                {status === 'success' && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 font-semibold flex items-center gap-2">
                    <MessageCircle size={20} />
                    Your message has been sent successfully!
                  </div>
                )}
                {status === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-semibold">
                    Oops! Something went wrong. Please try again.
                  </div>
                )}

                <Button 
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  {!isSubmitting && <Send size={20} />}
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <section>
          <SectionHeading 
            title="Frequently Asked Questions"
            subtitle="Answers to your common questions"
          />
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <Card 
                key={idx}
                padding="md"
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">{faq.question}</h3>
                  <ChevronDown
                    size={24}
                    className={`text-blue-600 transition-transform flex-shrink-0 ${
                      expandedFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                {expandedFaq === idx && (
                  <div className="mt-4 pt-4 border-t border-gray-200 text-gray-700 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Still Need Help */}
          <div className="text-center mt-12">
            <Card padding="lg" className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-center">
              <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
              <p className="opacity-95 mb-4">Can't find the answer you're looking for? Our support team is standing by.</p>
              <Button variant="secondary" size="md">
                Contact Support Team
              </Button>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;