import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'lg', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-32 w-32',
    xl: 'h-48 w-48'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <motion.div
        className={`animate-spin rounded-full border-t-2 border-b-2 border-brand-blue ${sizeClasses[size]}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};

export default React.memo(LoadingSpinner); 