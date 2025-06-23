import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Check, Circle, ChevronDown, ChevronUp, CheckSquare } from 'lucide-react';

const AddTaskForm = ({ onAddTask, onDone }) => {
    const [taskText, setTaskText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (taskText.trim()) {
            onAddTask(taskText.trim());
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
                placeholder="Add an inbox task..."
                className="flex-1 min-w-0 px-2 sm:px-3 py-2 bg-dark-bg border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm text-slate-300"
                />
            <button type="submit" className="flex-shrink-0 p-2 bg-primary text-dark-bg rounded-md hover:bg-cyan-400 transition-colors touch-manipulation" aria-label="Add task">
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

const TasksCard = ({ title, tasks, onAddTask, onToggleTask, onDeleteTask, icon }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="bg-glass border border-border-color rounded-xl shadow-md p-4 sm:p-6">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-3">
                    {icon || <CheckSquare size={20} className="text-primary" />}
                    <h2 className="text-lg font-bold text-slate-200">{title}</h2>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsAdding(!isAdding);
                        }}
                        className="p-1 text-light-gray hover:text-primary transition-colors"
                        aria-label="Show add task form"
                    >
                        <Plus size={18} />
                    </button>
                    <span className="sr-only">{isExpanded ? 'Collapse section' : 'Expand section'}</span>
                    {isExpanded ? <ChevronUp size={20} className="text-light-gray" /> : <ChevronDown size={20} className="text-light-gray" />}
                </div>
            </div>

            <AnimatePresence>
            {isExpanded && (
                 <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                >
                    <div className="mt-4 space-y-2">
                        <AnimatePresence>
                {tasks.map(task => (
                                <TaskItem key={task.id} task={task} onToggleTask={onToggleTask} onDeleteTask={onDeleteTask} />
                ))}
                        </AnimatePresence>
                        
                        {tasks.length === 0 && !isAdding && (
                             <p className="text-sm text-light-gray text-center py-4">No tasks here. Add one!</p>
                        )}

                        <AnimatePresence>
                            {isAdding && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <AddTaskForm onAddTask={onAddTask} onDone={() => setIsAdding(false)} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                 </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};

export default React.memo(TasksCard); 