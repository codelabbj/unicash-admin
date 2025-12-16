import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        red: 'bg-red-50 text-red-600',
    };

    return (
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                        </p>
                    )}
                </div>
                {Icon && (
                    <div className={`p-3 rounded-full ${colors[color]}`}>
                        <Icon className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
