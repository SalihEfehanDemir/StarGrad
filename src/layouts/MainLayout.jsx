import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-white">
      <Navbar />
      <main className="flex-grow overflow-y-auto pt-16 sm:pt-20">
        {children}
      </main>
    </div>
  );
};

export default MainLayout; 