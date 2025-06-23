import React, { useState, useEffect } from 'react';
import { TrendingUp, Trash2 } from 'lucide-react';

const BMICalculator = () => {
    const [gender, setGender] = useState('male');
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [bmi, setBmi] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const storedHistory = localStorage.getItem('bmiCalculator-history');
        if (storedHistory) {
            setHistory(JSON.parse(storedHistory));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('bmiCalculator-history', JSON.stringify(history));
    }, [history]);

    const calculateBmi = (e) => {
        e.preventDefault();
        if (height > 0 && weight > 0) {
            const heightInMeters = height / 100;
            const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
            setBmi(bmiValue);

            const newHistoryEntry = {
                bmi: bmiValue,
                date: new Date().toLocaleDateString(),
                weight: weight,
            };
            setHistory([newHistoryEntry, ...history].slice(0, 10)); // Keep last 10 records
        }
    };
    
    const getBmiStatus = (bmi) => {
        if (bmi < 18.5) return { text: 'Underweight', color: 'text-blue-400' };
        if (bmi >= 18.5 && bmi < 24.9) return { text: 'Healthy Weight', color: 'text-green-400' };
        if (bmi >= 25 && bmi < 29.9) return { text: 'Overweight', color: 'text-yellow-400' };
        return { text: 'Obesity', color: 'text-red-400' };
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('bmiCalculator-history');
    }

    const status = bmi ? getBmiStatus(bmi) : null;

    return (
        <div className="p-4 sm:p-6 md:p-8 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center">BMI Calculator</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Calculator Form */}
                    <div className="bg-glass border border-border-color rounded-2xl shadow-lg p-8">
                        <form onSubmit={calculateBmi} className="space-y-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-light-gray">Gender</label>
                                <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full p-3 bg-white/5 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="age" className="block mb-2 text-sm font-medium text-light-gray">Age</label>
                                <input type="number" id="age" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 25" className="w-full p-3 bg-white/5 border border-border-color rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                                <label htmlFor="height" className="block mb-2 text-sm font-medium text-light-gray">Height (cm)</label>
                                <input type="number" id="height" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 175" required className="w-full p-3 bg-white/5 border border-border-color rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <div>
                                <label htmlFor="weight" className="block mb-2 text-sm font-medium text-light-gray">Weight (kg)</label>
                                <input type="number" id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 70" required className="w-full p-3 bg-white/5 border border-border-color rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary" />
                            </div>
                            <button type="submit" className="w-full py-3 text-lg font-semibold text-dark-bg bg-primary hover:bg-primary/80 rounded-lg transition-colors">Calculate BMI</button>
                        </form>
                    </div>

                    {/* Result and History */}
                    <div className="space-y-8">
                        {bmi && (
                            <div className="bg-glass border border-border-color rounded-2xl p-8 text-center shadow-lg">
                                <h2 className="text-xl mb-2 text-light-gray">Your BMI is</h2>
                                <p className={`text-6xl font-bold ${status.color}`}>{bmi}</p>
                                <p className={`text-xl font-semibold mt-2 ${status.color}`}>{status.text}</p>
                            </div>
                        )}
                        <div className="bg-glass border border-border-color rounded-2xl p-8 shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold flex items-center"><TrendingUp className="mr-2 text-light-gray" /> History</h3>
                                {history.length > 0 && (
                                    <button onClick={clearHistory} className="text-sm text-red-400 hover:text-red-600 transition-colors flex items-center">
                                        <Trash2 size={16} className="mr-1" /> Clear
                                    </button>
                                )}
                            </div>
                            <ul className="space-y-3">
                                {history.length > 0 ? history.map((entry, index) => (
                                    <li key={index} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                                        <span className="font-medium">BMI: {entry.bmi}</span>
                                        <span className="text-light-gray">Weight: {entry.weight}kg</span>
                                        <span className="text-sm text-gray-500">{entry.date}</span>
                                    </li>
                                )) : <p className="text-center text-gray-500">No history yet.</p>}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BMICalculator;
