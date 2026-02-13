import React from 'react';
import { FiSettings } from 'react-icons/fi';

const AggregatorCard = ({ aggregator, onEdit, onToggleStatus }) => {
    const {
        name,
        code,
        is_active,
        logo_url,
        supported_countries = []
    } = aggregator;

    const statusLabel = is_active ? 'ACTIF' : 'INACTIF';
    const statusColor = is_active ? 'bg-[#39D196]/10 text-[#39D196]' : 'bg-gray-100 text-gray-600';

    return (
        <div className="glass-card rounded-2xl p-4 flex flex-col items-center text-center relative overflow-hidden group">
            {/* Status Badge */}
            <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold ${statusColor} flex items-center gap-1`}>
                <span className={`w-1 h-1 rounded-full ${is_active ? 'bg-[#39D196]' : 'bg-gray-400'}`} />
                {statusLabel}
            </div>

            {/* Logo */}
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center p-2 mb-3 mt-1">
                {logo_url ? (
                    <img src={logo_url} alt={name} className="w-full h-full object-contain" />
                ) : (
                    <div className="text-xl font-bold text-primary opacity-20">{name.charAt(0)}</div>
                )}
            </div>

            {/* Name */}
            <h3 className="text-lg font-bold text-gray-800 mb-4">{name}</h3>

            {/* Info Grid */}
            <div className="w-full space-y-3 text-left mb-6">
                <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Code</label>
                    <code className="text-xs font-mono font-bold text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100">
                        {code}
                    </code>
                </div>
                <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Pays Supportés</label>
                    <div className="flex flex-wrap gap-1">
                        {supported_countries.length > 0 ? (
                            supported_countries.slice(0, 3).map((country, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 rounded-lg">
                                    {country.name || country}
                                </span>
                            ))
                        ) : (
                            <span className="text-[10px] text-slate-300 italic">Aucun pays</span>
                        )}
                        {supported_countries.length > 3 && (
                            <span className="text-[10px] font-bold text-primary">+{supported_countries.length - 3}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Configure Button */}
            <button
                onClick={() => onEdit(aggregator)}
                className="w-full py-2.5 rounded-xl bg-slate-50 text-slate-600 font-bold text-[12px] hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center gap-2 active:scale-95"
            >
                <FiSettings size={14} /> Configurer
            </button>
        </div>
    );
};

export default AggregatorCard;
