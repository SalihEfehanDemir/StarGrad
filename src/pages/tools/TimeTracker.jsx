import { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaRedo, FaStopwatch } from 'react-icons/fa';
import { motion } from 'framer-motion';

const TimeTracker = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    if (time > 0) {
        setSessions(prevSessions => [...prevSessions, time]);
    }
    setTime(0);
    setIsRunning(false);
  };

  const formatTime = (seconds) => {
    const getSeconds = `0${seconds % 60}`.slice(-2);
    const minutes = `${Math.floor(seconds / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);
    return `${getHours} : ${getMinutes} : ${getSeconds}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div 
        className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Time Tracker</h1>
        
        <div className="text-6xl font-mono mb-8 p-6 bg-black/30 border border-white/20 rounded-lg text-center text-white tracking-widest">
          {formatTime(time)}
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          {!isRunning ? (
            <button onClick={handleStart} className="flex items-center bg-brand-cyan hover:bg-cyan-400 text-black font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl">
              <FaPlay className="mr-2" /> Start
            </button>
          ) : (
            <button onClick={handlePause} className="flex items-center bg-brand-amber hover:bg-amber-400 text-black font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl">
              <FaPause className="mr-2" /> Pause
            </button>
          )}
          <button onClick={handleReset} className="flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl">
            <FaRedo className="mr-2" /> Reset & Log
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center text-white">
            <FaStopwatch className="mr-3 text-brand-cyan"/>Logged Sessions
          </h2>
          <ul className="space-y-3">
            {sessions.length > 0 ? (
              sessions.map((session, index) => (
                <motion.li 
                  key={index} 
                  className="bg-black/30 border border-white/20 p-4 rounded-lg flex justify-between items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <span className="font-medium text-gray-200">Session {index + 1}</span>
                  <span className="font-mono text-lg text-white">{formatTime(session)}</span>
                </motion.li>
              ))
            ) : (
              <p className="text-center text-gray-400 py-8">No sessions logged yet.</p>
            )}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default TimeTracker; 