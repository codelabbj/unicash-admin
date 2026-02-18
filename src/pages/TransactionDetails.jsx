import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FiArrowLeft, FiCopy, FiCheckCircle, FiClock, FiXCircle,
    FiAlertTriangle, FiAlertCircle, FiSmartphone, FiCalendar, FiHash,
    FiActivity, FiFileText, FiRefreshCw, FiGrid, FiCheckSquare, FiXSquare
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { transactionsAPI } from '../api/transactions.api';

const TransactionDetails = () => {
    const { txnId } = useParams();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRetrying, setIsRetrying] = useState(false);
    const [isMarkingCompleted, setIsMarkingCompleted] = useState(false);
    const [isMarkingFailed, setIsMarkingFailed] = useState(false);

    const fetchDetails = async () => {
        setIsLoading(true);
        try {
            const data = await transactionsAPI.getTransactionDetails(txnId);
            setTransaction(data);
        } catch (err) {
            console.error("Error fetching transaction details:", err);
            setError("Impossible de charger les détails de la transaction.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [txnId]);

    const handleCopy = (text, label) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copié dans le presse-papier`);
    };

    const handleRetry = async () => {
        if (!transaction) return;
        setIsRetrying(true);
        try {
            await transactionsAPI.retryCredit(transaction.uid);
            toast.success("Demande de re-crédit envoyée !");
            fetchDetails();
        } catch (error) {
            console.error("Error retrying credit:", error);
            toast.error("Échec de l'envoi de la demande de re-crédit.");
        } finally {
            setIsRetrying(false);
        }
    };

    const handleMarkCompleted = async () => {
        if (!transaction) return;
        setIsMarkingCompleted(true);
        try {
            await transactionsAPI.markCompleted(transaction.uid);
            toast.success("Transaction marquée comme COMPLÉTÉE !");
            fetchDetails();
        } catch (error) {
            console.error("Error marking transaction as completed:", error);
            toast.error("Échec du marquage de la transaction.");
        } finally {
            setIsMarkingCompleted(false);
        }
    };

    const handleMarkFailed = async () => {
        if (!transaction) return;
        setIsMarkingFailed(true);
        try {
            await transactionsAPI.markFailed(transaction.uid);
            toast.success("Transaction marquée comme ÉCHOUÉE !");
            fetchDetails();
        } catch (error) {
            console.error("Error marking transaction as failed:", error);
            toast.error("Échec du marquage de la transaction.");
        } finally {
            setIsMarkingFailed(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'COMPLETED':
                return {
                    bg: 'bg-emerald-50',
                    text: 'text-emerald-700',
                    border: 'border-emerald-100',
                    icon: <FiCheckCircle className="w-5 h-5" />,
                    label: 'Succès'
                };
            case 'PENDING':
                return {
                    bg: 'bg-amber-50',
                    text: 'text-amber-700',
                    border: 'border-amber-100',
                    icon: <FiClock className="w-5 h-5" />,
                    label: 'En attente'
                };
            case 'FAILED':
                return {
                    bg: 'bg-rose-50',
                    text: 'text-rose-700',
                    border: 'border-rose-100',
                    icon: <FiXCircle className="w-5 h-5" />,
                    label: 'Échec'
                };
            case 'DEBIT_FAILED':
                return {
                    bg: 'bg-rose-50',
                    text: 'text-rose-700',
                    border: 'border-rose-100',
                    icon: <FiXCircle className="w-5 h-5" />,
                    label: 'Échec Débit'
                };
            case 'CREDIT_FAILED':
                return {
                    bg: 'bg-rose-50',
                    text: 'text-rose-700',
                    border: 'border-rose-100',
                    icon: <FiXCircle className="w-5 h-5" />,
                    label: 'Échec Crédit'
                };
            default:
                return {
                    bg: 'bg-slate-50',
                    text: 'text-slate-700',
                    border: 'border-slate-100',
                    icon: <FiActivity className="w-5 h-5" />,
                    label: status || 'Inconnu'
                };
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <LoadingSpinner />
                <p className="mt-4 text-slate-500 font-medium">Chargement des détails...</p>
            </div>
        );
    }

    if (error || !transaction) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-6 text-center">
                <div className="bg-rose-50 p-8 rounded-3xl border border-rose-100 inline-block">
                    <FiAlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                    <h2 className="text-xl font-black text-slate-900 mb-2">{error || "Transaction introuvable"}</h2>
                    <button
                        onClick={() => navigate('/admin/transactions')}
                        className="mt-6 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[14px] font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                    >
                        Retour à la liste
                    </button>
                </div>
            </div>
        );
    }

    const statusInfo = getStatusStyle(transaction.status);

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 pb-12">
            {/* Navigation & Actions Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <button
                    onClick={() => navigate('/admin/transactions')}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-[13px] font-black text-slate-600 hover:text-blue-600 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-500/5 transition-all group"
                >
                    <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    Retour aux transactions
                </button>

                <div className="flex items-center gap-3 flex-wrap">
                    <button
                        onClick={() => handleCopy(transaction.reference, "Référence")}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[13px] font-black hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                    >
                        <FiCopy size={14} />
                        Copier la référence
                    </button>
                    {(transaction.status === 'FAILED' || transaction.status === 'CREDIT_FAILED') && (
                        <button
                            onClick={handleRetry}
                            disabled={isRetrying}
                            className={`flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[13px] font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 ${isRetrying ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <FiRefreshCw size={14} className={isRetrying ? "animate-spin" : ""} />
                            {isRetrying ? "Envoi..." : "Relancer le crédit"}
                        </button>
                    )}
                    {transaction.status === 'PENDING' && (
                        <>
                            <button
                                onClick={handleMarkCompleted}
                                disabled={isMarkingCompleted}
                                className={`flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-[13px] font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 ${isMarkingCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <FiCheckSquare size={14} className={isMarkingCompleted ? "animate-pulse" : ""} />
                                {isMarkingCompleted ? "Traitement..." : "Marquer complétée"}
                            </button>
                            <button
                                onClick={handleMarkFailed}
                                disabled={isMarkingFailed}
                                className={`flex items-center gap-2 px-5 py-2.5 bg-rose-600 text-white rounded-xl text-[13px] font-black hover:bg-rose-700 transition-all shadow-lg shadow-rose-500/20 active:scale-95 ${isMarkingFailed ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <FiXSquare size={14} className={isMarkingFailed ? "animate-pulse" : ""} />
                                {isMarkingFailed ? "Traitement..." : "Marquer échouée"}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Transaction Core Overview */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Financial Summary Card */}
                    <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/60 shadow-2xl shadow-slate-200/50 bg-white/40 backdrop-blur-xl">
                        <div className="p-8 sm:p-10">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
                                <div className="space-y-6 flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-black tracking-wide border uppercase shadow-sm ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}>
                                            {statusInfo.icon}
                                            {statusInfo.label}
                                        </span>
                                        {transaction.completed_at && (
                                            <span className="text-[11px] font-bold text-slate-400 uppercase border border-slate-100 px-3 py-1.5 rounded-full tracking-wider flex items-center gap-1.5 bg-white/50">
                                                <FiCalendar size={12} className="text-slate-400" />
                                                Terminé le {new Date(transaction.completed_at).toLocaleDateString('fr-FR')}
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight flex items-baseline gap-2">
                                            {parseFloat(transaction.amount).toLocaleString('fr-FR')}
                                            <span className="text-xl font-black text-slate-400">FCFA</span>
                                        </h1>
                                        <div className="mt-4 flex flex-col gap-2">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-bold">Identifiant Unique</span>
                                            <div className="flex items-center gap-2 group/uid">
                                                <span className="font-mono text-[12px] font-bold text-slate-500 bg-slate-100/80 px-4 py-2.5 rounded-2xl border border-slate-200/40 inline-block break-all max-w-md shadow-inner">
                                                    {transaction.uid}
                                                </span>
                                                <button onClick={() => handleCopy(transaction.uid, "UID")} className="opacity-0 group-hover/uid:opacity-100 p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                                    <FiCopy size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:text-right flex flex-col items-start md:items-end flex-shrink-0">
                                    <div className="w-20 h-20 bg-blue-50/50 rounded-[2rem] flex items-center justify-center text-blue-600 mb-6 shadow-lg shadow-blue-500/5 border border-blue-100/30">
                                        <FiGrid size={36} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none font-bold">RÉFÉRENCE TRANSACTION</div>
                                        <div className="text-2xl font-black text-slate-900 tracking-tight break-all">
                                            {transaction.reference}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-100/60">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Montant Brut</p>
                                    <p className="text-lg font-black text-slate-700">{parseFloat(transaction.amount).toLocaleString('fr-FR')} FCFA</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Frais Système</p>
                                    <p className="text-lg font-black text-rose-600">-{parseFloat(transaction.fees).toLocaleString('fr-FR')} FCFA</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Montant Net</p>
                                    <p className="text-xl font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl inline-block">{parseFloat(transaction.net_amount).toLocaleString('fr-FR')} FCFA</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Entities Details (Source vs Destination) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {/* Source Card */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/30 group hover:border-blue-100 transition-all">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                                    <FiSmartphone size={24} />
                                </div>
                                <div>
                                    <h3 className="text-[16px] font-black text-slate-900 tracking-tight">Source</h3>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Compte Émetteur</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-[13px] font-bold text-slate-500">Réseau</span>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                                        <span className="text-[14px] font-black text-slate-900 uppercase">
                                            {transaction.source_network?.name || 'Inconnu'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[13px] font-bold text-slate-500">Numéro</span>
                                    <span className="text-[14px] font-black text-slate-900 font-mono tracking-wider">
                                        {transaction.source_number || '*********'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[13px] font-bold text-slate-500">Pays</span>
                                    <span className="text-[14px] font-black text-slate-900">
                                        {transaction.source_network?.country_name || '-'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Destination Card */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/30 group hover:border-emerald-100 transition-all">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                                    <FiSmartphone size={24} />
                                </div>
                                <div>
                                    <h3 className="text-[16px] font-black text-slate-900 tracking-tight">Destination</h3>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Compte Récepteur</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-[13px] font-bold text-slate-500">Réseau</span>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="text-[14px] font-black text-slate-900 uppercase">
                                            {transaction.dest_network?.name || 'Inconnu'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[13px] font-bold text-slate-500">Numéro</span>
                                    <span className="text-[14px] font-black text-slate-900 font-mono tracking-wider">
                                        {transaction.dest_number || '*********'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[13px] font-bold text-slate-500">Pays</span>
                                    <span className="text-[14px] font-black text-slate-900">
                                        {transaction.dest_network?.country_name || '-'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Operations / Timeline (if available) */}
                    {transaction.operations && transaction.operations.length > 0 && (
                        <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 border border-slate-100 shadow-xl shadow-slate-200/30">
                            <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
                                <FiActivity className="text-blue-600" />
                                Historique des Opérations
                            </h3>
                            <div className="space-y-6">
                                {transaction.operations.map((op, idx) => (
                                    <div key={op.uid} className="relative flex gap-6">
                                        {idx !== transaction.operations.length - 1 && (
                                            <div className="absolute left-[23px] top-10 bottom-[-24px] w-0.5 bg-slate-100" />
                                        )}
                                        <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center border-4 border-white shadow-sm font-black text-[12px] z-10 ${op.status === 'SUCCESS' || op.status === 'COMPLETED' ? 'bg-emerald-500 text-white' :
                                            op.status === 'PENDING' ? 'bg-amber-400 text-white' : 'bg-rose-500 text-white'
                                            }`}>
                                            {idx + 1}
                                        </div>
                                        <div className="flex-grow pt-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                                <h4 className="text-[15px] font-black text-slate-900">{op.operation_type}</h4>
                                                <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100 uppercase tracking-tighter">
                                                    {new Date(op.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter border ${op.status === 'SUCCESS' || op.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    op.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                                    }`}>
                                                    {op.status === 'SUCCESS' || op.status === 'COMPLETED' ? 'Succès' :
                                                        op.status === 'PENDING' ? 'En attente' : 'Échec'}
                                                </span>
                                                <span className="text-[11px] font-mono font-bold text-slate-400">{op.reference}</span>
                                            </div>
                                            {op.error_message && (
                                                <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4 flex items-start gap-3 mt-2">
                                                    <FiAlertTriangle className="text-rose-500 mt-0.5 flex-shrink-0" size={16} />
                                                    <p className="text-[12px] font-bold text-rose-800 leading-relaxed italic">
                                                        "{op.error_message}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Technical Sidebar */}
                <div className="space-y-8">
                    {/* Error Summary (if any) */}
                    {transaction.error_message && (
                        <div className="bg-rose-600 rounded-[2rem] p-8 text-white shadow-xl shadow-rose-500/20 animate-pulse-slow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-white/20 p-2 rounded-xl">
                                    <FiAlertCircle size={24} />
                                </div>
                                <h3 className="text-lg font-black tracking-tight leading-none">Erreur détectée</h3>
                            </div>
                            <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                                <p className="text-[13px] font-bold leading-relaxed">
                                    {transaction.error_message}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Metadata Card */}
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/30">
                        <h3 className="text-[15px] font-black text-slate-900 mb-6 flex items-center gap-2">
                            <FiFileText className="text-blue-600" />
                            Métadonnées techniques
                        </h3>
                        <div className="space-y-5">
                            <div className="group">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-blue-500 transition-colors">Référence Interne</p>
                                <div className="flex items-center justify-between gap-4">
                                    <p className="text-[13px] font-mono font-black text-slate-700 truncate">{transaction.uid}</p>
                                    <button onClick={() => handleCopy(transaction.uid, "UID")} className="text-slate-300 hover:text-blue-500 transition-colors"><FiCopy size={14} /></button>
                                </div>
                            </div>
                            <div className="group">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-amber-500 transition-colors">Référence Extérieure</p>
                                <p className="text-[13px] font-black text-slate-700">{transaction.external_reference || 'Non définie'}</p>
                            </div>
                            <div className="group">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-emerald-500 transition-colors">Date d'initiation</p>
                                <p className="text-[13px] font-black text-slate-700 flex items-center gap-2">
                                    <FiHash className="text-slate-300" />
                                    {new Date(transaction.created_at).toLocaleString()}
                                </p>
                            </div>
                            <div className="group">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-indigo-500 transition-colors">Tentatives</p>
                                <p className="text-[13px] font-black text-slate-700">{transaction.retry_count || 0} essai(s)</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Sidebar (Optional) */}
                    <div className="bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100 shadow-inner">
                        <div className="flex items-center gap-3 mb-6">
                            <FiActivity className="text-slate-400" />
                            <h3 className="text-[14px] font-black text-slate-600 uppercase tracking-widest">Informations User</h3>
                        </div>
                        <p className="text-[13px] font-bold text-slate-500 mb-2">UID Utilisateur :</p>
                        <p className="text-[12px] font-mono text-slate-400 truncate bg-white p-2 rounded-lg border border-slate-100 mb-4">{transaction.user}</p>
                        <button
                            onClick={() => navigate(`/admin/users/${transaction.user}/transactions`)}
                            className="w-full py-3 bg-white border border-slate-200 rounded-xl text-[12px] font-black text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm"
                        >
                            Voir toutes ses transactions
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetails;
