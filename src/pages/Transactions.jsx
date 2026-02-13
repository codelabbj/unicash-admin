import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiDownload, FiCreditCard, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import GlassSelect from '../components/common/GlassSelect';
import TransactionTable from '../components/transactions/TransactionTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { transactionsAPI } from '../api/transactions.api';

const Transactions = () => {
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
        console.log("View details for:", txn);
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
        <div className="space-y-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Transactions</h1>
                    <p className="text-[13px] text-slate-500 font-medium">Suivez l'ensemble des flux d'argent sur la plateforme.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Référence, utilisateur..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-56 rounded-xl border border-gray-200 pl-9 pr-3 py-1.5 text-[13px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white transition-all shadow-sm"
                        />
                        <FiSearch className="absolute left-3 top-2.5 text-gray-400 w-4 h-4 cursor-default" />
                    </div>
                    <div className="w-full sm:w-44">
                        <GlassSelect
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            options={[
                                { value: "", label: "Tous les statuts" },
                                { value: "COMPLETED", label: "Succès" },
                                { value: "PENDING", label: "En attente" },
                                { value: "FAILED", label: "Échec" },
                                { value: "UNKNOWN", label: "Inconnu" }
                            ]}
                            placeholder="Statut"
                        />
                    </div>
                </div>
            </div>

            {/* List */}
            {isLoading ? (
                <LoadingSpinner text="Chargement des transactions..." />
            ) : transactions.length === 0 ? (
                <EmptyState
                    title="Aucune transaction trouvée"
                    description={searchTerm || statusFilter ? "Aucun résultat pour vos filtres." : "Aucune transaction n'a été enregistrée."}
                    icon={<FiCreditCard size={32} />}
                />
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
                message={`Êtes-vous sûr de vouloir re-créditer la transaction ${confirmModal.txn?.reference} ?`}
                confirmText="Re-créditer"
                variant="warning"
            />
        </div>
    );
};

export default Transactions;
