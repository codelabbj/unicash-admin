import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => {
    const gradients = {
        blue: 'from-primary via-indigo-600 to-primary-light',
        green: 'from-emerald-600 to-teal-500',
        yellow: 'from-amber-500 to-orange-400',
        red: 'from-rose-600 to-pink-500',
    };

    const iconColors = {
        blue: 'text-primary',
        green: 'text-emerald-600',
        yellow: 'text-amber-600',
        red: 'text-rose-600',
    };

    const glows = {
        blue: 'shadow-primary/20',
        green: 'shadow-emerald-500/20',
        yellow: 'shadow-amber-500/20',
        red: 'shadow-rose-500/20',
    };

    return (
        <div className={`glass-card rounded-[2.5rem] p-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 ${glows[color]} bg-white/90 border-transparent hover:border-white/80`}>
            {/* Corner Decorative Blur */}
            <div className={`absolute -top-16 -right-16 w-32 h-32 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 bg-gradient-to-br ${gradients[color]}`}></div>

            <div className="flex items-start justify-between relative z-10">
                <div className="flex-1">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-black text-slate-900 tracking-tight group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-primary group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                            {value}
                        </p>
                    </div>

                    {trend !== undefined && (
                        <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-black mt-5 border ${trend > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                            <span className="text-sm leading-none">{trend > 0 ? '↑' : '↓'}</span>
                            <span>{Math.abs(trend)}%</span>
                            <span className="opacity-50 ml-0.5">VS MOIS DERNIER</span>
                        </div>
                    )}
                </div>

                {Icon && (
                    <div className={`p-5 rounded-[1.5rem] bg-white shadow-xl shadow-black/5 ${iconColors[color]} transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-2xl group-hover:shadow-black/10 ring-1 ring-black/5`}>
                        <Icon className="w-7 h-7" />
                    </div>
                )}
            </div>

            {/* Premium Animated Decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-100/50 overflow-hidden">
                <div className={`h-full w-[40%] bg-gradient-to-r ${gradients[color]} rounded-full transform -translate-x-full group-hover:translate-x-[250%] transition-transform duration-[1500ms] ease-in-out`} />
            </div>
        </div>
    );
};

export default StatCard;
