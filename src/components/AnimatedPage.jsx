import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

const AnimatedPage = ({ children, hasNavbar = true }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    // This targets the scrolling container in MainLayout
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTop = 0;
    }
  }, [pathname]);

  return (
    <motion.div
      key={pathname}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={hasNavbar ? "pt-16 sm:pt-20" : ""}
    >
      {children}
    </motion.div>
  );
};

export default React.memo(AnimatedPage); 