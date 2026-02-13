import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiDownload, FiCreditCard, FiRefreshCw, FiAlertCircle, FiCalendar, FiGlobe, FiXCircle } from 'react-icons/fi';
import GlassSelect from '../components/common/GlassSelect';
import TransactionTable from '../components/transactions/TransactionTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { transactionsAPI } from '../api/transactions.api';

const Transactions = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        txn: null
    });

    const fetchTransactions = async () => {
        setIsLoading(true);
        try {
            const response = await transactionsAPI.getTransactions({
                search: searchTerm,
                status: statusFilter
            });
            setTransactions(response.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchTransactions();
        }, 500);
        return () => clearTimeout(delaySearch);
    }, [searchTerm, statusFilter]);

    const handleViewDetails = (txn) => {
        navigate(`/admin/transactions/${txn.uid}`);
    };

    const handleRetryCredit = (txn) => {
        setConfirmModal({
            isOpen: true,
            txn
        });
    };

    const confirmRetryCredit = async () => {
        const { txn } = confirmModal;
        if (!txn) return;

        try {
            await transactionsAPI.retryCredit(txn.uid);
            setConfirmModal({ isOpen: false, txn: null });
            fetchTransactions();
        } catch (error) {
            console.error("Error retrying credit:", error);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Row: Title & Search */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Transactions</h1>
                    <p className="text-[14px] text-slate-500 font-medium mt-1.5 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Suivi en temps réel des flux financiers UniCash.
                    </p>
                </div>

                <div className="relative w-full lg:w-[450px] group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Référence..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-2xl text-[14px] font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm hover:border-slate-300 group-hover:shadow-md"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-rose-500 transition-colors"
                        >
                            <FiXCircle size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Toolbar Row: Unified Filters */}
            <div className="relative z-40 glass-card rounded-[1.5rem] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/60 bg-white/40 backdrop-blur-md shadow-lg shadow-slate-200/50">
                <div className="flex flex-wrap items-center gap-4 flex-grow">
                    {/* Status Dropdown */}
                    <div className="w-full sm:w-[280px] relative group">
                        <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none group-hover:text-amber-500 transition-colors" />
                        <GlassSelect
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            options={[
                                { value: "", label: "Tous les statuts" },
                                { value: "COMPLETED", label: "Succès" },
                                { value: "PENDING", label: "En attente" },
                                { value: "FAILED", label: "Échec" },
                                { value: "DEBIT_FAILED", label: "Échec Débit" },
                                { value: "CREDIT_FAILED", label: "Échec Crédit" }
                            ]}
                            selectClassName="!pl-11 !py-2.5 !rounded-xl !bg-white/60 !border-slate-100 !text-[13px] !font-black !text-slate-600 hover:!border-slate-300"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                    {/* Results Counter */}
                    {!isLoading && (
                        <div className="flex items-center gap-2 whitespace-nowrap">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Résultats</span>
                            <div className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[12px] font-black shadow-lg shadow-blue-500/20">
                                {transactions.length}
                            </div>
                        </div>
                    )}

                    {/* Reset Button */}
                    {(statusFilter || searchTerm) && (
                        <button
                            onClick={() => {
                                setStatusFilter('');
                                setSearchTerm('');
                            }}
                            className="flex items-center gap-2 text-rose-500 text-[12px] font-black hover:text-rose-600 hover:scale-105 active:scale-95 transition-all bg-rose-50 px-3 py-2 rounded-xl border border-rose-100"
                        >
                            <FiRefreshCw size={14} className="animate-spin-once" />
                            Réinitialiser
                        </button>
                    )}
                </div>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="py-32 flex flex-col items-center justify-center bg-white/30 backdrop-blur-md rounded-[2.5rem] border border-white/60">
                    <LoadingSpinner />
                    <div className="mt-6 flex flex-col items-center gap-2">
                        <p className="text-[15px] font-black text-slate-900 tracking-tight">Indexation en cours</p>
                        <p className="text-[12px] font-bold text-slate-400 italic">Nous optimisons l'affichage des données...</p>
                    </div>
                </div>
            ) : transactions.length === 0 ? (
                <div className="py-20 bg-white/30 backdrop-blur-md rounded-[2.5rem] border border-white/60">
                    <EmptyState
                        title="Aucune transaction trouvée"
                        description={searchTerm || statusFilter ? "Ajustez vos filtres pour obtenir des résultats." : "Aucune transaction enregistrée pour le moment."}
                        icon={<FiCreditCard size={48} className="text-slate-300" />}
                    />
                </div>
            ) : (
                <TransactionTable
                    transactions={transactions}
                    onViewDetails={handleViewDetails}
                    onRetryCredit={handleRetryCredit}
                />
            )}

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, txn: null })}
                onConfirm={confirmRetryCredit}
                title="Confirmer le re-crédit"
                message={`Êtes-vous sûr de vouloir re-créditer la transaction ${confirmModal.txn?.reference} ? Cette action est immédiate.`}
                confirmText="Re-créditer maintenant"
                variant="warning"
            />
        </div>
    );
};

export default Transactions;
