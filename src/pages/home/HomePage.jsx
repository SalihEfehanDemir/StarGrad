import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaCalculator, FaLock, FaClock, FaStickyNote, FaWind, FaWallet,
  FaBullseye, FaHeartbeat, FaLightbulb, FaBrain, FaTrophy, FaChartLine,
  FaUsers, FaStar, FaCheckCircle, FaArrowRight, FaGithub, FaTwitter, FaLinkedin, FaCalendarAlt, FaTasks, FaHourglassHalf, FaKey, FaCoins, FaShieldAlt, FaRocket, FaBolt, FaHourglassEnd
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const HomePage = () => {
  const { session } = useAuth();

  const productivityTools = [
    {
      title: 'Zen Mode',
      description: 'Minimalist focus canvas with a lofi music player.',
      link: '/tools/zen-mode',
      icon: <FaWind className="text-4xl text-blue-400" />,
      badge: 'Enhanced'
    },
    {
      title: 'Event Calendar',
      description: 'Organize your schedule and track important dates. Login required.',
      icon: <FaCalendarAlt className="text-4xl text-red-400" />,
      link: '/tools/calendar',
    },
    {
      title: 'Focus Board',
      description: 'A Kanban board to organize tasks and goals. Login required.',
      link: '/tools/focus-board',
      icon: <FaTasks className="text-4xl text-purple-400" />
    },
    {
      title: 'Smart Notes',
      description: 'A rich-text editor for your ideas and plans. Login required.',
      link: '/tools/smart-notes',
      icon: <FaStickyNote className="text-4xl text-pink-400" />
    }
  ];
  
  const utilityTools = [
    { name: "Password Generator", path: "/tools/password-generator", icon: <FaKey className="text-4xl text-primary" />, description: "Create strong and secure passwords." },
    { name: "Budget Tracker", path: "/tools/budget-dashboard", icon: <FaCoins className="text-4xl text-amber" />, description: "Manage finances and track spending. Login required." },
    { name: "BMI Calculator", path: "/tools/bmi-calculator", icon: <FaHeartbeat className="text-4xl text-red-400" />, description: "Calculate and track your body mass index." },
  ];

  const features = [
    { icon: <FaShieldAlt className="text-3xl text-primary" />, title: "Secure & Private", description: "Your data stays with you. All tools work locally with optional cloud sync." },
    { icon: <FaRocket className="text-3xl text-cyan" />, title: "Lightning Fast", description: "Optimized for speed. Get things done without waiting around." },
    { icon: <FaBolt className="text-3xl text-amber" />, title: "Always Available", description: "Works offline and online. Your tools are there when you need them." },
    { icon: <FaUsers className="text-3xl text-green-400" />, title: "User Focused", description: "Built with real user needs in mind. Simple, powerful, and intuitive." }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "50K+", label: "Tools Used Daily" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  const benefits = [
    "Save hours of manual work with automated tools",
    "Keep your sensitive data secure and private",
    "Access everything from one unified dashboard",
    "Work seamlessly across all your devices",
    "No complex setups or installations required",
    "Regular updates with new features and tools"
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans">
      <main>
      {/* Hero Section */}
        <motion.section 
          className="text-center pt-20 pb-10 sm:pt-24 sm:pb-12 md:pt-32 md:pb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-4xl mx-auto px-4">
          <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
          >
            Tools to Empower Your Workflow.
          </motion.h1>
          <motion.p 
              className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
          >
              Streamline your digital life with our comprehensive suite of productivity tools. From password security to time management and financial tracking, we've got you covered.
          </motion.p>
          </div>
        </motion.section>

        {/* Tools Section */}
        <section className="pt-8 pb-16 sm:pt-12 sm:pb-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">
              Productivity Tools
            </h2>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              Tools to help you focus, manage your time, and stay organized.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {productivityTools.map((tool, index) => (
                <Link to={tool.link} key={tool.title}>
                  <motion.div
                    className="group relative p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg hover:shadow-2xl hover:border-white/20 transform hover:-translate-y-2 transition-all duration-300 h-full touch-manipulation text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    {tool.badge && (
                      <div className="absolute top-0 right-0 -mt-2 -mr-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-dark-bg">
                          {tool.badge}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-center items-center mb-4">
                      {tool.icon}
                    </div>
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-white">{tool.title}</h5>
                    <p className="font-normal text-gray-400 text-sm">{tool.description}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Utility Tools Section */}
        <section className="pt-8 pb-16 sm:pt-12 sm:pb-20">
          <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">
              General Utilities
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              Handy tools for everyday tasks.
          </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {utilityTools.map((tool, index) => (
                 <Link to={tool.path} key={tool.name}>
              <motion.div
                    className="group p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg hover:shadow-2xl hover:border-white/20 transform hover:-translate-y-2 transition-all duration-300 h-full touch-manipulation text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <div className="flex justify-center items-center mb-4">
                    {tool.icon}
                  </div>
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-white">{tool.name}</h5>
                    <p className="font-normal text-gray-400 text-sm">{tool.description}</p>
                  </motion.div>
                </Link>
            ))}
            </div>
          </div>
        </section>
      </main>

      {/* Features Section */}
      <div className="bg-black/20 py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">
              Why Choose StarGrad?
            </h2>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              Built with modern standards and user experience in mind.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="text-center p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
              Trusted by Thousands
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <p className="text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-black/20 py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <motion.section
            className="flex flex-col lg:flex-row items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything You Need, Nothing You Don't.</h2>
              <p className="text-gray-400 mb-6">StarGrad is designed to be your all-in-one productivity hub. We focus on core functionality and a clean, intuitive interface.</p>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <FaCheckCircle className="text-primary mr-3 flex-shrink-0" />
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </ul>
              </div>
            <div className="lg:w-1/2">
              <motion.img 
                src="/image.png" 
                alt="StarGrad Dashboard"
                className="rounded-xl shadow-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              />
            </div>
          </motion.section>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <motion.section
            className="bg-gradient-to-r from-primary to-secondary p-8 rounded-xl text-center shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-dark-bg mb-4">
                Ready to Boost Your Productivity?
            </h2>
              <p className="text-dark-bg/80 mb-6">
                Join thousands of users who are already getting more done with StarGrad. It's free to get started.
              </p>
            </div>
          </motion.section>
        </div>
      </div>

      <footer className="py-8">
        <div className="container mx-auto px-4 border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">StarGrad</h3>
              <p className="text-gray-400 text-sm">Your all-in-one productivity suite.</p>
            </div>
            <div className="flex justify-center space-x-6 text-2xl text-gray-400">
              <a href="#" className="hover:text-primary transition-colors"><FaGithub /></a>
              <a href="#" className="hover:text-primary transition-colors"><FaTwitter /></a>
              <a href="#" className="hover:text-primary transition-colors"><FaLinkedin /></a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} StarGrad. All rights reserved.</p>
            <p className="mt-2">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <span className="mx-2">&middot;</span>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 