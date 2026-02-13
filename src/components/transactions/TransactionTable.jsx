import React from 'react';
import { FiClock, FiCheckCircle, FiXCircle, FiInfo, FiRefreshCw } from 'react-icons/fi';

const TransactionTable = ({ transactions, onViewDetails, onRetryCredit }) => {
    const getStatusBadge = (status) => {
        const styles = {
            COMPLETED: 'bg-emerald-100/80 text-emerald-700 border border-emerald-200/50',
            SUCCESS: 'bg-emerald-100/80 text-emerald-700 border border-emerald-200/50',
            PENDING: 'bg-amber-100/80 text-amber-700 border border-amber-200/50',
            FAILED: 'bg-rose-100/80 text-rose-700 border border-rose-200/50',
            default: 'bg-slate-100/80 text-slate-700 border border-slate-200/50'
        };

        const config = {
            COMPLETED: { icon: FiCheckCircle, text: 'SUCCÈS' },
            SUCCESS: { icon: FiCheckCircle, text: 'SUCCÈS' },
            PENDING: { icon: FiClock, text: 'EN ATTENTE' },
            FAILED: { icon: FiXCircle, text: 'ÉCHEC' },
            default: { icon: FiInfo, text: 'INCONNU' }
        };

        const style = styles[status] || styles.default;
        const { icon: Icon, text } = config[status] || config.default;

        return (
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold shadow-sm backdrop-blur-sm ${style}`}>
                <Icon className="w-3.5 h-3.5" /> {text}
            </span>
        );
    };

    return (
        <div className="glass-card rounded-2xl overflow-hidden border border-white/40">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-white/30 border-b border-white/20">
                        <tr>
                            <th className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Date & Référence</th>
                            <th className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Utilisateur</th>
                            <th className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Montant</th>
                            <th className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Réseaux</th>
                            <th className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Statut</th>
                            <th className="px-5 py-3 text-right text-[11px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {transactions.map((txn) => (
                            <tr key={txn.uid} className="hover:bg-white/40 transition-colors group">
                                <td className="px-5 py-2.5 whitespace-nowrap">
                                    <div className="text-[13px] font-bold text-slate-800 leading-none">{txn.reference}</div>
                                    <div className="text-[11px] text-slate-400 font-medium mt-1">{new Date(txn.created_at).toLocaleString()}</div>
                                </td>
                                <td className="px-5 py-2.5 whitespace-nowrap">
                                    <div className="text-[13px] font-semibold text-slate-600">{txn.user_email}</div>
                                </td>
                                <td className="px-5 py-2.5 whitespace-nowrap">
                                    <div className="text-[13px] font-black text-slate-900 leading-none">{txn.amount.toLocaleString()} F</div>
                                    <div className="text-[11px] text-slate-400 font-medium mt-1">Frais: {txn.fee} F</div>
                                </td>
                                <td className="px-5 py-2.5 whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 bg-white/40 px-2 py-1 rounded-lg inline-block border border-white/20 leading-none">
                                        <span className="text-slate-800">{txn.source_network_name}</span>
                                        <span className="text-slate-300 font-normal">→</span>
                                        <span className="text-slate-800">{txn.dest_network_name}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-2.5 whitespace-nowrap">
                                    {getStatusBadge(txn.status)}
                                </td>
                                <td className="px-5 py-2.5 text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-2">
                                        {txn.status === 'FAILED' && (
                                            <button
                                                onClick={() => onRetryCredit(txn)}
                                                className="rounded-lg p-1.5 text-amber-500 hover:bg-amber-50 hover:text-amber-600 transition-all hover:shadow-sm active:scale-95"
                                                title="Re-créditer"
                                            >
                                                <FiRefreshCw size={16} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => onViewDetails(txn)}
                                            className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50/80 hover:text-blue-600 transition-all hover:shadow-sm active:scale-95"
                                            title="Détails"
                                        >
                                            <FiInfo size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionTable;
