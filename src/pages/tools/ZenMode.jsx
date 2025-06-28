import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { FaTimes, FaPlay, FaPause, FaCog } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LofiPlayer from '../../components/zen/LofiPlayer';
import notificationSoundAsset from '/audio/notification.mp3';
import DurationControl from '../../components/DurationControl';

const SettingsModal = ({ isOpen, onClose, settings, updateSettings }) => {
    if (!isOpen) return null;

    const handleDurationChange = (mode, value) => {
        updateSettings({ durations: { ...settings.durations, [mode]: value } });
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 text-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Settings</h2>
                <div className="space-y-6">
                    <p className="font-semibold text-lg text-gray-300 mb-4">Durations (minutes)</p>
                    <DurationControl
                        label="Pomodoro"
                        value={settings.durations.pomodoro}
                        onChange={(value) => handleDurationChange('pomodoro', value)}
                    />
                    <DurationControl
                        label="Short Break"
                        value={settings.durations.shortBreak}
                        onChange={(value) => handleDurationChange('shortBreak', value)}
                    />
                </div>
                <button onClick={onClose} className="mt-6 w-full bg-blue-500 hover:bg-blue-600 rounded p-2 font-bold">Close</button>
            </div>
        </motion.div>
    );
};

const ZenMode = () => {
    const [settings, setSettings] = useState(() => {
        const savedSettings = localStorage.getItem('zenModeSettings');
        return savedSettings ? JSON.parse(savedSettings) : {
            durations: { pomodoro: 25, shortBreak: 5 },
        };
    });

    const [mode, setMode] = useState('pomodoro');
    const [timeLeft, setTimeLeft] = useState(settings.durations.pomodoro * 60);
    const [isActive, setIsActive] = useState(false);
    const [sessionCount, setSessionCount] = useState(0);
    const [task, setTask] = useState('My primary focus today...');
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    
    const navigate = useNavigate();
    const textareaRef = useRef(null);
    const notificationSound = useMemo(() => new Audio('/audio/notification.mp3'), []);

    const handleExit = () => navigate(-1);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [task]);

    const updateSettings = (newSettings) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        localStorage.setItem('zenModeSettings', JSON.stringify(updated));
    };

    const handleSessionComplete = useCallback(() => {
        notificationSound.play();
        let nextMode = 'pomodoro';
        if (mode === 'pomodoro') {
            const newSessionCount = sessionCount + 1;
            setSessionCount(newSessionCount);
            nextMode = 'shortBreak';
        }
        setMode(nextMode);
    }, [mode, sessionCount, notificationSound]);

    useEffect(() => {
        let intervalId = null;
        if (isActive && timeLeft > 0) {
            intervalId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (isActive && timeLeft <= 0) {
            handleSessionComplete();
        }
        return () => clearInterval(intervalId);
    }, [isActive, timeLeft, handleSessionComplete]);
    
    useEffect(() => {
        if (!isActive) {
            setTimeLeft(settings.durations[mode] * 60);
        }
    }, [settings.durations, mode]);
    
    useEffect(() => {
        if (isActive) {
            setTimeLeft(settings.durations[mode] * 60);
        }
    }, [mode, isActive, settings.durations]);

    const toggleTimer = () => {
        setIsActive(prev => !prev);
    }
    
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');

    return (
        <motion.div 
            className="fixed inset-0 bg-dark-bg z-50 flex flex-col items-center justify-center text-white p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-dark-bg animate-breathe"></div>
            
            <button onClick={() => setSettingsOpen(true)} className="absolute top-8 left-8 text-gray-400 hover:text-white transition-colors z-10">
                <FaCog size={24} />
            </button>
            <button onClick={handleExit} className="absolute top-8 right-8 text-gray-400 hover:text-white transition-colors z-10">
                <FaTimes size={28} />
            </button>
            
            <div className="relative z-10 text-center flex flex-col items-center">
                <AnimatePresence>
                    <motion.div
                        key={mode}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="mb-12"
                    >
                        <div className="text-3xl md:text-5xl font-bold mb-4">
                            {mode === 'pomodoro' ? 'Focusing on:' : 'Time for a break!'}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <textarea
                    ref={textareaRef}
                    rows="1"
                    maxLength="150"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    className="w-full max-w-3xl bg-transparent text-center text-4xl md:text-6xl font-semibold outline-none border-b-2 border-transparent focus:border-white transition-all duration-300 pb-2 mb-12 resize-none overflow-hidden"
                    disabled={isActive && mode === 'pomodoro'}
                />

                <div className="flex items-center space-x-8">
                    <button 
                        onClick={toggleTimer}
                        className="w-24 h-24 rounded-full flex items-center justify-center text-3xl text-white bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        {isActive ? <FaPause /> : <FaPlay />}
                    </button>
                    <AnimatePresence>
                        {isActive && (
                            <motion.div
                                className="font-mono text-7xl md:text-8xl"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                {minutes}:{seconds}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                
                <div className="mt-8">
                    <LofiPlayer />
                </div>
            </div>

            <SettingsModal 
                isOpen={isSettingsOpen}
                onClose={() => setSettingsOpen(false)}
                settings={settings}
                updateSettings={updateSettings}
            />
        </motion.div>
    );
};

export default ZenMode;
