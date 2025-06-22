import { useEffect } from 'react';

const usePerformance = (componentName) => {
  useEffect(() => {
    // Only run in development mode
    if (import.meta.env.DEV) {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        console.log(`${componentName} render time: ${endTime - startTime}ms`);
      };
    }
  }, [componentName]);

  // Web Vitals monitoring (for production)
  useEffect(() => {
    if (!import.meta.env.DEV && 'web-vital' in window) {
      // This would integrate with web vitals library if added
      // For now, just basic performance API usage
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            console.log('Page Load Time:', entry.loadEventEnd - entry.loadEventStart);
          }
        });
      });
      
      observer.observe({ entryTypes: ['navigation'] });
      
      return () => observer.disconnect();
    }
  }, []);
};

export default usePerformance; 