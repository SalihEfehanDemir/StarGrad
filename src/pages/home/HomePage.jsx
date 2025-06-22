import { Link } from 'react-router-dom';
import { FaKey, FaClock, FaCoins } from 'react-icons/fa';
import { motion } from 'framer-motion';

const HomePage = () => {
  const tools = [
    { name: "Password Generator", path: "/tools/password-generator", icon: <FaKey className="text-4xl mb-4 text-brand-blue" />, description: "Create strong and secure passwords." },
    { name: "Time Tracker", path: "/tools/time-tracker", icon: <FaClock className="text-4xl mb-4 text-brand-cyan" />, description: "Track your time and log sessions." },
    { name: "Budget Tracker", path: "/tools/budget-dashboard", icon: <FaCoins className="text-4xl mb-4 text-brand-amber" />, description: "Manage your finances and track spending." },
    // Add more tools here
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <header className="text-center mb-20">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Tools to Empower Your Workflow.
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-400 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Your All-in-One Utility App
        </motion.p>
        <motion.button 
            className="bg-brand-blue text-white font-bold py-3 px-8 rounded-lg shadow-glow-blue hover:shadow-glow-blue-hover transition-all duration-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            Start Exploring
        </motion.button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
          >
            <Link 
              to={tool.path} 
              className="group block p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg hover:shadow-2xl hover:border-white/20 transform hover:-translate-y-2 transition-all duration-300 h-full"
            >
              <div className="flex justify-center items-center mb-4">
                {tool.icon}
              </div>
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-center text-white">{tool.name}</h5>
              <p className="font-normal text-gray-400 text-center">{tool.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HomePage; 