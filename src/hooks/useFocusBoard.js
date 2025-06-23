import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

export const useFocusBoard = () => {
    const { session } = useAuth();
    const [focusAreas, setFocusAreas] = useState([]);
    const [dailyTasks, setDailyTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const today = format(new Date(), 'yyyy-MM-dd');

    const fetchData = useCallback(async () => {
        if (!session) return;
        setLoading(true);
        try {
            // Fetch both focus areas and today's tasks concurrently
            const [{ data: areasData, error: areasError }, { data: tasksData, error: tasksError }] = await Promise.all([
                supabase.from('focus_areas').select('*').eq('user_id', session.user.id),
                supabase.from('daily_tasks').select('*').eq('user_id', session.user.id).eq('created_at', today)
            ]);

            if (areasError) throw areasError;
            if (tasksError) throw tasksError;

            setFocusAreas(areasData || []);
            setDailyTasks(tasksData || []);
        } catch (error) {
            console.error("Error fetching focus board data:", error);
        } finally {
            setLoading(false);
        }
    }, [session, today]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Focus Areas ---
    const addFocusArea = async (title) => {
        if (!session) return;
        try {
            const { data, error } = await supabase
                .from('focus_areas')
                .insert([{ title, user_id: session.user.id }])
                .select();
            
            if (error) throw error;
            if (data) setFocusAreas(prev => [...prev, data[0]]);
        } catch (error) {
            console.error('Error adding focus area:', error);
        }
    };

    const deleteFocusArea = async (id) => {
        try {
            // Also delete associated tasks for today
            await supabase.from('daily_tasks').delete().eq('focus_area_id', id);
            const { error } = await supabase.from('focus_areas').delete().eq('id', id);
            
            if (error) throw error;
            setFocusAreas(prev => prev.filter(fa => fa.id !== id));
            setDailyTasks(prev => prev.filter(dt => dt.focus_area_id !== id));
        } catch (error) {
            console.error('Error deleting focus area:', error);
        }
    };

    // --- Daily Tasks ---
    const addTask = async (title, focus_area_id = null) => {
        if (!session) return;
        try {
            const { data, error } = await supabase
                .from('daily_tasks')
                .insert([{ title, user_id: session.user.id, focus_area_id }])
                .select();

            if (error) throw error;
            if (data) setDailyTasks(prev => [...prev, data[0]]);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const toggleTask = async (id) => {
        let wasCompleted = false;
        try {
            const task = dailyTasks.find(t => t.id === id);
            if (!task) return false;

            const { data, error } = await supabase
                .from('daily_tasks')
                .update({ is_completed: !task.is_completed })
                .eq('id', id)
                .select();

            if (error) throw error;
            if (data) {
                setDailyTasks(prev => prev.map(t => t.id === id ? data[0] : t));
                if (data[0].is_completed) {
                    wasCompleted = true;
                }
            }
        } catch (error) {
            console.error('Error toggling task:', error);
        }
        return wasCompleted;
    };

    const deleteTask = async (id) => {
        try {
            const { error } = await supabase.from('daily_tasks').delete().eq('id', id);
            if (error) throw error;
            setDailyTasks(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return {
        loading,
        focusAreas,
        dailyTasks,
        addFocusArea,
        deleteFocusArea,
        addTask,
        toggleTask,
        deleteTask
    };
}; 