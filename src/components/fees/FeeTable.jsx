import React from 'react';
import { FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const FeeTable = ({ configs, onEdit, onDelete, onToggleStatus }) => {
    return (
        <div className="glass-panel overflow-hidden border-none shadow-xl shadow-slate-200/50">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Réseau</th>
                            <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Type</th>
                            <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Taux</th>
                            <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Frais Fixe</th>
                            <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Min / Max</th>
                            <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Statut</th>
                            <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {configs.map((config) => {
                            const getProp = (k1, k2) => config[k1] !== undefined ? config[k1] : config[k2];
                            const id = getProp('id', 'uid');
                            const netName = config.networkName || config.network_name || (typeof config.network === 'object' ? config.network?.name : config.network) || 'Tous Réseaux';
                            const minAmt = getProp('minAmount', 'min_amount') || 0;
                            const maxAmt = getProp('maxAmount', 'max_amount');
                            const fixed = getProp('fixedFee', 'fixed_fee') || 0;
                            const pct = getProp('percentageFee', 'percentage_rate') || 0;
                            const active = getProp('isActive', 'is_active');

                            const typeLabel = pct > 0 ? 'POURCENTAGE' : 'FIXE';
                            const networkInitials = netName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

                            return (
                                <tr key={id} className="hover:bg-slate-50/80 transition-all duration-200 group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-primary font-bold text-[10px] shadow-sm group-hover:scale-105 transition-transform">
                                                {networkInitials}
                                            </div>
                                            <div>
                                                <div className="text-[13px] font-bold text-slate-800">{netName}</div>
                                                <div className="text-[10px] font-medium text-slate-400">Paiement Mobile</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-black tracking-wider ${pct > 0 ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                                            {typeLabel}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-[13px] font-black text-slate-700">
                                        {pct > 0 ? `${pct}%` : '-'}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-[13px] font-black text-slate-700">
                                        {fixed > 0 ? `${fixed} F` : '-'}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="text-[13px] font-black text-slate-700">
                                            {minAmt.toLocaleString()} - {maxAmt ? maxAmt.toLocaleString() : '∞'}
                                        </div>
                                        <div className="text-[9px] font-bold text-primary tracking-widest mt-0.5 opacity-60 uppercase">FCFA</div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-success' : 'bg-slate-300'}`} />
                                            <span className={`text-[12px] font-bold ${active ? 'text-success' : 'text-slate-400'}`}>
                                                {active ? 'Actif' : 'Inactif'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <div className="flex justify-end gap-2 translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            <button
                                                onClick={() => onEdit(config)}
                                                className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary/10 hover:text-primary transition-all active:scale-90"
                                                title="Modifier"
                                            >
                                                <FiEdit2 size={14} strokeWidth={2.5} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(id)}
                                                className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-90"
                                                title="Supprimer"
                                            >
                                                <FiTrash2 size={14} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination Mockup */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Affichage de <span className="font-bold text-slate-600">1 à {configs.length}</span> sur <span className="font-bold text-slate-600">{configs.length}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <button className="p-1.5 rounded-lg text-slate-400 hover:bg-white hover:text-primary transition-all disabled:opacity-30" disabled>
                        <FiChevronLeft size={18} />
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-primary text-white font-bold text-xs shadow-md shadow-primary/20">1</button>
                    <button className="w-8 h-8 rounded-lg bg-white text-slate-600 font-bold text-xs hover:bg-primary/5 hover:text-primary transition-all">2</button>
                    <button className="w-8 h-8 rounded-lg bg-white text-slate-600 font-bold text-xs hover:bg-primary/5 hover:text-primary transition-all">3</button>
                    <button className="p-1.5 rounded-lg text-slate-400 hover:bg-white hover:text-primary transition-all">
                        <FiChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeeTable;
