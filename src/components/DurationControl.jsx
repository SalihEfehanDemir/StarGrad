import React from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';

const DurationControl = ({ label, value, onChange }) => {
    const handleChange = (newValue) => {
        if (newValue >= 1) {
            onChange(newValue);
        }
    };

    return (
        <div className="flex justify-between items-center">
            <label className="text-lg">{label}</label>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => handleChange(value - 1)}
                    className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full transition-colors"
                    aria-label={`Decrease ${label} duration`}
                >
                    <FiMinus />
                </button>
                <span className="text-xl font-semibold w-12 text-center">{value}</span>
                <button
                    onClick={() => handleChange(value + 1)}
                    className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full transition-colors"
                    aria-label={`Increase ${label} duration`}
                >
                    <FiPlus />
                </button>
            </div>
        </div>
    );
};

export default DurationControl; 