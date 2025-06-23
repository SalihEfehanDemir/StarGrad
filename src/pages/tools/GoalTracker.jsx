import React, { useState, useMemo } from 'react';
import { useGoals } from '../../hooks/useGoals';
import { useXP } from '../../contexts/XPContext';
import { Plus, Trash2, Target, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GoalProgressBar = React.memo(({ goal }) => {
    const completedCount = goal.subtasks.filter(st => st.completed).length;
    const totalCount = goal.subtasks.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <div className="w-full bg-white/10 rounded-full h-2.5 my-2">
            <motion.div
                className="bg-primary h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: 'spring', stiffness: 100 }}
            />
        </div>
    );
});

const AddGoalForm = React.memo(({ addGoal }) => {
    const [title, setTitle] = useState('');
    const [deadline, setDeadline] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim()) {
            addGoal(title.trim(), deadline);
            setTitle('');
            setDeadline('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-glass border border-border-color rounded-2xl mb-8 flex flex-col sm:flex-row gap-4">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your next big goal?"
                className="flex-grow p-3 bg-white/5 rounded-lg border border-border-color focus:ring-2 focus:ring-primary outline-none"
            />
            <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="p-3 bg-white/5 rounded-lg border border-border-color focus:ring-2 focus:ring-primary outline-none"
            />
            <button type="submit" className="flex items-center justify-center p-3 bg-primary hover:bg-primary/80 text-dark-bg rounded-lg font-semibold">
                <Plus className="mr-2" /> Add Goal
            </button>
        </form>
    );
});

const Subtask = React.memo(({ goal, subtask, toggleSubtask, deleteSubtask, addXP }) => {
    const GOAL_XP = 10;

    const handleToggle = () => {
        const wasCompleted = toggleSubtask(goal.id, subtask.id);
        if (wasCompleted) {
            addXP(GOAL_XP, 'goals');
        }
    };

    return (
        <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5">
            <div className="flex items-center">
                <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={handleToggle}
                    className="w-5 h-5 rounded text-primary bg-white/10 border-border-color focus:ring-primary cursor-pointer"
                />
                <span className={`ml-3 ${subtask.completed ? 'line-through text-gray-500' : ''}`}>{subtask.text}</span>
            </div>
            <button onClick={() => deleteSubtask(goal.id, subtask.id)} className="text-gray-500 hover:text-red-500">
                <Trash2 size={16} />
            </button>
        </motion.div>
    );
});

const GoalCard = React.memo(({ goal, deleteGoal, children }) => (
    <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="bg-glass border border-border-color rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-2xl font-bold flex items-center"><Target className="mr-3 text-primary" />{goal.title}</h3>
                {goal.deadline && <p className="text-sm text-light-gray flex items-center mt-1"><Calendar className="mr-2" size={14} />Due: {new Date(goal.deadline).toLocaleDateString()}</p>}
            </div>
            <button onClick={() => deleteGoal(goal.id)} className="text-gray-500 hover:text-red-400"><Trash2 /></button>
        </div>
        <GoalProgressBar goal={goal} />
        {children}
    </motion.div>
));


const GoalTracker = () => {
    const { goals, addGoal, deleteGoal, addSubtask, toggleSubtask, deleteSubtask } = useGoals();
    const { addXP } = useXP();
    const [newSubtaskTexts, setNewSubtaskTexts] = useState({});

    const handleAddSubtask = (goalId) => {
        const text = newSubtaskTexts[goalId];
        if (text && text.trim()) {
            addSubtask(goalId, text.trim());
            setNewSubtaskTexts(prev => ({ ...prev, [goalId]: '' }));
        }
    };

    return (
        <div className="min-h-screen p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold">Goal Tracker</h1>
                    <p className="text-light-gray mt-2">Set your ambitions, break them down, and conquer them.</p>
                </header>

                <AddGoalForm addGoal={addGoal} />
                
                <AnimatePresence>
                    {goals.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map(goal => (
                        <GoalCard key={goal.id} goal={goal} deleteGoal={deleteGoal}>
                            <div className="mt-4">
                                <AnimatePresence>
                                    {goal.subtasks.map(subtask => (
                                        <Subtask key={subtask.id} goal={goal} subtask={subtask} toggleSubtask={toggleSubtask} deleteSubtask={deleteSubtask} addXP={addXP} />
                                    ))}
                                </AnimatePresence>
                                <form onSubmit={(e) => { e.preventDefault(); handleAddSubtask(goal.id); }} className="flex gap-2 mt-2">
                                    <input
                                        type="text"
                                        value={newSubtaskTexts[goal.id] || ''}
                                        onChange={(e) => setNewSubtaskTexts(prev => ({ ...prev, [goal.id]: e.target.value }))}
                                        placeholder="Add a new step..."
                                        className="flex-grow p-2 rounded-lg bg-white/5 border border-border-color focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                    <button type="submit" className="p-2 bg-primary hover:bg-primary/80 text-dark-bg rounded-lg"><Plus /></button>
                                </form>
                            </div>
                        </GoalCard>
                    ))}
                </AnimatePresence>

                {goals.length === 0 && (
                    <div className="text-center py-16 px-6 bg-glass border border-border-color rounded-2xl">
                        <Target size={48} className="mx-auto text-light-gray" />
                        <h3 className="mt-4 text-xl font-semibold">No Goals Yet</h3>
                        <p className="mt-1 text-light-gray">What do you want to achieve? Add your first goal to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GoalTracker; 