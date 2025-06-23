import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useXP } from '../contexts/XPContext';
import XPHeatmap from '../components/XPHeatmap';
import Achievements from '../components/Achievements';
import { Award, BarChart, Pencil, Check, X } from 'lucide-react';

const AccountPage = () => {
    const { user } = useAuth();
    const { totalXP, level, levelBadge, username, updateUsername } = useXP();
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState(username || '');

    const handleSaveUsername = async () => {
        if (newUsername.trim() && newUsername !== username) {
            const success = await updateUsername(newUsername.trim());
            if (success) {
                setIsEditingUsername(false);
            } else {
                // Handle error display if needed
                alert("Failed to update username.");
            }
        } else {
            setIsEditingUsername(false);
        }
    };

    return (
        <div className="min-h-screen p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-bold">Your Dashboard</h1>
                        <div className="flex items-center gap-2 mt-2">
                            {!isEditingUsername ? (
                                <>
                                    <p className="text-light-gray">Welcome back, {username || 'Guest'}</p>
                                    <button 
                                        onClick={() => {
                                            setNewUsername(username || '');
                                            setIsEditingUsername(true);
                                        }} 
                                        className="p-1 rounded-full hover:bg-primary/20 text-primary transition-all duration-300"
                                        aria-label="Edit username"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                </>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="text"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        className="bg-dark-bg border border-border-color rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveUsername()}
                                        autoFocus
                                    />
                                    <button onClick={handleSaveUsername} className="p-1.5 rounded-full bg-primary/20 text-primary hover:bg-primary/30" aria-label="Save username">
                                        <Check size={20} />
                                    </button>
                                    <button onClick={() => setIsEditingUsername(false)} className="p-1.5 rounded-full bg-secondary/20 text-secondary hover:bg-secondary/30" aria-label="Cancel editing username">
                                        <X size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-glass border border-border-color p-6 rounded-2xl flex items-center gap-4 shadow-lg">
                        <span className="text-5xl">{levelBadge}</span>
                        <div>
                            <p className="text-light-gray text-sm">Level</p>
                            <p className="text-2xl font-bold">{level}</p>
                        </div>
                    </div>
                    <div className="bg-glass border border-border-color p-6 rounded-2xl flex items-center gap-4 shadow-lg">
                        <BarChart className="text-5xl text-primary" />
                        <div>
                            <p className="text-light-gray text-sm">Total XP</p>
                            <p className="text-2xl font-bold">{totalXP}</p>
                        </div>
                    </div>
                     <div className="bg-glass border border-border-color p-6 rounded-2xl flex items-center gap-4 shadow-lg">
                        <Award className="text-5xl text-primary" />
                        <div>
                            <p className="text-light-gray text-sm">Achievements Unlocked</p>
                            <p className="text-2xl font-bold">Coming Soon</p> {/* Placeholder */}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="space-y-8">
                    <XPHeatmap />
                    <Achievements />
                </div>
            </div>
        </div>
    );
};

export default AccountPage; 