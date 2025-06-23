import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export const useNotes = () => {
    const { session } = useAuth();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotes = useCallback(async () => {
        if (!session) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('notes')
                .select('*')
                .eq('user_id', session.user.id)
                .order('is_pinned', { ascending: false })
                .order('updated_at', { ascending: false });

            if (error) throw error;
            setNotes(data || []);
        } catch (error) {
            console.error("Error fetching notes:", error);
        } finally {
            setLoading(false);
        }
    }, [session]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const addNote = async (noteData) => {
        if (!session) return null;
        try {
            const { data, error } = await supabase
                .from('notes')
                .insert([{ ...noteData, user_id: session.user.id }])
                .select();
            
            if (error) throw error;
            if (data) {
                setNotes(prev => [data[0], ...prev]);
                return data[0];
            }
        } catch (error) {
            console.error('Error adding note:', error);
            return null;
        }
    };

    const updateNote = async (noteId, updatedData) => {
        try {
            const { data, error } = await supabase
                .from('notes')
                .update(updatedData)
                .eq('id', noteId)
                .select();

            if (error) throw error;
            if (data) {
                setNotes(prev => 
                    prev.map(n => n.id === noteId ? data[0] : n)
                        .sort((a, b) => b.is_pinned - a.is_pinned || new Date(b.updated_at) - new Date(a.updated_at))
                );
            }
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    const deleteNote = async (noteId) => {
        try {
            const { error } = await supabase
                .from('notes')
                .delete()
                .eq('id', noteId);
            
            if (error) throw error;
            setNotes(prev => prev.filter(n => n.id !== noteId));
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    return { notes, loading, addNote, updateNote, deleteNote };
}; 