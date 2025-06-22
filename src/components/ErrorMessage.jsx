import { motion } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorMessage = ({ message, onRetry, className = '' }) => {
  return (
    <motion.div
      className={`bg-red-900/50 border border-red-500 rounded-lg p-4 text-center ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-center mb-2">
        <FaExclamationTriangle className="text-red-400 mr-2" />
        <p className="font-bold text-white">Error</p>
      </div>
      <p className="text-sm text-red-300 mb-3">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Try Again
        </button>
      )}
    </motion.div>
  );
};

export default ErrorMessage; 