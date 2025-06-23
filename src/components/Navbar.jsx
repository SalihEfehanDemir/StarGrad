import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSignOutAlt, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

const Navbar = () => {
  const { session, signOut } = useAuth();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const productivityRef = useRef(null);
  const toolsRef = useRef(null);
  
  useOutsideClick(productivityRef, () => {
    if (openDropdown === 'productivity') {
      setOpenDropdown(null);
    }
  });

  useOutsideClick(toolsRef, () => {
    if (openDropdown === 'tools') {
      setOpenDropdown(null);
    }
  });

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenDropdown(null); 
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };
  
  const handleDropdownToggle = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  
  const productivityLinks = [
    { name: "Focus Board", path: "/tools/focus-board" },
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
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-wider transition-all duration-300 group-hover:text-primary" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(59, 130, 246, 0.7)' }}>
                StarGrad
              </span>
            </NavLink>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {/* Productivity Dropdown */}
              <div className="relative" ref={productivityRef}>
                <button
                  onClick={() => handleDropdownToggle('productivity')}
                  aria-haspopup="true"
                  aria-expanded={openDropdown === 'productivity'}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 flex items-center"
                >
                  <span>Productivity</span>
                  <FaChevronDown className={`ml-2 transition-transform duration-200 ${openDropdown === 'productivity' ? 'rotate-180' : ''}`} size={12} />
                </button>
                <AnimatePresence>
                  {openDropdown === 'productivity' && (
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
                            className={({ isActive }) => `block px-4 py-2 text-sm ${isActive ? 'text-white bg-primary/20' : 'text-gray-300'} hover:bg-gray-700/50 hover:text-white`}
                            onClick={() => setOpenDropdown(null)}
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
              <div className="relative" ref={toolsRef}>
                <button
                  onClick={() => handleDropdownToggle('tools')}
                  aria-haspopup="true"
                  aria-expanded={openDropdown === 'tools'}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 flex items-center"
                >
                  <span>Tools</span>
                  <FaChevronDown className={`ml-2 transition-transform duration-200 ${openDropdown === 'tools' ? 'rotate-180' : ''}`} size={12} />
                </button>
                <AnimatePresence>
                  {openDropdown === 'tools' && (
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
                            className={({ isActive }) => `block px-4 py-2 text-sm ${isActive ? 'text-white bg-primary/20' : 'text-gray-300'} hover:bg-gray-700/50 hover:text-white`}
                            onClick={() => setOpenDropdown(null)}
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
                  className="bg-primary hover:bg-primary/80 text-dark-bg font-bold px-4 py-2 rounded-md text-sm transition-colors duration-300"
                >
                  Login
                </NavLink>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <FaTimes className="block h-6 w-6" aria-hidden="true" /> : <FaBars className="block h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            className="md:hidden bg-black/50 backdrop-blur-lg border-t border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {/* Mobile Productivity Dropdown */}
              <div className="space-y-1">
                <button 
                  onClick={() => handleDropdownToggle('productivity-mobile')}
                  className="w-full flex justify-between items-center text-gray-300 hover:text-white px-3 py-3 rounded-md text-base font-medium transition-colors duration-300"
                  aria-haspopup="true"
                  aria-expanded={openDropdown === 'productivity-mobile'}
                >
                  <span>Productivity</span>
                  <FaChevronDown className={`transition-transform duration-200 ${openDropdown === 'productivity-mobile' ? 'rotate-180' : ''}`} size={16} />
                </button>
                <AnimatePresence>
                  {openDropdown === 'productivity-mobile' && (
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
              <div className="space-y-1">
                <button 
                  onClick={() => handleDropdownToggle('tools-mobile')}
                  className="w-full flex justify-between items-center text-gray-300 hover:text-white px-3 py-3 rounded-md text-base font-medium transition-colors duration-300"
                  aria-haspopup="true"
                  aria-expanded={openDropdown === 'tools-mobile'}
                >
                  <span>Tools</span>
                  <FaChevronDown className={`transition-transform duration-200 ${openDropdown === 'tools-mobile' ? 'rotate-180' : ''}`} size={16} />
                </button>
                <AnimatePresence>
                  {openDropdown === 'tools-mobile' && (
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
              
              <div className="border-t border-gray-700 mt-4 pt-4 space-y-1">
                  <NavLink 
                    to="/account" 
                    onClick={closeMobileMenu}
                    className={({ isActive }) => `block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${isActive ? 'bg-gray-700/50 shadow-inner' : ''}`}
                  >
                    Account
                  </NavLink>
                  <button
                    onClick={() => {
                      signOut();
                      closeMobileMenu();
                    }}
                  className="w-full flex items-center text-left text-gray-300 hover:text-red-400 px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 hover:bg-red-500/10"
                  >
                  <FaSignOutAlt className="mr-3" size={18} /> Logout
                  </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar; 