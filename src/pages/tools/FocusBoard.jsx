import React, { useState, useEffect, useCallback } from 'react';
import FocusCard from '../../components/focus-board/FocusCard';
import TasksCard from '../../components/focus-board/TasksCard';
import GoalsCard from '../../components/focus-board/GoalsCard';

const usePersistentState = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue === null) {
      return defaultValue;
    }
    try {
      return JSON.parse(storedValue);
    } catch (error) {
      // If parsing fails, it might be a raw string from a previous version
      console.warn(`Could not parse a value from localStorage for key “${key}”, using it as a raw value.`);
      return storedValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

const FocusBoard = () => {
  const [tasks, setTasks] = usePersistentState('focusBoard-tasks', []);
  const [goals, setGoals] = usePersistentState('focusBoard-goals', []);
  const [focus, setFocus] = usePersistentState('focusBoard-focus', '');

  const handleAddTask = useCallback((text) => {
    setTasks(prevTasks => [...prevTasks, { id: Date.now(), text, done: false }]);
  }, [setTasks]);

  const handleToggleTask = useCallback((id) => {
    setTasks(prevTasks => prevTasks.map(task => task.id === id ? { ...task, done: !task.done } : task));
  }, [setTasks]);

  const handleDeleteTask = useCallback((id) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, [setTasks]);

  const handleAddGoal = useCallback((text) => {
    setGoals(prevGoals => [...prevGoals, { id: Date.now(), text, progress: 0 }]);
  }, [setGoals]);

  const handleUpdateGoalProgress = useCallback((id, newProgress) => {
    const progress = Math.min(100, Math.max(0, newProgress));
    setGoals(prevGoals => prevGoals.map(goal => goal.id === id ? { ...goal, progress } : goal));
  }, [setGoals]);

  const handleDeleteGoal = useCallback((id) => {
    setGoals(prevGoals => prevGoals.filter(goal => goal.id !== id));
  }, [setGoals]);

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Focus Board</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FocusCard focus={focus} setFocus={setFocus} />
          
          <TasksCard 
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />

          <GoalsCard 
            goals={goals}
            onAddGoal={handleAddGoal}
            onUpdateGoal={handleUpdateGoalProgress}
            onDeleteGoal={handleDeleteGoal}
          />
        </div>
      </div>
    </div>
  );
};

export default FocusBoard;
