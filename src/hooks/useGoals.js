import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useGoals = () => {
    const [goals, setGoals] = useState(() => {
        try {
            const savedGoals = localStorage.getItem('goals');
            return savedGoals ? JSON.parse(savedGoals) : [];
        } catch (error) {
            console.error("Failed to parse goals from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('goals', JSON.stringify(goals));
        } catch (error) {
            console.error("Failed to save goals to localStorage", error);
        }
    }, [goals]);

    const addGoal = useCallback((title, deadline) => {
        const newGoal = {
            id: uuidv4(),
            title,
            deadline,
            subtasks: [],
            createdAt: new Date().toISOString(),
        };
        setGoals(prevGoals => [...prevGoals, newGoal]);
    }, []);

    const deleteGoal = useCallback((goalId) => {
        setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
    }, []);

    const addSubtask = useCallback((goalId, taskText) => {
        const newSubtask = {
            id: uuidv4(),
            text: taskText,
            completed: false,
        };
        setGoals(prevGoals => 
            prevGoals.map(goal => 
                goal.id === goalId 
                    ? { ...goal, subtasks: [...goal.subtasks, newSubtask] } 
                    : goal
            )
        );
    }, []);

    const toggleSubtask = useCallback((goalId, subtaskId) => {
        let wasJustCompleted = false;
        setGoals(prevGoals =>
            prevGoals.map(goal => {
                if (goal.id === goalId) {
                    const newSubtasks = goal.subtasks.map(subtask => {
                        if (subtask.id === subtaskId) {
                            if (!subtask.completed) {
                                wasJustCompleted = true;
                            }
                            return { ...subtask, completed: !subtask.completed };
                        }
                        return subtask;
                    });
                    return { ...goal, subtasks: newSubtasks };
                }
                return goal;
            })
        );
        return wasJustCompleted;
    }, []);

    const deleteSubtask = useCallback((goalId, subtaskId) => {
        setGoals(prevGoals => 
            prevGoals.map(goal =>
                goal.id === goalId 
                    ? { ...goal, subtasks: goal.subtasks.filter(st => st.id !== subtaskId) } 
                    : goal
            )
        );
    }, []);

    return {
        goals,
        addGoal,
        deleteGoal,
        addSubtask,
        toggleSubtask,
        deleteSubtask,
    };
}; 