import React from 'react';
import { useFocusBoard } from '../../hooks/useFocusBoard';
import { useXP } from '../../contexts/XPContext';
import FocusAreasCard from '../../components/focus-board/FocusAreasCard';
import TasksCard from '../../components/focus-board/TasksCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Award } from 'lucide-react';

const FocusBoard = () => {
    const { 
        loading, 
        focusAreas, 
        dailyTasks, 
        addFocusArea, 
        deleteFocusArea, 
        addTask, 
        toggleTask, 
        deleteTask 
    } = useFocusBoard();

    const { addXP } = useXP();
    const TASK_COMPLETION_XP = 5;

    const handleToggleTask = async (taskId) => {
        const wasCompleted = await toggleTask(taskId);
        if (wasCompleted) {
            addXP(TASK_COMPLETION_XP);
        }
    };

    const unassignedTasks = dailyTasks.filter(task => !task.focus_area_id);
    const completedTasksCount = dailyTasks.filter(task => task.is_completed).length;
    const totalTasksCount = dailyTasks.length;
    
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-dark-bg">
                <LoadingSpinner />
            </div>
        );
    }

  return (
        <div className="min-h-screen bg-dark-bg p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-100">Focus Board</h1>
                    <p className="text-light-gray mt-1">Organize your day, focus on what matters.</p>
                </header>
                
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                    <div className="xl:col-span-2">
                         <FocusAreasCard 
                            focusAreas={focusAreas}
                            tasks={dailyTasks}
                            onAddArea={addFocusArea}
                            onDeleteArea={deleteFocusArea}
                            onAddTask={addTask}
                            onToggleTask={handleToggleTask}
                            onDeleteTask={deleteTask}
                        />
                    </div>
                    <div className="space-y-6">
          <TasksCard 
                            title="Inbox" 
                            tasks={unassignedTasks} 
                            onAddTask={addTask}
            onToggleTask={handleToggleTask}
                            onDeleteTask={deleteTask}
                            icon={<Award size={20} className="text-primary" />}
          />
        </div>
                </div>

                <footer className="text-center p-4 bg-glass border border-border-color rounded-lg shadow-sm">
                    <p className="font-semibold text-slate-300">
                        Today's Progress: {completedTasksCount} / {totalTasksCount} tasks completed
                    </p>
                    <div className="w-full bg-dark-bg rounded-full h-2.5 mt-2">
                        <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0}%` }}
                        ></div>
                    </div>
                </footer>
      </div>
    </div>
  );
};

export default FocusBoard;
