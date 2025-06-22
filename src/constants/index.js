// App Configuration
export const APP_CONFIG = {
  name: 'StarGrad',
  description: 'Your All-in-One Utility App',
  version: '1.0.0',
};

// Animation Durations
export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
};

// Default Values
export const DEFAULTS = {
  passwordLength: 12,
  transactionLimit: 20,
  accountTypes: {
    checking: 'checking',
    savings: 'savings',
    credit: 'credit',
  },
};

// UI Constants
export const UI_CONSTANTS = {
  navbarHeight: 80,
  loadingSpinnerSizes: {
    sm: 'h-8 w-8',
    md: 'h-16 w-16', 
    lg: 'h-32 w-32',
    xl: 'h-48 w-48',
  },
};

// Routes
export const ROUTES = {
  home: '/',
  login: '/login',
  account: '/account',
  tools: {
    passwordGenerator: '/tools/password-generator',
    timeTracker: '/tools/time-tracker',
    budgetDashboard: '/tools/budget-dashboard',
  },
};

// Supabase Table Names
export const TABLES = {
  accounts: 'accounts',
  transactions: 'transactions',
}; 