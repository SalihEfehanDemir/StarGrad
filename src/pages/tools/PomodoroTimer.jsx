import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaPlay, FaPause, FaRedo, FaCog, FaForward, FaVolumeUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import CustomSlider from '../../components/CustomSlider';
import ProgressRing from '../../components/focus/ProgressRing';
import { useXP } from '../../contexts/XPContext';

const TimerDisplay = ({ timeLeft }) => {
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };
    return <div className="text-8xl font-bold font-mono">{formatTime(timeLeft)}</div>;
};

const SettingsModal = ({ isOpen, onClose, settings, updateSettings }) => {
    if (!isOpen) return null;

    const handleDurationChange = (mode, value) => {
        updateSettings({ durations: { ...settings.durations, [mode]: value } });
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 text-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Settings</h2>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg mb-2">Durations (minutes)</h3>
                        {Object.keys(settings.durations).map(mode => (
                            <div key={mode} className="flex items-center justify-between">
                                <span className="capitalize">{mode}</span>
                                <input
                                    type="number"
                                    value={settings.durations[mode]}
                                    onChange={(e) => handleDurationChange(mode, parseInt(e.target.value, 10))}
                                    className="w-20 p-1 rounded bg-gray-700 text-center"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <button onClick={onClose} className="mt-6 w-full bg-blue-500 hover:bg-blue-600 rounded p-2 font-bold">Close</button>
            </div>
        </motion.div>
    );
};

const PomodoroTimer = () => {
    const [settings, setSettings] = useState(() => {
        const savedSettings = localStorage.getItem('pomodoroSettings');
        return savedSettings ? JSON.parse(savedSettings) : {
            durations: { pomodoro: 25, shortBreak: 5, longBreak: 15 },
            sessionsPerLongBreak: 4,
        };
    });

    const updateSettings = (newSettings) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        localStorage.setItem('pomodoroSettings', JSON.stringify(updated));
    };

    const [mode, setMode] = useState('pomodoro');
    const [timeLeft, setTimeLeft] = useState(settings.durations.pomodoro * 60);
    const [isActive, setIsActive] = useState(false);
    const [pomodorosToday, setPomodorosToday] = useState(0);
    const [sessionCount, setSessionCount] = useState(() => parseInt(localStorage.getItem('sessionCount') || '0', 10));
    
    const [task, setTask] = useState('');
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const [isSoundMenuOpen, setSoundMenuOpen] = useState(false);
    const [alertVolume, setAlertVolume] = useState(() => parseInt(localStorage.getItem('alertVolume') || '50', 10));

    const notificationSound = useMemo(() => new Audio('/audio/notification.mp3'), []);

    const { addXP, xpHistory } = useXP();

    const POMODORO_XP = 5;
    const BONUS_XP = 10;
    const SESSIONS_FOR_BONUS = 4;
    const DAILY_XP_CAP = 50;

    useEffect(() => {
        localStorage.setItem('sessionCount', sessionCount.toString());
    }, [sessionCount]);

    useEffect(() => {
        notificationSound.volume = alertVolume / 100;
        localStorage.setItem('alertVolume', alertVolume.toString());
    }, [alertVolume, notificationSound]);

    useEffect(() => {
        if (!isActive) {
            setTimeLeft(settings.durations[mode] * 60);
        }
    }, [settings.durations, mode, isActive]);

    useEffect(() => {
        let intervalId = null;
        if (isActive && timeLeft > 0) {
            intervalId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (isActive && timeLeft <= 0) {
            handleSessionComplete();
        }
        return () => clearInterval(intervalId);
    }, [isActive, timeLeft]);

    const getTodayPomodoroXP = useCallback(() => {
        const today = new Date().toISOString().split('T')[0];
        const todaysHistory = xpHistory[today] || {};
        return todaysHistory.pomodoro || 0;
    }, [xpHistory]);

    const addPomodoroXP = useCallback((amount) => {
        addXP(amount, 'pomodoro');
    }, [addXP]);

    const handleSessionComplete = useCallback(() => {
        notificationSound.play().catch(e => console.error("Error playing sound:", e));

        if (mode === 'pomodoro') {
            const pomodoroXPEarnedToday = getTodayPomodoroXP();
            if (pomodoroXPEarnedToday < DAILY_XP_CAP) {
                const newSessionCount = sessionCount + 1;
                setSessionCount(newSessionCount);
                
                let xpGained = POMODORO_XP;
                if (newSessionCount > 0 && newSessionCount % SESSIONS_FOR_BONUS === 0) {
                    xpGained += BONUS_XP;
                }
                const xpToAdd = Math.min(xpGained, DAILY_XP_CAP - pomodoroXPEarnedToday);
                if (xpToAdd > 0) addPomodoroXP(xpToAdd);
            }

            const newPomodoros = pomodorosToday + 1;
            setPomodorosToday(newPomodoros);
            const nextMode = newPomodoros % settings.sessionsPerLongBreak === 0 ? 'longBreak' : 'shortBreak';
            setMode(nextMode);
        } else {
            setMode('pomodoro');
        }
        setIsActive(false);
    }, [mode, pomodorosToday, settings.sessionsPerLongBreak, getTodayPomodoroXP, addPomodoroXP, sessionCount, DAILY_XP_CAP, notificationSound]);

    const toggleTimer = () => setIsActive(prev => !prev);

    const switchMode = (newMode) => {
        if (isActive && !confirm("The timer is running. Are you sure you want to switch? This won't count as a completed session.")) return;
        setMode(newMode);
        setIsActive(false);
    };

    const handleSkip = () => {
        if (!confirm("Are you sure you want to skip to the end of this session?")) return;
        setTimeLeft(0);
    };

    const toggleSoundMenu = (e) => {
        e.stopPropagation();
        setSoundMenuOpen(prev => !prev);
    }

    const progress = useMemo(() => {
        const totalDuration = settings.durations[mode] * 60;
        return ((totalDuration - timeLeft) / totalDuration) * 100;
    }, [timeLeft, settings.durations, mode]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4" onClick={() => setSoundMenuOpen(false)}>
            <div className="w-full max-w-md bg-glass backdrop-blur-xl border border-border-color rounded-2xl p-8 shadow-2xl">
                <div className="flex justify-center mx-auto mb-8">
                    <ProgressRing progress={progress} size={320}>
                        <TimerDisplay timeLeft={timeLeft} />
                        <div className="mt-2 px-4 py-1 bg-primary/20 text-primary rounded-full text-lg font-semibold shadow-lg capitalize">
                            {mode === 'pomodoro' ? 'Focus' : mode.replace('Break', ' Break')}
                        </div>
                    </ProgressRing>
                </div>

                <input
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="What are you working on?"
                    className="w-full max-w-sm mx-auto bg-black/30 border-2 border-transparent focus:border-primary/50 text-center text-xl p-3 rounded-lg outline-none transition mb-6"
                />

                <div className="flex items-center justify-center space-x-4 mb-8">
                    <button onClick={() => switchMode('pomodoro')} className={`px-4 py-2 rounded-lg transition-colors ${mode === 'pomodoro' ? 'bg-primary text-dark-bg' : 'bg-white/10'}`}>Focus</button>
                    <button onClick={() => switchMode('shortBreak')} className={`px-4 py-2 rounded-lg transition-colors ${mode === 'shortBreak' ? 'bg-primary text-dark-bg' : 'bg-white/10'}`}>Short Break</button>
                    <button onClick={() => switchMode('longBreak')} className={`px-4 py-2 rounded-lg transition-colors ${mode === 'longBreak' ? 'bg-primary text-dark-bg' : 'bg-white/10'}`}>Long Break</button>
                </div>
                
                <div className="text-center text-xl font-semibold mb-8">
                    Pomodoros Today: <span className="text-2xl text-primary font-bold">{pomodorosToday}</span>
                </div>

                <div className="flex items-center justify-center space-x-6">
                    <button onClick={() => setSettingsOpen(true)} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><FaCog size={20} /></button>
                    <button onClick={toggleTimer} className="w-20 h-20 bg-primary text-dark-bg rounded-full flex items-center justify-center text-3xl font-bold shadow-lg hover:scale-105 transition-transform">
                        {isActive ? <FaPause /> : <FaPlay />}
                    </button>
                    <button onClick={handleSkip} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><FaForward size={20} /></button>
                </div>
            </div>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setSettingsOpen(false)}
                settings={settings}
                updateSettings={updateSettings}
            />

            <div className="absolute top-4 right-4 flex items-center gap-4">
                <div className="relative">
                    <button onClick={toggleSoundMenu} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                        <FaVolumeUp size={20} />
                    </button>
                    <AnimatePresence>
                        {isSoundMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full right-0 mt-2 w-72 bg-gray-800 rounded-lg shadow-xl p-4 z-20"
                            >
                                <div className="mt-4 pt-4 border-t border-gray-700">
                                    <p className="text-sm font-bold mb-2">Alert Volume</p>
                                    <CustomSlider value={alertVolume} onChange={setAlertVolume} min={0} max={100} step={1} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default PomodoroTimer;
