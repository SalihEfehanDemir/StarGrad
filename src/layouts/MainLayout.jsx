import { Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-white">
      <main className="flex-grow overflow-y-auto">
        {/* AnimatePresence is handled in App.jsx */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout; 