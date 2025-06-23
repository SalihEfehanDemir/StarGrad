import React, { useState } from 'react';
import ToolCard from '../ToolCard';
import { Plus, Trash2 } from 'lucide-react';

const TaskItem = React.memo(({ task, onToggle, onDelete }) => (
    <li className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
        <span
            className={`cursor-pointer ${task.done ? 'line-through text-gray-500' : ''}`}
            onClick={() => onToggle(task.id)}
        >
            {task.text}
        </span>
        <button onClick={() => onDelete(task.id)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
    </li>
));

const TasksCard = React.memo(({ tasks, onAddTask, onToggleTask, onDeleteTask }) => {
    const [newTask, setNewTask] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newTask.trim()) {
            onAddTask(newTask.trim());
            setNewTask('');
        }
    };

    return (
        <ToolCard>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Daily Tasks</h2>
            <form onSubmit={handleSubmit} className="flex mb-4 gap-2">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task..."
                    className="flex-grow p-2 rounded-lg bg-white/5 border border-border-color focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button type="submit" className="p-2 bg-primary hover:bg-primary/80 text-dark-bg rounded-lg"><Plus /></button>
            </form>
            <ul className="space-y-3">
                {tasks.map(task => (
                    <TaskItem key={task.id} task={task} onToggle={onToggleTask} onDelete={onDeleteTask} />
                ))}
            </ul>
        </ToolCard>
    );
});

export default TasksCard; 