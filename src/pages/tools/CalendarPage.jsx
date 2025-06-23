import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, isSameDay, parseISO, isValid } from 'date-fns';
import { useCalendarEvents } from '../../hooks/useCalendarEvents';
import { useXP } from '../../contexts/XPContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Calendar as CalendarIcon, Clock, Check, SkipForward } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

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
            <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-dark-bg border border-border-color rounded-lg p-4 sm:p-6 w-full max-w-md relative shadow-2xl mx-2 sm:mx-0">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white touch-manipulation p-1"><X size={20} /></button>
                <h2 className="text-lg sm:text-xl font-bold mb-4 pr-8">{event ? 'Edit Event' : 'Add Event'}</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Event Title" className="w-full p-2.5 sm:p-3 mb-4 bg-white/5 rounded-lg border border-border-color focus:ring-2 focus:ring-primary outline-none text-sm sm:text-base" required />
                    <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full p-2.5 sm:p-3 mb-4 bg-white/5 rounded-lg border border-border-color focus:ring-2 focus:ring-primary outline-none text-sm sm:text-base" required/>
                    <div className="flex justify-around mb-4">
                        {colors.map(c => (
                            <button type="button" key={c} onClick={() => setColor(c)} className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${colorClasses[c].text.replace('text-', 'bg-')} ${color === c ? 'ring-2 ring-white' : ''} touch-manipulation`}></button>
                        ))}
                    </div>
                    <button type="submit" className="w-full bg-primary hover:bg-primary/80 text-dark-bg p-2.5 sm:p-3 rounded-lg font-bold touch-manipulation">Save Event</button>
                </form>
            </motion.div>
        </motion.div>
    );
};


const CalendarPage = () => {
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const { events, loading, addEvent, updateEvent, deleteEvent, updateEventStatus } = useCalendarEvents();
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
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
            <div className="min-h-screen flex flex-col lg:flex-row p-3 sm:p-4 gap-4">
                <EventModal
                    isOpen={isModalOpen}
                    onClose={() => { setModalOpen(false); setEditingEvent(null); }}
                    onSave={handleEventSave}
                    event={editingEvent}
                />

                <aside className="w-full lg:w-1/3 xl:w-1/4 p-3 sm:p-4 bg-glass backdrop-blur-xl border border-border-color rounded-2xl shadow-xl">
                    <DayPicker
                        mode="single"
                        selected={selectedDay}
                        onSelect={handleSelectDay}
                        defaultMonth={selectedDay}
                        classNames={{
                            head_cell: 'text-light-gray font-normal text-sm',
                            cell: 'text-center',
                            day: 'h-8 w-8 sm:h-10 sm:w-10 rounded-full hover:bg-primary/20 transition-colors text-sm sm:text-base',
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

                <main className="flex-1 p-4 sm:p-6 bg-glass backdrop-blur-xl border border-border-color rounded-2xl shadow-xl">
                    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0">
                        <div className="min-w-0 flex-1">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">
                                {selectedDay && isValid(selectedDay) ? format(selectedDay, 'MMMM d, yyyy') : 'Select a day'}
                            </h1>
                            <p className="text-light-gray text-sm sm:text-base">{selectedDay ? format(selectedDay, 'eeee') : ''}</p>
                        </div>
                        <button 
                            onClick={() => { setEditingEvent(null); setModalOpen(true); }} 
                            className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-dark-bg font-bold py-2 px-3 sm:px-4 rounded-lg disabled:bg-gray-600 text-sm sm:text-base touch-manipulation w-full sm:w-auto justify-center"
                            disabled={!selectedDay}
                        >
                            <Plus size={16} className="sm:hidden" />
                            <Plus size={20} className="hidden sm:block" />
                            <span>Add Event</span>
                        </button>
                    </header>
                    
                    <div className="space-y-4">
                        <AnimatePresence>
                            {loading ? (
                                <div className="flex justify-center items-center h-full pt-16">
                                    <LoadingSpinner />
                                </div>
                            ) : eventsForSelectedDay.length > 0 ? (
                                eventsForSelectedDay.map(event => {
                                    const colorClass = colorClasses[event.color] || colorClasses['primary'];
                                    return (
                                        <motion.div
                                            key={event.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -30 }}
                                            className={`p-3 sm:p-4 rounded-lg border-l-4 ${colorClass.bg} ${colorClass.border}`}
                                        >
                                            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
                                                <div className="min-w-0 flex-1">
                                                    <p className={`font-bold text-base sm:text-lg ${colorClass.text} truncate`}>{event.title}</p>
                                                    <p className="text-light-gray text-sm flex items-center gap-1 sm:gap-2"><Clock size={12} className="sm:hidden" /><Clock size={14} className="hidden sm:block" /> {event.time}</p>
                                                </div>
                                                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                                    {event.status === 'pending' && <>
                                                        <button onClick={() => handleStatusUpdate(event.id, 'done')} className="p-1.5 sm:p-2 hover:bg-green-500/20 rounded-full text-green-400 touch-manipulation"><Check size={14} className="sm:hidden" /><Check size={16} className="hidden sm:block" /></button>
                                                        <button onClick={() => handleStatusUpdate(event.id, 'skipped')} className="p-1.5 sm:p-2 hover:bg-yellow-500/20 rounded-full text-yellow-400 touch-manipulation"><SkipForward size={14} className="sm:hidden" /><SkipForward size={16} className="hidden sm:block" /></button>
                                                    </>}
                                                    {event.status === 'done' && <span className="text-green-400 font-bold text-xs sm:text-sm">Done! +{EVENT_XP}XP</span>}
                                                    {event.status === 'skipped' && <span className="text-yellow-400 text-xs sm:text-sm">Skipped</span>}
                                                    <button onClick={() => { 
                                                        const eventDate = parseISO(event.date);
                                                        if(isValid(eventDate)) {
                                                            setEditingEvent(event); 
                                                            setSelectedDay(eventDate); 
                                                            setModalOpen(true); 
                                                        }
                                                    }} className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full touch-manipulation"><Edit size={14} className="sm:hidden" /><Edit size={16} className="hidden sm:block" /></button>
                                                    <button onClick={() => deleteEvent(event.id)} className="p-1.5 sm:p-2 hover:bg-red-500/20 rounded-full text-red-400 touch-manipulation"><Trash2 size={14} className="sm:hidden" /><Trash2 size={16} className="hidden sm:block" /></button>
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