import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  // URL parametresine göre başlangıç modunu ayarla
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'register') {
      setIsSigningUp(true);
    }
  }, [searchParams]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSigningUp) {
        // Sign up
        const { data, error: authError } = await signUp({
          email,
          password,
          options: {
            data: {
              username: username,
            },
          },
        });
        if (authError) throw authError;
        alert('Sign up successful! Please check your email for the confirmation link.');
      } else {
        // Sign in
        const { data, error: authError } = await signIn({ email, password });
        if (authError) throw authError;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-true-black px-4">
      <div className="w-full max-w-md p-6 sm:p-8 space-y-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-glow-neon-blue">
        <div className="text-center mb-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white" style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.8)' }}>StarGrad</h1>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-100">
          {isSigningUp ? 'Create Account' : 'Sign In'}
        </h2>
        <form className="space-y-6" onSubmit={handleAuth}>
          {isSigningUp && (
            <div>
              <label
                htmlFor="username"
                className="text-sm font-bold text-gray-400"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-3 sm:p-4 mt-2 text-gray-100 bg-gray-800/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-blue text-base"
              />
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="text-sm font-bold text-gray-400"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 sm:p-4 mt-2 text-gray-100 bg-gray-800/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-blue text-base"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-bold text-gray-400"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 sm:p-4 mt-2 text-gray-100 bg-gray-800/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-blue text-base"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 sm:py-4 font-bold text-white uppercase bg-neon-blue rounded-lg hover:bg-neon-blue/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-neon-blue disabled:opacity-50 transition-all duration-300 touch-manipulation text-base"
          >
            {loading
              ? 'Processing...'
              : isSigningUp
              ? 'Sign Up'
              : 'Sign In'}
          </button>
          {error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-center">
                <p className="font-bold text-white">Error</p>
                <p className="text-sm text-red-300">{error}</p>
            </div>
          )}
        </form>
        <div className="text-center">
          <button
            onClick={() => setIsSigningUp(!isSigningUp)}
            className="text-sm text-neon-pink hover:underline"
          >
            {isSigningUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 