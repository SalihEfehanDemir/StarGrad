import React from 'react';
import { motion } from 'framer-motion';

const ToolCard = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`bg-glass backdrop-blur-xl border border-border-color rounded-2xl shadow-lg p-6 h-full ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default ToolCard; 