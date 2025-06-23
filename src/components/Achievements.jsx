import React from 'react';
import { motion } from 'framer-motion';
import { useXP } from '../contexts/XPContext';
import { useGoals } from '../hooks/useGoals';
import { Target, Award, Calendar, Clock, BarChart2 } from 'lucide-react';

const achievementsList = [
    {
        id: 'GOAL_GETTER',
        title: 'Goal Getter',
        description: 'Complete your first goal.',
        icon: <Target />,
        check: ({ goals }) => goals.some(g => g.subtasks.length > 0 && g.subtasks.every(st => st.completed)),
    },
    {
        id: 'STREAK_MASTER_7',
        title: 'Weekly Warrior',
        description: 'Be active for 7 consecutive days.',
        icon: <Calendar />,
        check: ({ xpHistory }) => checkStreak(xpHistory, 7),
    },
    {
        id: 'TIME_BENDER_50',
        title: 'Time Bender',
        description: 'Complete 50 Pomodoro sessions.',
        icon: <Clock />,
        check: () => (parseInt(localStorage.getItem('sessionCount') || '0', 10) >= 50),
    },
    {
        id: 'XP_NOVICE',
        title: 'Novice Adventurer',
        description: 'Earn your first 100 XP.',
        icon: <Award />,
        check: ({ totalXP }) => totalXP >= 100,
    },
    {
        id: 'XP_MASTER',
        title: 'XP Master',
        description: 'Reach a total of 1000 XP.',
        icon: <BarChart2 />,
        check: ({ totalXP }) => totalXP >= 1000,
    },
];

const checkStreak = (xpHistory, length) => {
    const dates = Object.keys(xpHistory).sort();
    if (dates.length < length) return false;
    let consecutiveDays = 0;
    let lastDate = null;
    
    for (const dateStr of dates) {
        const currentDate = new Date(dateStr);
        if (lastDate) {
            const diff = (currentDate - lastDate) / (1000 * 60 * 60 * 24);
            if (diff === 1) {
                consecutiveDays++;
            } else {
                consecutiveDays = 1;
            }
        } else {
            consecutiveDays = 1;
        }
        if (consecutiveDays >= length) return true;
        lastDate = currentDate;
    }
    return false;
};


const Achievements = () => {
    const { totalXP, xpHistory } = useXP();
    const { goals } = useGoals();

    const unlockedAchievements = achievementsList.filter(ach => ach.check({ totalXP, xpHistory, goals }));

    return (
        <div className="bg-glass border border-border-color p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">Achievements</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {achievementsList.map(ach => {
                    const isUnlocked = unlockedAchievements.some(unlocked => unlocked.id === ach.id);
                    return (
                        <motion.div
                            key={ach.id}
                            className={`p-4 rounded-lg flex flex-col items-center justify-center text-center transition-all duration-300 ${
                                isUnlocked ? 'bg-primary/10 text-primary' : 'bg-white/5 text-light-gray'
                            }`}
                            title={`${ach.title}: ${ach.description}`}
                        >
                            <div className={`text-4xl ${isUnlocked ? 'text-primary' : 'text-gray-600'}`}>
                                {ach.icon}
                            </div>
                            <h4 className="font-bold mt-2 text-sm">{ach.title}</h4>
                            {!isUnlocked && <p className="text-xs text-gray-600">(Locked)</p>}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Achievements; 