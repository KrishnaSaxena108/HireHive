import React from 'react';
import { Users, Briefcase, Globe, Award } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: <Users />, label: "Active Freelancers", value: "10k+" },
    { icon: <Briefcase />, label: "Jobs Completed", value: "50k+" },
    { icon: <Globe />, label: "Countries Reached", value: "120+" },
    { icon: <Award />, label: "Success Rate", value: "99%" },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-indigo-900 text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-black mb-6">Revolutionizing the <span className="text-indigo-400">Future of Work.</span></h1>
        <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
          HireHive was born out of a simple idea: talent is universal, but opportunity is not. 
          We bridge that gap by connecting world-class experts with visionary businesses.
        </p>
      </section>

      {/* Mission Section */}
      <section className="py-20 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            We aim to create a world where anyone can build their dream career or business 
            regardless of their location. We provide the tools, the security, and the network 
            to make remote collaboration seamless.
          </p>
          <ul className="space-y-4">
            {['Transparency in every bid', 'Secure Escrow payments', 'Verified talent only'].map(item => (
              <li key={item} className="flex items-center text-gray-800 font-medium">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></span> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-indigo-50 p-10 rounded-3xl grid grid-cols-2 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-indigo-600 mb-2 flex justify-center">{stat.icon}</div>
              <div className="text-2xl font-black text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;