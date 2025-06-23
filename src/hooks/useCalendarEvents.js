import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export const useCalendarEvents = () => {
    const { session } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = useCallback(async () => {
        if (!session) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('calendar_events')
                .select('*')
                .eq('user_id', session.user.id);

            if (error) throw error;
            setEvents(data || []);
        } catch (error) {
            console.error("Error fetching calendar events:", error);
        } finally {
            setLoading(false);
        }
    }, [session]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const addEvent = async (eventData) => {
        if (!session) return;
        try {
            const { data, error } = await supabase
                .from('calendar_events')
                .insert([{ ...eventData, user_id: session.user.id }])
                .select();
            
            if (error) throw error;
            if (data) {
                setEvents(prevEvents => [...prevEvents, data[0]]);
            }
        } catch (error) {
            console.error('Error adding event:', error);
        }
    };

    const updateEvent = async (eventId, updatedData) => {
        try {
            const { data, error } = await supabase
                .from('calendar_events')
                .update(updatedData)
                .eq('id', eventId)
                .select();

            if (error) throw error;
            if (data) {
        setEvents(prevEvents =>
            prevEvents.map(event =>
                        event.id === eventId ? data[0] : event
            )
        );
            }
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    const deleteEvent = async (eventId) => {
        try {
            const { error } = await supabase
                .from('calendar_events')
                .delete()
                .eq('id', eventId);
            
            if (error) throw error;
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };
    
    const updateEventStatus = async (eventId, status) => {
        let eventCompleted = false;
        const currentEvent = events.find(e => e.id === eventId);
        if (currentEvent && status === 'done' && currentEvent.status !== 'done') {
                        eventCompleted = true;
                    }

        await updateEvent(eventId, { status });
        
        return eventCompleted;
    };

    return { events, loading, addEvent, updateEvent, deleteEvent, updateEventStatus };
}; 