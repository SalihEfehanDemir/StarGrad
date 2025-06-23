import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

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
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(0);
  const [xpHistory, setXpHistory] = useState({});
  const [lastXPUpdate, setLastXPUpdate] = useState(null);

  // Load from localStorage on initial render
  useEffect(() => {
    const savedXP = localStorage.getItem('totalXP');
    if (savedXP) setTotalXP(parseInt(savedXP, 10));

    const savedHistory = localStorage.getItem('xpHistory');
    if (savedHistory) setXpHistory(JSON.parse(savedHistory));
  }, []);

  // Update level whenever totalXP changes
  useEffect(() => {
    let currentLevel = 0;
    while (currentLevel < LEVEL_THRESHOLDS.length && totalXP >= LEVEL_THRESHOLDS[currentLevel]) {
      currentLevel++;
    }
    setLevel(currentLevel);
  }, [totalXP]);
  
  const addXP = useCallback((amount, source = 'misc') => {
    const newTotalXP = totalXP + amount;
    setTotalXP(newTotalXP);
    localStorage.setItem('totalXP', newTotalXP.toString());
    
    const today = new Date().toISOString().split('T')[0];
    const newHistory = { ...xpHistory };
    if (!newHistory[today]) {
      newHistory[today] = {};
    }
    
    newHistory[today][source] = (newHistory[today][source] || 0) + amount;
    newHistory[today].total = (newHistory[today].total || 0) + amount;

    setXpHistory(newHistory);
    localStorage.setItem('xpHistory', JSON.stringify(newHistory));
    
    // For animation trigger
    setLastXPUpdate({ amount, timestamp: Date.now() });
  }, [totalXP, xpHistory]);
  
  const value = useMemo(() => ({
    totalXP,
    level,
    levelBadge: LEVEL_BADGES[level],
    xpHistory,
    addXP,
    lastXPUpdate
  }), [totalXP, level, xpHistory, addXP, lastXPUpdate]);

  return (
    <XPContext.Provider value={value}>
      {children}
    </XPContext.Provider>
  );
}; 