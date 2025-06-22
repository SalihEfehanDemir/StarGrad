import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log(`Attempting to ${isSigningUp ? 'sign up' : 'sign in'} with:`, email);

    if (isSigningUp) {
      const { data, error: authError } = await signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
        },
      });
      console.log('Supabase signup response:', { data, authError });
      if (authError) {
        console.error('Authentication Error Object:', authError);
        setError(authError.message);
      } else {
        console.log('Sign up successful. Please check email for confirmation.');
        alert('Sign up successful! Please check your email for the confirmation link.');
        setIsSigningUp(false);
      }
    } else {
      const { data, error: authError } = await signIn({ email, password });
      console.log('Supabase signin response:', { data, authError });
      if (authError) {
        console.error('Authentication Error Object:', authError);
        setError(authError.message);
      } else {
        console.log('Sign in successful. State will now update and trigger navigation.');
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-true-black">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-glow-neon-blue">
        <div className="text-center mb-4">
          <h1 className="text-5xl font-bold text-white" style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.8)' }}>StarGrad</h1>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-100">
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
                className="w-full p-3 mt-2 text-gray-100 bg-gray-800/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-blue"
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
              className="w-full p-3 mt-2 text-gray-100 bg-gray-800/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-blue"
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
              className="w-full p-3 mt-2 text-gray-100 bg-gray-800/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-blue"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-bold text-white uppercase bg-neon-blue rounded-lg hover:bg-neon-blue/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-neon-blue disabled:opacity-50 transition-all duration-300"
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