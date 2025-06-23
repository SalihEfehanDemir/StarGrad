import React, { useState, useMemo } from 'react';
import ToolCard from '../ToolCard';
import ProgressRing from '../focus/ProgressRing';
import CustomSlider from '../CustomSlider';
import { Plus, Trash2 } from 'lucide-react';

const GoalItem = React.memo(({ goal, onUpdate, onDelete }) => (
    <li className="bg-white/5 p-3 rounded-lg">
        <div className="flex items-center justify-between mb-2">
            <span>{goal.text}</span>
            <button onClick={() => onDelete(goal.id)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
        </div>
        <CustomSlider
            min={0}
            max={100}
            value={goal.progress}
            onChange={(newProgress) => onUpdate(goal.id, newProgress)}
        />
    </li>
));

const GoalsCard = React.memo(({ goals, onAddGoal, onUpdateGoal, onDeleteGoal }) => {
    const [newGoal, setNewGoal] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newGoal.trim()) {
            onAddGoal(newGoal.trim());
            setNewGoal('');
        }
    };

    const totalProgress = useMemo(() => {
        if (goals.length === 0) return 0;
        const total = goals.reduce((sum, goal) => sum + goal.progress, 0);
        return Math.round(total / goals.length);
    }, [goals]);

    return (
        <ToolCard className="md:col-span-2 lg:col-span-1">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Weekly Goals</h2>
            <div className="flex items-center justify-center mb-6">
                <ProgressRing progress={totalProgress} size={150} strokeWidth={10}>
                    <span className="text-2xl font-bold">{totalProgress}%</span>
                </ProgressRing>
            </div>
            <form onSubmit={handleSubmit} className="flex mb-4 gap-2">
                <input
                    type="text"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder="Add a new goal..."
                    className="flex-grow p-2 rounded-lg bg-white/5 border border-border-color focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button type="submit" className="p-2 bg-primary hover:bg-primary/80 text-dark-bg rounded-lg"><Plus /></button>
            </form>
            <ul className="space-y-3">
                {goals.map(goal => (
                    <GoalItem key={goal.id} goal={goal} onUpdate={onUpdateGoal} onDelete={onDeleteGoal} />
                ))}
            </ul>
        </ToolCard>
    );
});

export default GoalsCard; 