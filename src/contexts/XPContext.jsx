import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../supabaseClient';

const XPContext = createContext();

export const useXP = () => {
  const context = useContext(XPContext);
  if (!context) {
    throw new Error('useXP must be used within an XPProvider');
  }
  return context;
};

const LEVEL_THRESHOLDS = [100, 250, 500, 1000, 2000]; // XP needed for each level
const LEVEL_BADGES = ['🥚', '🐣', '🦉', '🧠', '🔥', '🚀']; // Includes level 0

export const XPProvider = ({ children }) => {
  const { session } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastXPUpdate, setLastXPUpdate] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!session) {
        setLoading(false);
        return;
    };
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('total_xp, username, xp_history')
        .eq('id', session.user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // No profile found, create one
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({ 
              id: session.user.id, 
              total_xp: 0, 
              xp_history: {},
              username: session.user.user_metadata?.username || session.user.email.split('@')[0],
          })
          .select()
          .single();
        if (createError) throw createError;
        setProfile(newProfile);
      } else if (error) {
        throw error;
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching or creating user profile:", error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const level = useMemo(() => {
    if (!profile) return 0;
    let currentLevel = 0;
    while (currentLevel < LEVEL_THRESHOLDS.length && profile.total_xp >= LEVEL_THRESHOLDS[currentLevel]) {
      currentLevel++;
    }
    return currentLevel;
  }, [profile]);
  
  const addXP = useCallback(async (amount, source = 'misc') => {
    if (!session || !profile) return;
    
    const newTotalXP = profile.total_xp + amount;
    
    const today = new Date().toISOString().split('T')[0];
    const newHistory = { ...(profile.xp_history || {}) };
    if (!newHistory[today]) newHistory[today] = {};
    newHistory[today][source] = (newHistory[today][source] || 0) + amount;
    newHistory[today].total = (newHistory[today].total || 0) + amount;

    try {
        const { data, error } = await supabase
            .from('profiles')
            .update({ total_xp: newTotalXP, xp_history: newHistory })
            .eq('id', session.user.id)
            .select()
            .single();

        if (error) throw error;
        setProfile(data);
        setLastXPUpdate({ amount, timestamp: Date.now() });
    } catch (error) {
        console.error("Error updating XP:", error);
    }
  }, [session, profile]);

  const updateUsername = useCallback(async (newUsername) => {
    if (!session || !profile) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ username: newUsername })
        .eq('id', session.user.id)
        .select()
        .single();
      
      if (error) throw error;
      setProfile(data);
      // Also update the user's metadata in auth
      await supabase.auth.updateUser({ data: { username: newUsername } });
      return true;
    } catch (error) {
      console.error("Error updating username:", error);
      return false;
    }
  }, [session, profile]);
  
  const value = useMemo(() => ({
    totalXP: profile?.total_xp ?? 0,
    username: profile?.username || (session?.user?.user_metadata?.username),
    level,
    loading,
    levelBadge: LEVEL_BADGES[level],
    xpHistory: profile?.xp_history ?? {},
    addXP,
    updateUsername,
    lastXPUpdate
  }), [profile, level, loading, addXP, updateUsername, lastXPUpdate]);

  return (
    <XPContext.Provider value={value}>
      {children}
    </XPContext.Provider>
  );
}; 