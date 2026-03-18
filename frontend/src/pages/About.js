import React from 'react';
import { Users, Briefcase, Globe, Award, Zap, Heart, Shield, DollarSign } from 'lucide-react';
import { Card, SectionHeading } from '../components/ui';

const About = () => {
  const stats = [
    { icon: Users, label: "Active Freelancers", value: "10k+", color: "bg-blue-50", iconColor: "text-blue-600" },
    { icon: Briefcase, label: "Jobs Completed", value: "50k+", color: "bg-emerald-50", iconColor: "text-emerald-600" },
    { icon: Globe, label: "Countries Reached", value: "120+", color: "bg-purple-50", iconColor: "text-purple-600" },
    { icon: Award, label: "Success Rate", value: "99%", color: "bg-amber-50", iconColor: "text-amber-600" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Transparency",
      description: "We believe in clear communication between clients and freelancers. No hidden fees, no surprises. Every transaction is transparent.",
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      icon: DollarSign,
      title: "Fair Compensation",
      description: "Freelancers deserve fair pay for their work. We ensure payment is secure and on-time, every time.",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Your security is our priority. We verify users, hold payments in escrow, and provide dispute resolution.",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Zap,
      title: "Community",
      description: "We're building a global community of talented professionals united by the power of remote work.",
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Revolutionizing the <span className="text-blue-600">Future of Work</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            HireHive was born out of a simple idea: talent is universal, but opportunity is not. 
            We bridge that gap by connecting world-class experts with visionary businesses.
          </p>
        </section>

        {/* Core Values Section */}
        <section className="mb-20">
          <SectionHeading 
            title="Our Core Values"
            subtitle="What drives us every day"
          />
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <Card key={idx} padding="lg" className="border-l-4 border-l-blue-600 hover:shadow-lg transition-shadow">
                  <div className={`${value.bgColor} ${value.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-20">
          <SectionHeading 
            title="By The Numbers"
            subtitle="Our impact on the global workforce"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Card key={idx} padding="lg" className={`${stat.color} text-center`}>
                  <div className={`${stat.iconColor} flex justify-center mb-4`}>
                    <Icon size={32} />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-700 font-semibold">{stat.label}</div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Mission Section */}
        <section className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading 
                title="Our Mission"
                centered={false}
              />
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                We aim to create a world where anyone can build their dream career or business 
                regardless of their location. We provide the tools, the security, and the network 
                to make remote collaboration seamless.
              </p>
              <ul className="space-y-4">
                {[
                  'Transparency in every bid',
                  'Secure escrow payments',
                  'Verified talent only',
                  'Real-time support',
                  'Global payment solutions'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Mission Visual */}
            <div>
              <Card padding="lg" className="bg-gradient-to-br from-blue-50 to-emerald-50">
                <div className="grid grid-cols-2 gap-4">
                  {stats.slice(0, 4).map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <div key={idx} className="text-center p-4">
                        <div className={`${stat.iconColor} flex justify-center mb-2`}>
                          <Icon size={28} />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-xs text-gray-600 font-semibold mt-1">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-12 md:p-16 text-white text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Vision</h2>
          <p className="text-xl opacity-95 max-w-3xl mx-auto leading-relaxed">
            To be the most trusted platform where talented professionals and innovative businesses 
            collaborate to create meaningful work, regardless of geographical boundaries.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;