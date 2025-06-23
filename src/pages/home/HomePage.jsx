import React from 'react';
import { Link } from 'react-router-dom';
import ToolCard from '../../components/ToolCard';
import {
  FaCalculator, FaLock, FaClock, FaStickyNote, FaWind, FaWallet,
  FaBullseye, FaHeartbeat, FaLightbulb, FaBrain, FaTrophy, FaChartLine,
  FaUsers, FaStar, FaCheckCircle, FaArrowRight, FaGithub, FaTwitter, FaLinkedin, FaCalendarAlt, FaTasks, FaHourglassHalf, FaKey, FaCoins, FaShieldAlt, FaRocket, FaBolt
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const HomePage = () => {
  const { session } = useAuth();

  const productivityTools = [
    {
      title: 'Goal Tracker',
      description: 'Set, track, and conquer your personal and professional goals.',
      icon: <FaBullseye className="text-4xl text-purple-400" />,
      link: '/tools/goals',
      badge: 'New',
    },
    {
      title: 'Event Calendar',
      description: 'Organize your schedule, plan events, and track your time.',
      icon: <FaCalendarAlt className="text-4xl text-red-400" />,
      link: '/tools/calendar',
      badge: 'New',
    },
    {
      title: 'Focus Board',
      description: 'A Kanban board to organize tasks and goals.',
      link: '/tools/focus-board',
      icon: <FaTasks className="text-4xl text-purple-400" />
    },
    {
      title: 'Smart Notes',
      description: 'A rich-text editor for your ideas and plans.',
      link: '/tools/smart-notes',
      icon: <FaStickyNote className="text-4xl text-pink-400" />
    },
    {
      title: 'Zen Mode',
      description: 'A minimalist writing canvas for pure focus.',
      link: '/tools/zen-mode',
      icon: <FaWind className="text-4xl text-blue-400" />
    },
    {
      title: 'Pomodoro Timer',
      description: 'Boost productivity with the Pomodoro technique.',
      link: '/tools/pomodoro-timer',
      icon: <FaHourglassHalf className="text-4xl text-red-400" />
    }
  ];
  
  const utilityTools = [
    { name: "Password Generator", path: "/tools/password-generator", icon: <FaKey className="text-4xl text-brand-blue" />, description: "Create strong and secure passwords." },
    { name: "Budget Tracker", path: "/tools/budget-dashboard", icon: <FaCoins className="text-4xl text-brand-amber" />, description: "Manage your finances and track spending." },
    { name: "BMI Calculator", path: "/tools/bmi-calculator", icon: <FaHeartbeat className="text-4xl text-red-400" />, description: "Calculate and track your BMI." },
  ];

  const features = [
    { icon: <FaShieldAlt className="text-3xl text-brand-blue" />, title: "Secure & Private", description: "Your data stays with you. All tools work locally with optional cloud sync." },
    { icon: <FaRocket className="text-3xl text-brand-cyan" />, title: "Lightning Fast", description: "Optimized for speed. Get things done without waiting around." },
    { icon: <FaBolt className="text-3xl text-brand-amber" />, title: "Always Available", description: "Works offline and online. Your tools are there when you need them." },
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
          className="text-center py-20 sm:py-24 md:py-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-4xl mx-auto px-4">
          <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-shadow-glow"
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
            {!session && (
          <motion.div
                className="flex justify-center space-x-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.6 }}
          >
                <Link to="/tools/focus-board" className="bg-brand-blue hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-glow-blue hover:shadow-glow-blue-hover touch-manipulation">
                  Get Started &rarr;
            </Link>
                <button className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 border border-white/20 touch-manipulation">
              Learn More
            </button>
          </motion.div>
            )}
          </div>
        </motion.section>

        {/* Tools Section */}
        <section className="py-16 sm:py-20">
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
                    className="group p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg hover:shadow-2xl hover:border-white/20 transform hover:-translate-y-2 transition-all duration-300 h-full touch-manipulation text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
        >
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
        <section className="py-16 sm:py-20">
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
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-blue mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm sm:text-base">{stat.label}</div>
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Everything You Need, Nothing You Don't
              </h2>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                StarGrad is designed to be your digital swiss army knife. 
                Whether you're managing passwords, tracking time, or monitoring expenses, 
                our tools are built to integrate seamlessly into your workflow.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <FaCheckCircle className="text-brand-cyan mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "StarGrad has completely transformed how I manage my daily tasks. The password generator alone has saved me countless hours.",
                  author: "Sarah Johnson",
                  role: "Digital Marketer"
                },
                {
                  quote: "The time tracking feature is incredibly intuitive. I finally have clear insights into where my time actually goes.",
                  author: "Mike Chen",
                  role: "Freelance Developer"
                },
                {
                  quote: "Budget tracking made simple. I love how everything syncs seamlessly across my devices.",
                  author: "Emily Rodriguez",
                  role: "Small Business Owner"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={testimonial.author}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-brand-amber" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-bold text-white">{testimonial.author}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-black/40 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <motion.section
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Connect With Us
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Follow us for updates, tips, and new features.
            </p>
            <div className="flex justify-center space-x-6">
              <button className="p-4 border border-white/20 hover:border-white/40 hover:bg-white/10 rounded-lg transition-all duration-300">
                <FaGithub className="text-white text-2xl" />
              </button>
              <button className="p-4 border border-white/20 hover:border-white/40 hover:bg-white/10 rounded-lg transition-all duration-300">
                <FaTwitter className="text-white text-2xl" />
              </button>
              <button className="p-4 border border-white/20 hover:border-white/40 hover:bg-white/10 rounded-lg transition-all duration-300">
                <FaLinkedin className="text-white text-2xl" />
              </button>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 