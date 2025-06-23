import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });
    
    // Set initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null); // Explicitly clear the session
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => {
    const signUp = async (data) => {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp(data);

      if (authError) {
        throw authError;
      }
      
      if (authData.user) {
          // Insert into profiles table
          const { error: profileError } = await supabase
              .from('profiles')
              .insert({ 
                  id: authData.user.id, 
                  username: data.options.data.username,
                  total_xp: 0,
                  level: 0,
              });

          if (profileError) {
              // Note: In a real app, you might want to handle this more gracefully,
              // maybe by deleting the user if the profile creation fails.
              throw profileError;
          }
      }
      
      return { data: authData, error: authError };
    };

    return {
      signUp: signUp,
      signIn: (data) => supabase.auth.signInWithPassword(data),
      signOut: handleSignOut,
      session,
      loading,
    };
  }, [session, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 