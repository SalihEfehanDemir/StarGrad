import React, { useState, useMemo } from 'react';
import { useNotes } from '../../hooks/useNotes';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Tag, Pin, PinOff, Trash2, Edit, Save, Search, Info } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';

const NoteCard = React.memo(({ note, onEdit, onDelete, onUpdate }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring' }}
            className="rounded-lg shadow-md break-inside-avoid bg-glass border border-border-color"
        >
            <div className="p-4 flex flex-col h-full">
                <div className="flex-grow">
                    <h3 className="font-bold mb-2 text-slate-100">{note.title}</h3>
                    <p className="text-sm whitespace-pre-wrap text-light-gray">{note.content}</p>
                    {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                            {note.tags.map(tag => (
                                <span key={tag} className="text-xs bg-black/20 text-slate-300 px-2 py-1 rounded-full">{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex justify-between items-center mt-4 pt-2 border-t border-border-color">
                    <span className="text-xs text-light-gray">
                        {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
                    </span>
                    <div className="flex items-center gap-1 text-light-gray">
                        <button onClick={() => onUpdate(note.id, { is_pinned: !note.is_pinned })} className="p-2 hover:bg-white/10 rounded-full hover:text-primary transition-colors touch-manipulation">
                            {note.is_pinned ? <PinOff size={14} className="sm:hidden" /> : <Pin size={14} className="sm:hidden" />}
                            {note.is_pinned ? <PinOff size={16} className="hidden sm:block" /> : <Pin size={16} className="hidden sm:block" />}
                </button>
                        <button onClick={() => onEdit(note)} className="p-2 hover:bg-white/10 rounded-full hover:text-primary transition-colors touch-manipulation">
                            <Edit size={14} className="sm:hidden" />
                            <Edit size={16} className="hidden sm:block" />
                </button>
                        <button onClick={() => onDelete(note.id)} className="p-2 hover:bg-white/10 rounded-full hover:text-red-500 transition-colors touch-manipulation">
                            <Trash2 size={14} className="sm:hidden" />
                            <Trash2 size={16} className="hidden sm:block" />
                </button>
            </div>
        </div>
            </div>
        </motion.div>
    );
});

const NoteModal = ({ isOpen, onClose, onSave, currentNote }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);

    React.useEffect(() => {
        if (currentNote) {
            setTitle(currentNote.title);
            setContent(currentNote.content);
            setTags(currentNote.tags || []);
        } else {
            setTitle('');
            setContent('');
            setTags([]);
        }
    }, [currentNote]);

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSave = () => {
        onSave({ title, content, tags });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-xl flex justify-center items-center z-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        className="w-full max-w-2xl rounded-lg shadow-xl bg-dark-bg border border-border-color mx-2 sm:mx-0"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-4 sm:p-6">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-transparent text-xl sm:text-2xl font-bold border-b border-border-color focus:outline-none focus:border-primary pb-2 mb-4 text-slate-100"
                />
                <textarea
                    placeholder="Take a note..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full bg-transparent h-36 sm:h-48 resize-none focus:outline-none mb-4 text-light-gray"
                />
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-2">
                                    {tags.map(tag => (
                                        <div key={tag} className="flex items-center bg-white/10 text-slate-300 pl-3 pr-1 py-1 rounded-full text-sm">
                                            {tag}
                                            <button onClick={() => removeTag(tag)} className="ml-2 rounded-full hover:bg-black/20 p-0.5"><X size={14} /></button>
                                        </div>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Add a tag..."
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                    className="w-full bg-transparent border-b border-border-color focus:outline-none mt-2 text-light-gray"
                                />
                </div>
            </div>
                        <div className="flex justify-end items-center p-4 bg-black/20">
                            <button onClick={handleSave} className="bg-primary text-dark-bg font-semibold py-2 px-4 sm:px-6 rounded-md hover:bg-cyan-400 transition-colors touch-manipulation">
                                Save
                            </button>
        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const SmartNotes = () => {
    const { notes, loading, addNote, updateNote, deleteNote } = useNotes();
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredNotes = useMemo(() => {
        if (!searchTerm) return notes;
        const lowerCaseSearch = searchTerm.toLowerCase();
        return notes.filter(note =>
            note.title.toLowerCase().includes(lowerCaseSearch) ||
            note.content.toLowerCase().includes(lowerCaseSearch) ||
            (note.tags && note.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearch)))
        );
    }, [notes, searchTerm]);

    const handleSaveNote = async (noteData) => {
        // We add the color property, although it's not used for customization anymore.
        // This could be removed if the DB schema is updated.
        const dataToSave = { ...noteData, color: null };

        if (currentNote) {
            updateNote(currentNote.id, dataToSave);
        } else {
            addNote({ is_pinned: false, ...dataToSave });
        }
        setCurrentNote(null);
    };
    
    const handleAddNew = () => {
        setCurrentNote(null);
        setModalOpen(true);
    };

    const handleEdit = (note) => {
        setCurrentNote(note);
        setModalOpen(true);
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 bg-dark-bg min-h-screen">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-100">Smart Notes</h1>
                    <div className="flex items-center gap-4">
                    <div className="relative w-full sm:w-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-light-gray" size={20}/>
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-glass text-slate-100 border border-border-color rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        </div>
                         <button
                            onClick={handleAddNew}
                            className="flex items-center gap-2 bg-primary text-dark-bg font-bold py-2 px-4 rounded-full shadow-lg hover:bg-cyan-400 transition-colors"
                        >
                            <Plus size={20} />
                            <span className="hidden sm:inline">Add Note</span>
                        </button>
                    </div>
                </header>
                
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
                        <AnimatePresence>
                    {filteredNotes.map(note => (
                                <NoteCard
                                    key={note.id}
                                    note={note}
                                    onEdit={handleEdit}
                                    onDelete={deleteNote}
                                    onUpdate={updateNote}
                                />
                    ))}
                        </AnimatePresence>
                </div>
                )}
                
                {!loading && filteredNotes.length === 0 && (
                     <div className="text-center py-16 px-4 bg-glass border border-border-color rounded-lg shadow-sm">
                        <Info size={48} className="mx-auto text-light-gray" />
                        <h3 className="mt-4 text-xl font-semibold text-slate-200">
                            {searchTerm ? 'No notes found' : 'No notes yet'}
                        </h3>
                        <p className="mt-2 text-light-gray">
                            {searchTerm ? `Try a different search term or clear the search.` : `Click "Add Note" to create your first note.`}
                        </p>
                    </div>
                )}
            </div>
            <NoteModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveNote}
                currentNote={currentNote}
            />
        </div>
    );
};

export default SmartNotes;
