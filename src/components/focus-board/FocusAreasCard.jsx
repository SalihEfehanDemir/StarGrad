import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Check, Circle, Target, ChevronDown, ChevronUp } from 'lucide-react';

const AddTaskForm = ({ onAddTask, areaId = null, onDone }) => {
    const [taskText, setTaskText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskText.trim()) {
            onAddTask(taskText.trim(), areaId);
            setTaskText('');
            if(onDone) onDone();
        }
    };

  return (
        <form onSubmit={handleSubmit} className="flex gap-2 p-2">
      <input
        type="text"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 min-w-0 px-2 sm:px-3 py-2 bg-dark-bg border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm text-slate-300"
            />
            <button type="submit" className="flex-shrink-0 p-2 bg-primary text-dark-bg rounded-md hover:bg-cyan-400 transition-colors touch-manipulation" aria-label="Add new task">
                <Plus size={16} className="sm:hidden" />
                <Plus size={18} className="hidden sm:block" />
            </button>
        </form>
    );
};

const TaskItem = ({ task, onToggleTask, onDeleteTask }) => {
    const Icon = task.is_completed ? Check : Circle;
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-center justify-between p-2 rounded-md hover:bg-white/5"
        >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <button 
                    onClick={() => onToggleTask(task.id)} 
                    className={`transition-colors p-1 touch-manipulation ${task.is_completed ? 'text-green-500' : 'text-slate-400'}`}
                    aria-label={task.is_completed ? 'Mark task as incomplete' : 'Mark task as complete'}
                >
                    <Icon size={18} className="sm:hidden" />
                    <Icon size={20} className="hidden sm:block" />
                </button>
                <span className={`text-sm truncate ${task.is_completed ? 'line-through text-light-gray' : 'text-slate-300'}`}>
                    {task.title}
                </span>
            </div>
            <button 
                onClick={() => onDeleteTask(task.id)} 
                className="text-light-gray hover:text-red-500 transition-colors opacity-50 hover:opacity-100 p-1 touch-manipulation flex-shrink-0"
                aria-label="Delete task"
            >
                <Trash2 size={14} className="sm:hidden" />
                <Trash2 size={16} className="hidden sm:block" />
            </button>
        </motion.div>
    );
};


const FocusArea = ({ area, tasks, onAddTask, onToggleTask, onDeleteTask, onDeleteArea }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const areaTasks = tasks.filter(t => t.focus_area_id === area.id);

    return (
        <div className="bg-dark-bg border border-border-color rounded-lg shadow-sm p-3 sm:p-4">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <Target size={18} className="text-primary flex-shrink-0" />
                    <h3 className="font-semibold text-base sm:text-lg text-slate-200 truncate">{area.title}</h3>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                     <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteArea(area.id); }} 
                        className="text-light-gray hover:text-red-500 transition-colors p-1"
                        aria-label="Delete focus area"
                    >
                        <Trash2 size={14} className="sm:hidden" />
                        <Trash2 size={16} className="hidden sm:block" />
                    </button>
                    <span className="sr-only">{isExpanded ? 'Collapse section' : 'Expand section'}</span>
                    {isExpanded ? <ChevronUp size={18} className="text-light-gray" /> : <ChevronDown size={18} className="text-light-gray" />}
                </div>
            </div>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1, transition: { duration: 0.3 } }}
                        exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
                        className="overflow-hidden"
                    >
                        <div className="pt-3">
                            <AnimatePresence>
                                {areaTasks.map(task => (
                                    <TaskItem key={task.id} task={task} onToggleTask={onToggleTask} onDeleteTask={onDeleteTask} />
                                ))}
                            </AnimatePresence>
                            <AddTaskForm onAddTask={onAddTask} areaId={area.id} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FocusAreasCard = ({ focusAreas, tasks, onAddArea, onDeleteArea, onAddTask, onToggleTask, onDeleteTask }) => {
    const [newAreaText, setNewAreaText] = useState('');

    const handleAddArea = (e) => {
        e.preventDefault();
        if (newAreaText.trim()) {
            onAddArea(newAreaText.trim());
            setNewAreaText('');
        }
    };
    
    return (
        <div className="p-4 sm:p-6 bg-glass border border-border-color rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-slate-200 mb-4">Focus Areas</h2>
            <div className="space-y-4 mb-4">
                 <AnimatePresence>
                    {focusAreas.map(area => (
                        <FocusArea 
                            key={area.id} 
                            area={area} 
                            tasks={tasks}
                            onAddTask={onAddTask}
                            onToggleTask={onToggleTask}
                            onDeleteTask={onDeleteTask}
                            onDeleteArea={onDeleteArea}
                        />
                    ))}
                </AnimatePresence>
            </div>
            <form onSubmit={handleAddArea} className="flex gap-2 p-2 bg-dark-bg border border-border-color rounded-lg">
                 <input
                    type="text"
                    value={newAreaText}
                    onChange={(e) => setNewAreaText(e.target.value)}
                    placeholder="Add new focus area..."
                    className="flex-1 min-w-0 px-2 sm:px-3 py-2 bg-transparent focus:outline-none text-slate-300"
                />
                <button type="submit" className="flex-shrink-0 p-2 bg-primary text-dark-bg rounded-md hover:bg-cyan-400 transition-colors touch-manipulation" aria-label="Add new focus area">
                    <Plus size={18} className="sm:hidden" />
                    <Plus size={20} className="hidden sm:block" />
                </button>
            </form>
        </div>
    );
};

export default React.memo(FocusAreasCard); 