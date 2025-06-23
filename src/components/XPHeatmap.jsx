import React from 'react';
import HeatMap from '@uiw/react-heat-map';
import Tooltip from '@uiw/react-tooltip';
import { useXP } from '../contexts/XPContext';

const XPHeatmap = () => {
    const { xpHistory } = useXP();

    const formatedValues = Object.entries(xpHistory).map(([date, data]) => {
        return {
            date: date.replace(/-/g, '/'), // Match required format
            count: data.total || 0,
        };
    });
    
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);

    return (
        <div className="bg-glass border border-border-color p-4 md:p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">Your Activity</h3>
            <div className="overflow-x-auto">
                <HeatMap
                    value={formatedValues}
                    width={720}
                    startDate={startDate}
                    style={{ color: '#8B949E' }}
                    rectSize={12}
                    space={3}
                    legendCellSize={0}
                    panelColors={{
                        0: 'rgba(255, 255, 255, 0.05)',
                        10: 'rgba(0, 246, 255, 0.2)',
                        20: 'rgba(0, 246, 255, 0.4)',
                        30: 'rgba(0, 246, 255, 0.7)',
                        40: 'rgba(0, 246, 255, 1)',
                    }}
                    rectRender={(props, data) => {
                        const { date, count } = data;
                        if (!date) return <rect {...props} />;
                        return (
                            <Tooltip placement="top" content={`${count || 0} XP on ${date}`}>
                                <rect {...props} />
                            </Tooltip>
                        );
                    }}
                />
            </div>
        </div>
    );
};

export default XPHeatmap; 