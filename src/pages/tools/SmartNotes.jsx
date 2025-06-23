import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Search, Pin, PinOff, Trash2, Edit } from 'lucide-react';

const NoteCard = React.memo(({ note, onPin, onDelete, onEdit }) => {
    return (
        <div className={`relative p-5 rounded-2xl shadow-lg transition-transform transform hover:-translate-y-1 bg-glass border border-border-color`}>
            {note.pinned && <div className="absolute top-3 right-3 text-primary"><Pin size={18} /></div>}
            <h3 className="text-xl font-bold mb-2 truncate">{note.title}</h3>
            <p className="text-light-gray mb-4 h-24 overflow-hidden text-ellipsis">{note.body}</p>
            <div className="flex items-center justify-end space-x-3 text-light-gray">
                <button onClick={() => onPin(note.id)} className="hover:text-primary transition-colors">
                    {note.pinned ? <PinOff size={20} /> : <Pin size={20} />}
                </button>
                <button onClick={() => onEdit(note)} className="hover:text-green-400 transition-colors">
                    <Edit size={20} />
                </button>
                <button onClick={() => onDelete(note.id)} className="hover:text-red-400 transition-colors">
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    );
});

const NoteModal = ({ note, onSave, onCancel }) => {
    const [title, setTitle] = useState(note?.title || '');
    const [body, setBody] = useState(note?.body || '');

    const handleSave = () => {
        onSave({ ...note, title, body });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-dark-bg rounded-2xl p-8 w-full max-w-md shadow-2xl border border-border-color">
                <h2 className="text-2xl font-bold mb-6">{note?.id ? 'Edit Note' : 'Create Note'}</h2>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 mb-4 bg-white/5 rounded-lg border border-border-color focus:ring-2 focus:ring-primary outline-none"
                />
                <textarea
                    placeholder="Take a note..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows="6"
                    className="w-full p-3 mb-4 bg-white/5 rounded-lg border border-border-color focus:ring-2 focus:ring-primary outline-none"
                />
                <div className="flex justify-end space-x-4">
                    <button onClick={onCancel} className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="px-6 py-2 rounded-lg text-dark-bg bg-primary hover:bg-primary/80 transition-colors">Save</button>
                </div>
            </div>
        </div>
    );
};


const SmartNotes = () => {
    const [notes, setNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    
    useEffect(() => {
        const storedNotes = localStorage.getItem('smartNotes-notes');
        if (storedNotes) {
            setNotes(JSON.parse(storedNotes));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('smartNotes-notes', JSON.stringify(notes));
    }, [notes]);

    const handlePin = useCallback((id) => {
        setNotes(notes => notes.map(note => note.id === id ? { ...note, pinned: !note.pinned } : note));
    }, []);

    const handleDelete = useCallback((id) => {
        setNotes(notes => notes.filter(note => note.id !== id));
    }, []);

    const handleOpenModal = useCallback((note = null) => {
        setEditingNote(note);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = () => {
        setEditingNote(null);
        setIsModalOpen(false);
    };

    const handleSaveNote = (noteToSave) => {
        if (noteToSave.id) { // Editing existing note
            setNotes(notes.map(note => note.id === noteToSave.id ? noteToSave : note));
        } else { // Creating new note
            const newNote = { ...noteToSave, id: Date.now(), pinned: false };
            setNotes([newNote, ...notes]);
        }
        handleCloseModal();
    };
    
    const filteredNotes = useMemo(() => notes
        .filter(note => note.title.toLowerCase().includes(searchTerm.toLowerCase()) || note.body.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => b.pinned - a.pinned), [notes, searchTerm]);

    return (
        <div className="p-4 sm:p-6 md:p-8 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                    <h1 className="text-4xl font-bold">Smart Notes</h1>
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-light-gray" size={20} />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 bg-glass border border-border-color rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </header>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-border-color text-light-gray hover:border-primary hover:text-primary transition-colors bg-white/5 hover:bg-primary/5"
                    >
                        <Plus size={48} />
                        <span className="mt-2 font-semibold">Add New Note</span>
                    </button>
                    {filteredNotes.map(note => (
                        <NoteCard key={note.id} note={note} onPin={handlePin} onDelete={handleDelete} onEdit={handleOpenModal} />
                    ))}
                </div>

                {isModalOpen && <NoteModal note={editingNote} onSave={handleSaveNote} onCancel={handleCloseModal} />}
            </div>
        </div>
    );
};

export default SmartNotes;
