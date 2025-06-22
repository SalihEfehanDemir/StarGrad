import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Navbar = () => {
  const { session, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/tools/password-generator" className={({ isActive }) => `text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-gray-700/50 shadow-inner' : ''}`}>Password Generator</NavLink>
              <NavLink to="/tools/time-tracker" className={({ isActive }) => `text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-gray-700/50 shadow-inner' : ''}`}>Time Tracker</NavLink>
              <NavLink to="/tools/budget-dashboard" className={({ isActive }) => `text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-gray-700/50 shadow-inner' : ''}`}>Budget Dashboard</NavLink>
              {session ? (
                <>
                  <NavLink to="/account" className={({ isActive }) => `text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-gray-700/50 shadow-inner' : ''}`}>Account</NavLink>
                  <button
                    onClick={signOut}
                    className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 bg-red-600/50 hover:bg-red-500/50"
                  >
                    <FaSignOutAlt className="mr-2" /> Logout
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
              <NavLink 
                to="/tools/password-generator" 
                onClick={closeMobileMenu}
                className={({ isActive }) => `block text-gray-300 hover:text-white px-3 py-3 rounded-md text-base font-medium transition-colors duration-300 ${isActive ? 'bg-gray-700/50 shadow-inner' : ''}`}
              >
                Password Generator
              </NavLink>
              <NavLink 
                to="/tools/time-tracker" 
                onClick={closeMobileMenu}
                className={({ isActive }) => `block text-gray-300 hover:text-white px-3 py-3 rounded-md text-base font-medium transition-colors duration-300 ${isActive ? 'bg-gray-700/50 shadow-inner' : ''}`}
              >
                Time Tracker
              </NavLink>
              <NavLink 
                to="/tools/budget-dashboard" 
                onClick={closeMobileMenu}
                className={({ isActive }) => `block text-gray-300 hover:text-white px-3 py-3 rounded-md text-base font-medium transition-colors duration-300 ${isActive ? 'bg-gray-700/50 shadow-inner' : ''}`}
              >
                Budget Dashboard
              </NavLink>
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
                    className="w-full text-left flex items-center text-gray-300 hover:text-white px-3 py-3 rounded-md text-base font-medium transition-colors duration-300 bg-red-600/50 hover:bg-red-500/50"
                  >
                    <FaSignOutAlt className="mr-2" /> Logout
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