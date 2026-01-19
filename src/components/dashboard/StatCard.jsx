import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => {
    const gradients = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-emerald-500 to-emerald-600',
        yellow: 'from-amber-500 to-amber-600',
        red: 'from-rose-500 to-rose-600',
    };

    const iconBgs = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-emerald-50 text-emerald-600',
        yellow: 'bg-amber-50 text-amber-600',
        red: 'bg-rose-50 text-rose-600',
    };

    return (
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 border-none ring-1 ring-black/5 bg-white">
            <div className="flex items-start justify-between relative z-10">
                <div className="flex-1">
                    <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider mb-2">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
                    </div>

                    {trend && (
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold mt-3 ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            <span className="text-sm">{trend > 0 ? '↗' : '↘'}</span>
                            <span>{Math.abs(trend)}% vs mois dernier</span>
                        </div>
                    )}
                </div>

                {Icon && (
                    <div className={`p-4 rounded-xl shadow-sm ${iconBgs[color]} bg-opacity-50 ring-1 ring-inset ring-black/5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                        <Icon className="w-6 h-6" />
                    </div>
                )}
            </div>

            {/* Subtle bottom decoration line */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradients[color]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        </div>
    );
};

export default StatCard;
