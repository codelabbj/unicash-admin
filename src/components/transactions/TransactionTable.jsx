import React from 'react';
import { FiClock, FiCheckCircle, FiXCircle, FiInfo, FiRefreshCw, FiAlertTriangle, FiUser, FiCopy, FiCheck } from 'react-icons/fi';
import { useState } from 'react';

const TransactionTable = ({ transactions, onViewDetails, onRetryCredit }) => {
    const [copiedUid, setCopiedUid] = useState(null);

    const handleCopyUid = async (uid) => {
        try {
            await navigator.clipboard.writeText(uid);
            setCopiedUid(uid);
            setTimeout(() => setCopiedUid(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR').format(amount) + ' F';
    };

    const getStatusBadge = (status) => {
        const styles = {
            COMPLETED: 'bg-emerald-100/80 text-emerald-700 border border-emerald-200/50',
            SUCCESS: 'bg-emerald-100/80 text-emerald-700 border border-emerald-200/50',
            PENDING: 'bg-amber-100/80 text-amber-700 border border-amber-200/50',
            FAILED: 'bg-rose-100/80 text-rose-700 border border-rose-200/50',
            DEBIT_FAILED: 'bg-rose-100/80 text-rose-700 border border-rose-200/50',
            CREDIT_FAILED: 'bg-rose-100/80 text-rose-700 border border-rose-200/50',
            default: 'bg-slate-100/80 text-slate-700 border border-slate-200/50'
        };

        const config = {
            COMPLETED: { icon: FiCheckCircle, text: 'Succès' },
            SUCCESS: { icon: FiCheckCircle, text: 'Succès' },
            PENDING: { icon: FiClock, text: 'En attente' },
            FAILED: { icon: FiXCircle, text: 'Échec' },
            DEBIT_FAILED: { icon: FiXCircle, text: 'Échec Débit' },
            CREDIT_FAILED: { icon: FiXCircle, text: 'Échec Crédit' },
            default: { icon: FiInfo, text: status || 'INCONNU' }
        };

        const style = styles[status] || styles.default;
        const { icon: Icon, text } = config[status] || config.default;

        return (
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black shadow-sm backdrop-blur-sm ${style}`}>
                <Icon className="w-3 h-3" /> {text}
            </span>
        );
    };

    return (
        <div className="glass-card rounded-[2rem] overflow-hidden border border-white/40 bg-white/30 backdrop-blur-md shadow-2xl shadow-slate-200/50">
            <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">UID</th>
                            <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">Référence</th>
                            <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">User</th>
                            <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">Contact</th>
                            <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">Montant</th>
                            <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">Frais</th>
                            <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">Net</th>
                            <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">Frais à charge</th>
                            <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">Profit</th>
                            <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">Source</th>
                            <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">Destination</th>
                            <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">Statut</th>
                            <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">Date</th>
                            <th className="px-5 py-4 text-center text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">Erreur</th>
                            <th className="px-5 py-4 text-right text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white/40">
                        {transactions.map((txn) => (
                            <tr key={txn.uid} className="hover:bg-white/60 transition-all group">
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-mono font-bold text-slate-600 truncate max-w-[100px]" title={txn.uid}>
                                            {txn.uid?.slice(0, 8)}...
                                        </span>
                                        <button
                                            onClick={() => handleCopyUid(txn.uid)}
                                            className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-blue-100 hover:text-blue-600 transition-all active:scale-95"
                                            title="Copier l'UID"
                                        >
                                            {copiedUid === txn.uid ? <FiCheck size={14} className="text-emerald-500" /> : <FiCopy size={14} />}
                                        </button>
                                    </div>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <span className="text-[12px] font-black text-slate-900 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200/50">
                                        {txn.reference}
                                    </span>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                            <FiUser size={14} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[12px] font-bold text-slate-700 truncate max-w-[120px]" title={txn.user_name}>
                                                {txn.user_name || '-'}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <span className="text-[12px] font-bold text-slate-500">
                                        {txn.user_email || txn.user_phone || '-'}
                                    </span>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <span className="text-[13px] font-black text-slate-900">{formatCurrency(txn.amount)}</span>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <span className="text-[12px] font-bold text-rose-500">-{formatCurrency(txn.fees)}</span>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <span className="text-[13px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                        {formatCurrency(txn.net_amount)}
                                    </span>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <span className={`text-[11px] font-black px-2 py-1 rounded-lg ${txn.sender_pays_fees ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {txn.sender_pays_fees ? 'Expéditeur' : 'Destinataire'}
                                    </span>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <span className="text-[13px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                                        {formatCurrency(txn.platform_profit || 0)}
                                    </span>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2.5">
                                        {txn.source_network?.logo && (
                                            <img src={txn.source_network.logo} alt={txn.source_network.name} className="w-6 h-6 rounded-md object-contain shadow-sm border border-white" />
                                        )}
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black text-slate-900 leading-none">{txn.source_network?.name}</span>
                                            <span className="text-[11px] font-bold text-slate-400 mt-0.5">{txn.source_number}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2.5">
                                        {txn.dest_network?.logo && (
                                            <img src={txn.dest_network.logo} alt={txn.dest_network.name} className="w-6 h-6 rounded-md object-contain shadow-sm border border-white" />
                                        )}
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black text-slate-900 leading-none">{txn.dest_network?.name}</span>
                                            <span className="text-[11px] font-bold text-slate-400 mt-0.5">{txn.dest_number}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                    {getStatusBadge(txn.status)}
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-[12px] font-bold text-slate-700">{new Date(txn.created_at).toLocaleDateString()}</span>
                                        <span className="text-[10px] font-bold text-slate-400 leading-none mt-0.5">{new Date(txn.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-center whitespace-nowrap">
                                    {txn.error_message && (
                                        <div
                                            className="inline-flex items-center justify-center p-1.5 bg-rose-50 text-rose-500 rounded-lg transition-all hover:scale-110 hover:bg-rose-100 cursor-help group/err"
                                            data-tooltip={typeof txn.error_message === 'string' ? txn.error_message : JSON.stringify(txn.error_message)}
                                        >
                                            <FiAlertTriangle size={16} className="group-hover/err:rotate-12 transition-transform" />
                                        </div>
                                    )}
                                </td>
                                <td className="px-5 py-4 text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-2">
                                        {txn.status === 'CREDIT_FAILED' && (
                                            <button
                                                onClick={() => onRetryCredit(txn)}
                                                className="w-8 h-8 flex items-center justify-center rounded-xl bg-amber-50 text-amber-500 hover:bg-amber-100 hover:text-amber-600 transition-all active:scale-95"
                                                title="Re-créditer"
                                            >
                                                <FiRefreshCw size={15} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => onViewDetails(txn)}
                                            className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white transition-all active:scale-95"
                                            title="Détails"
                                        >
                                            <FiInfo size={15} />
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
