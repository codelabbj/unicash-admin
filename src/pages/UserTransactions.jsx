import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCreditCard, FiSearch, FiXCircle, FiRefreshCw } from 'react-icons/fi';
import TransactionTable from '../components/transactions/TransactionTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { transactionsAPI } from '../api/transactions.api';

const UserTransactions = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    const itemsPerPage = 10;

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        txn: null
    });

    const fetchUserTransactions = async () => {
        setIsLoading(true);
        try {
            const response = await transactionsAPI.getUserTransactions(userId, {
                search: searchTerm,
                page: currentPage
            });
            setTransactions(response.data);
            setTotalCount(response.count ?? response.data.length);
            setHasNext(!!response.next);
            setHasPrevious(!!response.previous);
        } catch (error) {
            console.error("Error fetching user transactions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (userId) fetchUserTransactions();
        }, 500);
        return () => clearTimeout(delaySearch);
    }, [userId, searchTerm, currentPage]);

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
            fetchUserTransactions();
        } catch (error) {
            console.error("Error retrying credit:", error);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Row: Title & Search */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-95"
                        title="Retour"
                    >
                        <FiArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Transactions Utilisateur</h1>
                        <p className="text-[14px] text-slate-500 font-medium mt-1.5 flex items-center gap-2">
                            Historique complet pour l'utilisateur ID: <span className="text-blue-600 font-black">{userId}</span>
                        </p>
                    </div>
                </div>

                <div className="relative w-full lg:w-[450px] group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Référence ou UID..."
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

            {/* List */}
            {isLoading ? (
                <div className="py-32 flex flex-col items-center justify-center bg-white/30 backdrop-blur-md rounded-[2.5rem] border border-white/60">
                    <LoadingSpinner />
                </div>
            ) : transactions.length === 0 ? (
                <div className="py-20 bg-white/30 backdrop-blur-md rounded-[2.5rem] border border-white/60">
                    <EmptyState
                        title="Aucune transaction trouvée"
                        description={searchTerm ? "Ajustez votre recherche." : "Cet utilisateur n'a pas encore effectué de transaction."}
                        icon={<FiCreditCard size={48} className="text-slate-300" />}
                    />
                </div>
            ) : (
                <>
                    <TransactionTable
                        transactions={transactions}
                        onViewDetails={handleViewDetails}
                        onRetryCredit={handleRetryCredit}
                    />
                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(totalCount / itemsPerPage)}
                            totalItems={totalCount}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            hasNext={hasNext}
                            hasPrevious={hasPrevious}
                        />
                    </div>
                </>
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

export default UserTransactions;
