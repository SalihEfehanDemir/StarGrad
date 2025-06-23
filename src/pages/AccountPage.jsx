import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useXP } from '../contexts/XPContext';
import XPHeatmap from '../components/XPHeatmap';
import Achievements from '../components/Achievements';
import { Award, BarChart, LogOut } from 'lucide-react';

const AccountPage = () => {
    const { user, signOut } = useAuth();
    const { totalXP, level, levelBadge } = useXP();

    return (
        <div className="min-h-screen p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-bold">Your Dashboard</h1>
                        <p className="text-light-gray mt-2">Welcome back, {user ? user.email : 'Guest'}</p>
                    </div>
                     <button
                        onClick={signOut}
                        className="mt-4 sm:mt-0 flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
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