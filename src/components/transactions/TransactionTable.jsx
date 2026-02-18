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
        <div className="glass-panel rounded-[2.5rem] overflow-hidden border-none shadow-2xl relative">
            {/* Table Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none"></div>

            <div className="overflow-x-auto relative z-10">
                <table className="min-w-full border-separate border-spacing-0">
                    <thead className="bg-[#2534C1]">
                        <tr>
                            {[
                                'UID', 'Référence', 'User', 'Contact', 'Montant',
                                'Frais', 'Net', 'Frais à charge', 'Profit', 'Source',
                                'Destination', 'Statut', 'Date', 'Erreur', 'Actions'
                            ].map((header, idx) => (
                                <th
                                    key={header}
                                    className={`px-5 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-white/50 border-b border-white/10 ${header === 'Actions' ? 'text-right' : ''} ${header === 'Erreur' ? 'text-center' : ''}`}
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white/40">
                        {transactions.map((txn) => (
                            <tr key={txn.uid} className="hover:bg-primary/[0.03] transition-all group">
                                <td className="px-5 py-5 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-mono font-bold text-slate-600 truncate max-w-[100px]" title={txn.uid}>
                                            {txn.uid?.slice(0, 8)}...
                                        </span>
                                        <button
                                            onClick={() => handleCopyUid(txn.uid)}
                                            className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-primary hover:text-white transition-all active:scale-95 border border-slate-200/50"
                                            title="Copier l'UID"
                                        >
                                            {copiedUid === txn.uid ? <FiCheck size={14} className="text-emerald-500" /> : <FiCopy size={14} />}
                                        </button>
                                    </div>
                                </td>
                                <td className="px-5 py-5 whitespace-nowrap">
                                    <span className="text-[12px] font-black text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/50">
                                        {txn.reference}
                                    </span>
                                </td>
                                <td className="px-5 py-5 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-inner">
                                            <FiUser size={15} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[12px] font-black text-slate-800 truncate max-w-[120px]" title={txn.user_name}>
                                                {txn.user_name || '-'}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-5 whitespace-nowrap">
                                    <span className="text-[12px] font-bold text-slate-500">
                                        {txn.user_email || txn.user_phone || '-'}
                                    </span>
                                </td>
                                <td className="px-5 py-5 whitespace-nowrap">
                                    <span className="text-[13px] font-black text-slate-900">{formatCurrency(txn.amount)}</span>
                                </td>
                                <td className="px-5 py-5 whitespace-nowrap">
                                    <span className="text-[12px] font-black text-rose-500 bg-rose-50 px-2 py-1 rounded-lg">-{formatCurrency(txn.fees)}</span>
                                </td>
                                <td className="px-5 py-5 whitespace-nowrap">
                                    <span className="text-[14px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 shadow-sm shadow-emerald-500/5">
                                        {formatCurrency(txn.net_amount)}
                                    </span>
                                </td>
                                <td className="px-5 py-5 whitespace-nowrap">
                                    <span className={`text-[11px] font-black px-3 py-1.5 rounded-xl border shadow-sm ${txn.sender_pays_fees ? 'bg-indigo-50 text-primary border-indigo-100 shadow-indigo-500/5' : 'bg-slate-50 text-slate-600 border-slate-100 shadow-slate-500/5'}`}>
                                        {txn.sender_pays_fees ? 'EXPÉDITEUR' : 'DESTINATAIRE'}
                                    </span>
                                </td>
                                <td className="px-5 py-5 whitespace-nowrap">
                                    <span className="text-[13px] font-black text-primary bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
                                        {formatCurrency(txn.platform_profit || 0)}
                                    </span>
                                </td>
                                <td className="px-5 py-5 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        {txn.source_network?.logo && (
                                            <div className="w-9 h-9 flex-shrink-0 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center p-1 overflow-hidden">
                                                <img src={txn.source_network.logo} alt={txn.source_network.name} className="w-full h-full object-contain" />
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black text-slate-900 leading-none">{txn.source_network?.name}</span>
                                            <span className="text-[11px] font-bold text-slate-400 mt-1">{txn.source_number}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-5 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        {txn.dest_network?.logo && (
                                            <div className="w-9 h-9 flex-shrink-0 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center p-1 overflow-hidden">
                                                <img src={txn.dest_network.logo} alt={txn.dest_network.name} className="w-full h-full object-contain" />
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black text-slate-900 leading-none">{txn.dest_network?.name}</span>
                                            <span className="text-[11px] font-bold text-slate-400 mt-1">{txn.dest_number}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-5 whitespace-nowrap">
                                    {getStatusBadge(txn.status)}
                                </td>
                                <td className="px-5 py-5 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-[12px] font-black text-slate-700">{new Date(txn.created_at).toLocaleDateString()}</span>
                                        <span className="text-[10px] font-bold text-slate-400 leading-none mt-1 uppercase tracking-tight">{new Date(txn.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-5 text-center whitespace-nowrap">
                                    {txn.error_message && (
                                        <div
                                            className="inline-flex items-center justify-center p-2 bg-rose-50 text-rose-500 rounded-xl transition-all hover:scale-110 hover:bg-rose-100 cursor-help group/err shadow-sm border border-rose-100"
                                            data-tooltip={typeof txn.error_message === 'string' ? txn.error_message : JSON.stringify(txn.error_message)}
                                        >
                                            <FiAlertTriangle size={16} className="group-hover/err:rotate-12 transition-transform" />
                                        </div>
                                    )}
                                </td>
                                <td className="px-5 py-5 text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-2.5">
                                        {txn.status === 'CREDIT_FAILED' && (
                                            <button
                                                onClick={() => onRetryCredit(txn)}
                                                className="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-50 text-amber-500 hover:bg-amber-500 hover:text-white transition-all active:scale-90 shadow-sm border border-amber-100"
                                                title="Re-créditer"
                                            >
                                                <FiRefreshCw size={16} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => onViewDetails(txn)}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-900 hover:text-white transition-all active:scale-90 shadow-sm border border-slate-200"
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
