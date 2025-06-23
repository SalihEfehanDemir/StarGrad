import React from 'react';
import { motion } from 'framer-motion';
import { useXP } from '../contexts/XPContext';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import { useNotes } from '../hooks/useNotes';
import { useFocusBoard } from '../hooks/useFocusBoard';
import { Target, Award, Calendar, Clock, BarChart2, Edit, CheckSquare } from 'lucide-react';

const achievementsList = [
    {
        id: 'xp_100',
        title: 'Novice Adventurer',
        description: 'Reach 100 XP',
        icon: <Award className="text-bronze" />,
        check: (data) => data.xp >= 100,
    },
    {
        id: 'xp_500',
        title: 'Skilled Explorer',
        description: 'Reach 500 XP',
        icon: <Award className="text-silver" />,
        check: (data) => data.xp >= 500,
    },
    {
        id: 'xp_1000',
        title: 'Master Journeyman',
        description: 'Reach 1000 XP',
        icon: <Award className="text-gold" />,
        check: (data) => data.xp >= 1000,
    },
    {
        id: 'tasks_10',
        title: 'Task Tamer',
        description: 'Complete 10 tasks on the Focus Board',
        icon: <CheckSquare className="text-blue-500" />,
        check: (data) => data.completedTasks >= 10,
    },
    {
        id: 'notes_5',
        title: 'Note Taker',
        description: 'Create 5 smart notes',
        icon: <Edit className="text-yellow-500" />,
        check: (data) => data.notesCount >= 5,
    },
    {
        id: 'events_5',
        title: 'Event Planner',
        description: 'Schedule 5 events in the calendar',
        icon: <Calendar className="text-red-500" />,
        check: (data) => data.eventsCount >= 5,
    },
];

const AchievementCard = ({ achievement, earned }) => {
    return (
        <motion.div
            className={`flex items-center p-4 rounded-lg transition-all duration-300 ${
                earned ? 'bg-green-100 dark:bg-green-900/50 border-l-4 border-green-500' : 'bg-white dark:bg-slate-800'
            }`}
            whileHover={{ scale: earned ? 1.02 : 1.05 }}
        >
            <div className={`mr-4 text-3xl ${earned ? 'text-green-500' : 'text-slate-400'}`}>{achievement.icon}</div>
            <div>
                <h3 className={`font-bold ${earned ? 'text-slate-800 dark:text-slate-100' : 'text-slate-600 dark:text-slate-300'}`}>
                    {achievement.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{achievement.description}</p>
            </div>
        </motion.div>
    );
};

const Achievements = () => {
    const { totalXP } = useXP();
    const { events } = useCalendarEvents();
    const { notes } = useNotes();
    const { dailyTasks } = useFocusBoard();

    const data = {
        xp: totalXP,
        eventsCount: events.length,
        notesCount: notes.length,
        completedTasks: dailyTasks.filter(t => t.is_completed).length,
    };

    const earnedAchievements = achievementsList.filter(a => a.check(data));
    const notEarnedAchievements = achievementsList.filter(a => !a.check(data));

    return (
        <div className="p-4 md:p-6">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {earnedAchievements.map((ach) => (
                    <AchievementCard key={ach.id} achievement={ach} earned={true} />
                ))}
                {notEarnedAchievements.map((ach) => (
                    <AchievementCard key={ach.id} achievement={ach} earned={false} />
                ))}
            </div>
        </div>
    );
};

export default React.memo(Achievements); 