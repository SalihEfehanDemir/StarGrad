import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSignOutAlt, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Navbar = () => {
  const { session, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductivityMenuOpen, setIsProductivityMenuOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const [isMobileProductivityOpen, setIsMobileProductivityOpen] = useState(false);
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileProductivityOpen(false);
    setIsMobileToolsOpen(false);
  };
  
  const productivityLinks = [
    { name: "Focus Board", path: "/tools/focus-board" },
    { name: "Goal Tracker", path: "/tools/goals" },
    { name: "Event Calendar", path: "/tools/calendar" },
    { name: "Smart Notes", path: "/tools/smart-notes" },
    { name: "Zen Mode", path: "/tools/zen-mode" },
    { name: "Pomodoro Timer", path: "/tools/pomodoro-timer" },
  ];

  const generalLinks = [
    { name: "Password Generator", path: "/tools/password-generator" },
    { name: "Budget Dashboard", path: "/tools/budget-dashboard" },
    { name: "BMI Calculator", path: "/tools/bmi-calculator" },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <NavLink to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <img 
                  src="/stargrad-logo.png" 
                  alt="StarGrad Logo" 
                  className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 object-contain transition-all duration-300 group-hover:brightness-110"
                />
              </div>
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wider transition-all duration-300 group-hover:text-blue-300" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(59, 130, 246, 0.7)' }}>
                StarGrad
              </span>
            </NavLink>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {/* Productivity Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProductivityMenuOpen(!isProductivityMenuOpen)}
                  onBlur={() => setTimeout(() => setIsProductivityMenuOpen(false), 150)}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 flex items-center"
                >
                  <span>Productivity</span>
                  <FaChevronDown className={`ml-2 transition-transform duration-200 ${isProductivityMenuOpen ? 'rotate-180' : ''}`} size={12} />
                </button>
                <AnimatePresence>
                  {isProductivityMenuOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-56 origin-top-right bg-black/80 backdrop-blur-lg border border-white/10 rounded-md shadow-lg z-50"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                    >
                      <div className="py-1">
                        {productivityLinks.map(link => (
                          <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) => `block px-4 py-2 text-sm ${isActive ? 'text-white bg-brand-blue/50' : 'text-gray-300'} hover:bg-gray-700/50 hover:text-white`}
                            onClick={() => setIsProductivityMenuOpen(false)}
                          >
                            {link.name}
                          </NavLink>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Tools Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
                  onBlur={() => setTimeout(() => setIsToolsMenuOpen(false), 150)}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 flex items-center"
                >
                  <span>Tools</span>
                  <FaChevronDown className={`ml-2 transition-transform duration-200 ${isToolsMenuOpen ? 'rotate-180' : ''}`} size={12} />
                </button>
                <AnimatePresence>
                  {isToolsMenuOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-56 origin-top-right bg-black/80 backdrop-blur-lg border border-white/10 rounded-md shadow-lg z-50"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                    >
                      <div className="py-1">
                        {generalLinks.map(link => (
                          <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) => `block px-4 py-2 text-sm ${isActive ? 'text-white bg-brand-blue/50' : 'text-gray-300'} hover:bg-gray-700/50 hover:text-white`}
                            onClick={() => setIsToolsMenuOpen(false)}
                          >
                            {link.name}
                          </NavLink>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {session ? (
                <>
                  <NavLink to="/account" className={({ isActive }) => `text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-gray-700/50 shadow-inner' : ''}`}>Account</NavLink>
                  <button
                    onClick={signOut}
                    className="flex items-center text-gray-300 hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:bg-red-500/10"
                  >
                    <FaSignOutAlt className="mr-2" size={16} /> Logout
                  </button>
                </>
              ) : (
                <NavLink 
                  to="/login" 
                  className="bg-brand-blue hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                >
                  Login
                </NavLink>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white p-2 rounded-md transition-colors duration-300"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-black/50 backdrop-blur-lg border-t border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Productivity Dropdown */}
              <div>
                <button 
                  onClick={() => setIsMobileProductivityOpen(!isMobileProductivityOpen)}
                  className="w-full flex justify-between items-center text-gray-300 hover:text-white px-3 py-3 rounded-md text-base font-medium transition-colors duration-300"
                >
                  <span>Productivity</span>
                  <FaChevronDown className={`transition-transform duration-200 ${isMobileProductivityOpen ? 'rotate-180' : ''}`} size={16} />
                </button>
                <AnimatePresence>
                  {isMobileProductivityOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pl-4"
                    >
                      <div className="py-2 space-y-2">
                        {productivityLinks.map(link => (
                          <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={closeMobileMenu}
                            className={({ isActive }) => `block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${isActive ? 'bg-gray-700/50 shadow-inner' : ''}`}
                          >
                            {link.name}
                          </NavLink>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Tools Dropdown */}
              <div>
                <button 
                  onClick={() => setIsMobileToolsOpen(!isMobileToolsOpen)}
                  className="w-full flex justify-between items-center text-gray-300 hover:text-white px-3 py-3 rounded-md text-base font-medium transition-colors duration-300"
                >
                  <span>Tools</span>
                  <FaChevronDown className={`transition-transform duration-200 ${isMobileToolsOpen ? 'rotate-180' : ''}`} size={16} />
                </button>
                <AnimatePresence>
                  {isMobileToolsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pl-4"
                    >
                      <div className="py-2 space-y-2">
                        {generalLinks.map(link => (
                          <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={closeMobileMenu}
                            className={({ isActive }) => `block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${isActive ? 'bg-gray-700/50 shadow-inner' : ''}`}
                          >
                            {link.name}
                          </NavLink>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {session ? (
                <>
                  <NavLink 
                    to="/account" 
                    onClick={closeMobileMenu}
                    className={({ isActive }) => `block text-gray-300 hover:text-white px-3 py-3 rounded-md text-base font-medium transition-colors duration-300 ${isActive ? 'bg-gray-700/50 shadow-inner' : ''}`}
                  >
                    Account
                  </NavLink>
                  <button
                    onClick={() => {
                      signOut();
                      closeMobileMenu();
                    }}
                    className="w-full text-left flex items-center text-gray-300 hover:text-red-400 px-3 py-3 rounded-md text-base font-medium transition-colors duration-300 hover:bg-red-500/10"
                  >
                    <FaSignOutAlt className="mr-2" size={18} /> Logout
                  </button>
                </>
              ) : (
                <NavLink 
                  to="/login" 
                  onClick={closeMobileMenu}
                  className="block bg-brand-blue hover:bg-blue-700 text-white px-3 py-3 rounded-md text-base font-medium transition-colors duration-300 text-center"
                >
                  Login
                </NavLink>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar; 