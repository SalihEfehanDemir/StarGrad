import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaPlay, FaPause } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../../contexts/AudioContext';
import { useNavigate } from 'react-router-dom';

const ZenMode = () => {
    const [task, setTask] = useState('My primary focus today...');
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const { isPlaying, togglePlayPause } = useAudio();
    const navigate = useNavigate();
    const textareaRef = useRef(null);

    const handleExit = () => navigate(-1); // Go back to the previous page

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                handleExit();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        let interval = null;
        if (isTimerActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsTimerActive(false);
        }
        return () => clearInterval(interval);
    }, [isTimerActive, timeLeft]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [task]);
    
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
            
            <button onClick={handleExit} className="absolute top-8 right-8 text-gray-400 hover:text-white transition-colors z-10">
                <FaTimes size={28} />
            </button>
            
            <div className="relative z-10 text-center flex flex-col items-center">
                <AnimatePresence>
                    <motion.div
                        key={isTimerActive}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="mb-12"
                    >
                        <div className="text-3xl md:text-5xl font-bold mb-4">{isTimerActive ? "Focusing on:" : "Ready to focus?"}</div>
                    </motion.div>
                </AnimatePresence>

                <textarea
                    ref={textareaRef}
                    rows="1"
                    maxLength="150"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    className="w-full max-w-3xl bg-transparent text-center text-4xl md:text-6xl font-semibold outline-none border-b-2 border-transparent focus:border-white transition-all duration-300 pb-2 mb-12 resize-none overflow-hidden"
                    disabled={isTimerActive}
                />

                <div className="flex items-center space-x-8">
                    <button 
                        onClick={() => setIsTimerActive(!isTimerActive)}
                        className="w-24 h-24 rounded-full flex items-center justify-center text-3xl text-white bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        {isTimerActive ? <FaPause /> : <FaPlay />}
                    </button>
                    <AnimatePresence>
                        {isTimerActive && (
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
                 <button 
                    onClick={togglePlayPause}
                    className="mt-12 text-gray-400 hover:text-white flex items-center space-x-2 transition-colors"
                >
                    {isPlaying ? <FaPause size={12}/> : <FaPlay size={12} />}
                    <span>Ambient Sound</span>
                </button>
            </div>
        </motion.div>
    );
};

export default ZenMode;
