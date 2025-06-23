import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, isSameDay, parseISO, isValid } from 'date-fns';
import { useCalendarEvents } from '../../hooks/useCalendarEvents';
import { useXP } from '../../contexts/XPContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Calendar as CalendarIcon, Clock, Check, SkipForward } from 'lucide-react';

const colors = [ 'primary', 'secondary', 'slate', 'gray', 'purple', 'pink' ];
const colorClasses = {
    primary: { bg: 'bg-primary/10', border: 'border-primary', text: 'text-primary' },
    secondary: { bg: 'bg-secondary/10', border: 'border-secondary', text: 'text-secondary' },
    slate: { bg: 'bg-slate-500/10', border: 'border-slate-500', text: 'text-slate-300' },
    gray: { bg: 'bg-gray-500/10', border: 'border-gray-500', text: 'text-gray-300' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500', text: 'text-purple-300' },
    pink: { bg: 'bg-pink-500/10', border: 'border-pink-500', text: 'text-pink-300' },
};

const EventModal = ({ isOpen, onClose, onSave, event }) => {
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('12:00');
    const [color, setColor] = useState('primary');

    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setTime(event.time);
            setColor(event.color || 'primary');
        } else {
            setTitle('');
            setTime('12:00');
            setColor('primary');
        }
    }, [event]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ title, time, color });
        onClose();
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-dark-bg border border-border-color rounded-lg p-6 w-full max-w-md relative shadow-2xl">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white"><X /></button>
                <h2 className="text-xl font-bold mb-4">{event ? 'Edit Event' : 'Add Event'}</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Event Title" className="w-full p-3 mb-4 bg-white/5 rounded-lg border border-border-color focus:ring-2 focus:ring-primary outline-none" required />
                    <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full p-3 mb-4 bg-white/5 rounded-lg border border-border-color focus:ring-2 focus:ring-primary outline-none" required/>
                    <div className="flex justify-around mb-4">
                        {colors.map(c => (
                            <button type="button" key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full ${colorClasses[c].text.replace('text-', 'bg-')} ${color === c ? 'ring-2 ring-white' : ''}`}></button>
                        ))}
                    </div>
                    <button type="submit" className="w-full bg-primary hover:bg-primary/80 text-dark-bg p-3 rounded-lg font-bold">Save Event</button>
                </form>
            </motion.div>
        </motion.div>
    );
};


const CalendarPage = () => {
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const { events, addEvent, updateEvent, deleteEvent, updateEventStatus } = useCalendarEvents();
    const { addXP } = useXP();
    const EVENT_XP = 15;

    const handleSelectDay = (day) => {
        if (day) {
            setSelectedDay(day);
        } else {
            setSelectedDay(new Date());
        }
    };
    
    const handleEventSave = (eventData) => {
        const date = format(selectedDay, 'yyyy-MM-dd');
        if (editingEvent) {
            updateEvent(editingEvent.id, { ...eventData, date });
        } else {
            addEvent({ ...eventData, date });
        }
        setEditingEvent(null);
    };
    
    const handleStatusUpdate = (eventId, status) => {
        const completed = updateEventStatus(eventId, status);
        if (completed) {
            addXP(EVENT_XP, 'calendar');
        }
    };

    const daysWithEvents = useMemo(() => {
        return events.map(e => parseISO(e.date)).filter(d => isValid(d));
    }, [events]);

    const eventsForSelectedDay = useMemo(() => {
        if (!selectedDay || !isValid(selectedDay)) return [];
        return events.filter(e => {
            const eventDate = parseISO(e.date);
            return isValid(eventDate) && isSameDay(eventDate, selectedDay);
        }).sort((a,b) => a.time.localeCompare(b.time));
    }, [events, selectedDay]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="min-h-screen flex flex-col md:flex-row p-4 gap-4">
                <EventModal
                    isOpen={isModalOpen}
                    onClose={() => { setModalOpen(false); setEditingEvent(null); }}
                    onSave={handleEventSave}
                    event={editingEvent}
                />

                <aside className="w-full md:w-1/3 lg:w-1/4 p-4 bg-glass backdrop-blur-xl border border-border-color rounded-2xl shadow-xl">
                    <DayPicker
                        mode="single"
                        selected={selectedDay}
                        onSelect={handleSelectDay}
                        defaultMonth={selectedDay}
                        classNames={{
                            head_cell: 'text-light-gray font-normal',
                            cell: 'text-center',
                            day: 'h-10 w-10 rounded-full hover:bg-primary/20 transition-colors',
                            day_selected: 'bg-primary text-dark-bg hover:bg-primary/90',
                            day_today: 'text-primary font-bold ring-1 ring-primary',
                            day_outside: 'text-slate-600',
                        }}
                        required
                        modifiers={{ hasEvent: daysWithEvents }}
                        modifiersClassNames={{
                            hasEvent: 'day-with-event',
                        }}
                    />
                </aside>

                <main className="flex-1 p-6 bg-glass backdrop-blur-xl border border-border-color rounded-2xl shadow-xl">
                    <header className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold">
                                {selectedDay && isValid(selectedDay) ? format(selectedDay, 'MMMM d, yyyy') : 'Select a day'}
                            </h1>
                            <p className="text-light-gray">{selectedDay ? format(selectedDay, 'eeee') : ''}</p>
                        </div>
                        <button 
                            onClick={() => { setEditingEvent(null); setModalOpen(true); }} 
                            className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-dark-bg font-bold py-2 px-4 rounded-lg disabled:bg-gray-600"
                            disabled={!selectedDay}
                        >
                            <Plus size={20} /> Add Event
                        </button>
                    </header>
                    
                    <div className="space-y-4">
                        <AnimatePresence>
                            {eventsForSelectedDay.length > 0 ? (
                                eventsForSelectedDay.map(event => {
                                    const colorClass = colorClasses[event.color] || colorClasses['primary'];
                                    return (
                                        <motion.div
                                            key={event.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -30 }}
                                            className={`p-4 rounded-lg border-l-4 ${colorClass.bg} ${colorClass.border}`}
                                        >
                                            <div className="flex justify-between">
                                                <div>
                                                    <p className={`font-bold text-lg ${colorClass.text}`}>{event.title}</p>
                                                    <p className="text-light-gray text-sm flex items-center gap-2"><Clock size={14} /> {event.time}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {event.status === 'pending' && <>
                                                        <button onClick={() => handleStatusUpdate(event.id, 'done')} className="p-2 hover:bg-green-500/20 rounded-full text-green-400"><Check/></button>
                                                        <button onClick={() => handleStatusUpdate(event.id, 'skipped')} className="p-2 hover:bg-yellow-500/20 rounded-full text-yellow-400"><SkipForward/></button>
                                                    </>}
                                                    {event.status === 'done' && <span className="text-green-400 font-bold">Done! +{EVENT_XP}XP</span>}
                                                    {event.status === 'skipped' && <span className="text-yellow-400">Skipped</span>}
                                                    <button onClick={() => { 
                                                        const eventDate = parseISO(event.date);
                                                        if(isValid(eventDate)) {
                                                            setEditingEvent(event); 
                                                            setSelectedDay(eventDate); 
                                                            setModalOpen(true); 
                                                        }
                                                    }} className="p-2 hover:bg-white/10 rounded-full"><Edit size={16}/></button>
                                                    <button onClick={() => deleteEvent(event.id)} className="p-2 hover:bg-red-500/20 rounded-full text-red-400"><Trash2 size={16}/></button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })
                            ) : (
                                <div className="text-center py-12 text-slate-500">
                                    <CalendarIcon size={48} className="mx-auto" />
                                    <p className="mt-4">{selectedDay ? 'No events scheduled for this day.' : 'Select a day to see events.'}</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CalendarPage; 