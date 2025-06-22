import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient'; // Import supabase client

const AccountPage = () => {
  const { session } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(session?.user?.user_metadata?.username || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 text-white">
        Loading user information...
      </div>
    );
  }

  const { user } = session;

  const handleUpdateUsername = async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.updateUser({
      data: { username: username }
    });

    if (error) {
      setError(error.message);
      console.error('Error updating username:', error);
    } else {
      setIsEditing(false);
      // The session should update automatically via onAuthStateChange,
      // but we can also update the local state for immediate feedback.
      setUsername(data.user.user_metadata.username);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg p-8"
      >
        <h1 className="text-4xl font-bold text-white mb-6" style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.7)' }}>
          My Account
        </h1>
        <div className="space-y-4">
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-400">Username</p>
                    {isEditing ? (
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 mt-1 text-gray-100 bg-gray-800/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-blue"
                        />
                    ) : (
                        <p className="text-xl font-semibold">{user.user_metadata?.username || 'Not set'}</p>
                    )}
                </div>
                {isEditing ? (
                    <div className="flex space-x-2">
                        <button onClick={handleUpdateUsername} disabled={loading} className="text-sm font-bold text-white bg-green-600/80 hover:bg-green-500/80 px-3 py-1 rounded-md transition-colors">
                            {loading ? '...' : 'Save'}
                        </button>
                        <button onClick={() => setIsEditing(false)} className="text-sm font-bold text-white bg-red-600/80 hover:bg-red-500/80 px-3 py-1 rounded-md transition-colors">
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="text-sm font-bold text-white bg-neon-blue/80 hover:bg-neon-blue px-3 py-1 rounded-md transition-colors">
                        Edit
                    </button>
                )}
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Email</p>
            <p className="text-xl font-semibold">{user.email}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <p className="text-sm text-gray-400">User ID</p>
            <p className="text-xl font-mono text-gray-300 break-all">{user.id}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Last Signed In</p>
            <p className="text-xl font-semibold">{new Date(user.last_sign_in_at).toLocaleString()}</p>
          </div>
        </div>
        {error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-center">
                <p className="font-bold text-white">Error</p>
                <p className="text-sm text-red-300">{error}</p>
            </div>
        )}
      </motion.div>
    </div>
  );
};

export default AccountPage; 