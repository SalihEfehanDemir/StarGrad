import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/LoginPage';
import PasswordGenerator from './pages/tools/PasswordGenerator';
import BudgetDashboard from './pages/tools/BudgetDashboard';
import FocusBoard from './pages/tools/FocusBoard';
import SmartNotes from './pages/tools/SmartNotes';
import BMICalculator from './pages/tools/BMICalculator';
import ZenMode from './pages/tools/ZenMode';
import PomodoroTimer from './pages/tools/PomodoroTimer';
import AccountPage from './pages/AccountPage';
import LoadingSpinner from './components/LoadingSpinner';
import Navbar from './components/Navbar';
import XPDisplay from './components/XPDisplay';
import CalendarPage from './pages/tools/CalendarPage';
import AnimatedPage from './components/AnimatedPage';
import { AnimatePresence } from 'framer-motion';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { session } = useAuth();
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRoutes = () => {
  const { session } = useAuth();
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/login"
          element={
            <AnimatedPage hasNavbar={false}>
              {session ? <Navigate to="/" replace /> : <LoginPage />}
            </AnimatedPage>
          }
        />
        <Route element={<MainLayout />}>
          <Route path="/" element={<AnimatedPage><HomePage /></AnimatedPage>} />
          <Route path="/account" element={<ProtectedRoute><AnimatedPage><AccountPage /></AnimatedPage></ProtectedRoute>} />
          <Route path="/tools/focus-board" element={<ProtectedRoute><AnimatedPage><FocusBoard /></AnimatedPage></ProtectedRoute>} />
          <Route path="/tools/smart-notes" element={<ProtectedRoute><AnimatedPage><SmartNotes /></AnimatedPage></ProtectedRoute>} />
          <Route path="/tools/bmi-calculator" element={<AnimatedPage><BMICalculator /></AnimatedPage>} />
          <Route path="/tools/password-generator" element={<AnimatedPage><PasswordGenerator /></AnimatedPage>} />
          <Route path="/tools/zen-mode" element={<AnimatedPage><ZenMode /></AnimatedPage>} />
          <Route path="/tools/pomodoro-timer" element={<AnimatedPage><PomodoroTimer /></AnimatedPage>} />
          <Route path="/tools/budget-dashboard" element={<ProtectedRoute><AnimatedPage><BudgetDashboard /></AnimatedPage></ProtectedRoute>} />
          <Route path="/tools/calendar" element={<ProtectedRoute><AnimatedPage><CalendarPage /></AnimatedPage></ProtectedRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const { loading, session } = useAuth();
  const location = useLocation();
  const hideNavbarAndXP = location.pathname === '/login';

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-dark-bg"><LoadingSpinner /></div>;
  }

  return (
    <>
      {!hideNavbarAndXP && (
    <>
      <Navbar />
      <XPDisplay />
        </>
      )}
      <AppRoutes />
    </>
  );
}

export default App; 