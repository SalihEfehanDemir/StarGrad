import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/LoginPage';
import PasswordGenerator from './pages/tools/PasswordGenerator';
import TimeTracker from './pages/tools/TimeTracker';
import BudgetDashboard from './pages/tools/BudgetDashboard';
import AccountPage from './pages/AccountPage';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

// A component to protect routes
const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full bg-dark-bg">
        <LoadingSpinner className="h-full" />
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
      
      {/* Public Homepage */}
      <Route 
        path="/" 
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        } 
      />
      
      {/* Protected Tool Routes */}
      <Route 
        path="/tools/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Routes>
                <Route path="password-generator" element={<PasswordGenerator />} />
                <Route path="time-tracker" element={<TimeTracker />} />
                <Route path="budget-dashboard" element={<BudgetDashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      {/* Protected Account Route */}
      <Route 
        path="/account" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <AccountPage />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
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