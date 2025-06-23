import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useCalendarEvents = () => {
    const [events, setEvents] = useState(() => {
        try {
            const savedEvents = localStorage.getItem('calendarEvents');
            return savedEvents ? JSON.parse(savedEvents) : [];
        } catch (error) {
            console.error("Failed to parse events from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('calendarEvents', JSON.stringify(events));
        } catch (error) {
            console.error("Failed to save events to localStorage", error);
        }
    }, [events]);

    const addEvent = useCallback((eventData) => {
        const newEvent = {
            id: uuidv4(),
            ...eventData,
            status: 'pending' // 'pending', 'done', 'skipped'
        };
        setEvents(prevEvents => [...prevEvents, newEvent]);
    }, []);

    const updateEvent = useCallback((eventId, updatedData) => {
        setEvents(prevEvents =>
            prevEvents.map(event =>
                event.id === eventId ? { ...event, ...updatedData } : event
            )
        );
    }, []);

    const deleteEvent = useCallback((eventId) => {
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    }, []);
    
    const updateEventStatus = useCallback((eventId, status) => {
        let eventCompleted = false;
        setEvents(prevEvents =>
            prevEvents.map(event => {
                if (event.id === eventId) {
                    if(status === 'done' && event.status !== 'done'){
                        eventCompleted = true;
                    }
                    return { ...event, status };
                }
                return event;
            })
        );
        return eventCompleted;
    }, []);

    return { events, addEvent, updateEvent, deleteEvent, updateEventStatus };
}; 