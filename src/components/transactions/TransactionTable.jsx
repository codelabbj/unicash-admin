import React from 'react';
import { FiClock, FiCheckCircle, FiXCircle, FiInfo } from 'react-icons/fi';

const TransactionTable = ({ transactions, onViewDetails }) => {
    const getStatusBadge = (status) => {
        const styles = {
            COMPLETED: 'bg-emerald-100/80 text-emerald-700 border border-emerald-200/50',
            SUCCESS: 'bg-emerald-100/80 text-emerald-700 border border-emerald-200/50',
            PENDING: 'bg-amber-100/80 text-amber-700 border border-amber-200/50',
            FAILED: 'bg-rose-100/80 text-rose-700 border border-rose-200/50',
            default: 'bg-slate-100/80 text-slate-700 border border-slate-200/50'
        };

        const config = {
            COMPLETED: { icon: FiCheckCircle, text: 'Succès' },
            SUCCESS: { icon: FiCheckCircle, text: 'Succès' },
            PENDING: { icon: FiClock, text: 'En attente' },
            FAILED: { icon: FiXCircle, text: 'Échec' },
            default: { icon: FiInfo, text: 'Inconnu' }
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
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">Date & Référence</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">Utilisateur</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">Montant</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">Réseaux</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">Statut</th>
                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/20">
                        {transactions.map((txn) => (
                            <tr key={txn.id} className="hover:bg-white/40 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-slate-800">{txn.reference}</div>
                                    <div className="text-xs text-slate-500 font-medium">{new Date(txn.createdAt).toLocaleString()}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-slate-700">{txn.userName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-slate-900">{txn.amount.toLocaleString()} F</div>
                                    <div className="text-xs text-slate-500">Frais: {txn.fee} F</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-white/40 px-3 py-1.5 rounded-lg inline-block border border-white/20">
                                        <span className="font-bold text-slate-800">{txn.senderNetwork}</span>
                                        <span className="text-slate-400">→</span>
                                        <span className="font-bold text-slate-800">{txn.receiverNetwork}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(txn.status)}
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => onViewDetails(txn)}
                                        className="rounded-xl p-2 text-slate-400 hover:bg-blue-50/80 hover:text-blue-600 transition-all hover:shadow-sm hover:scale-105 active:scale-95"
                                    >
                                        <FiInfo size={18} />
                                    </button>
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
