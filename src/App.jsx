import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/LoginPage';
import PasswordGenerator from './pages/tools/PasswordGenerator';
import TimeTracker from './pages/tools/TimeTracker';
import BudgetDashboard from './pages/tools/BudgetDashboard';
import AccountPage from './pages/AccountPage';
import './App.css';

// A component to protect routes
const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex justify-center items-center bg-dark-bg">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// The main routes for the application
const AppRoutes = () => {
  const { session } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route 
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/tools/password-generator" element={<PasswordGenerator />} />
                  <Route path="/tools/time-tracker" element={<TimeTracker />} />
                  <Route path="/tools/budget-dashboard" element={<BudgetDashboard />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App; 