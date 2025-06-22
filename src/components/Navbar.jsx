import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { session, signOut } = useAuth();

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
            <NavLink to="/" className="text-3xl font-bold text-white tracking-wider" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(59, 130, 246, 0.7)' }}>
              StarGrad
            </NavLink>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/tools/password-generator" className={({ isActive }) => `text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-gray-700/50 shadow-inner' : ''}`}>Password Generator</NavLink>
              <NavLink to="/tools/time-tracker" className={({ isActive }) => `text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-gray-700/50 shadow-inner' : ''}`}>Time Tracker</NavLink>
              <NavLink to="/tools/budget-dashboard" className={({ isActive }) => `text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-gray-700/50 shadow-inner' : ''}`}>Budget Dashboard</NavLink>
              {session && (
                <>
                  <NavLink to="/account" className={({ isActive }) => `text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${isActive ? 'bg-gray-700/50 shadow-inner' : ''}`}>Account</NavLink>
                  <button
                    onClick={signOut}
                    className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 bg-red-600/50 hover:bg-red-500/50"
                  >
                    <FaSignOutAlt className="mr-2" /> Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar; 