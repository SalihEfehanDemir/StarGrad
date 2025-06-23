import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useXP } from '../contexts/XPContext';

const XPDisplay = () => {
    const { lastXPUpdate } = useXP();
    const [xpGains, setXpGains] = useState([]);

    useEffect(() => {
        if (lastXPUpdate) {
            const newGain = { ...lastXPUpdate, id: lastXPUpdate.timestamp };
            setXpGains(currentGains => [...currentGains, newGain]);
            
            // Remove the notification after a few seconds
            setTimeout(() => {
                setXpGains(currentGains => currentGains.filter(gain => gain.id !== newGain.id));
            }, 3000);
        }
    }, [lastXPUpdate]);

    return (
        <div className="fixed bottom-24 right-5 z-50 pointer-events-none">
            <AnimatePresence>
                {xpGains.map((gain, index) => (
                    <motion.div
                        key={gain.id}
                        initial={{ opacity: 0, y: 50, scale: 0.5 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="bg-green-500/80 text-white font-bold text-lg px-4 py-2 rounded-full shadow-lg mb-2"
                        style={{ bottom: `${index * 50}px` }}
                    >
                        +{gain.amount} XP
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default XPDisplay; 