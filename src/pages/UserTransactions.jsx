import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCreditCard } from 'react-icons/fi';
import TransactionTable from '../components/transactions/TransactionTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import { transactionsAPI } from '../api/transactions.api';

const UserTransactions = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    const itemsPerPage = 10;

    const fetchUserTransactions = async () => {
        setIsLoading(true);
        try {
            const response = await transactionsAPI.getUserTransactions(userId, {
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
        if (userId) {
            setCurrentPage(1);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            fetchUserTransactions();
        }
    }, [userId, currentPage]);

    const handleViewDetails = (txn) => {
        // Full detail view logic could go here or navigate to a detail page
        alert(`Détails Transaction: ${txn.reference}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <FiArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Transactions Utilisateur</h1>
                    <p className="text-sm text-gray-500">Historique complet pour l'utilisateur ID: {userId}</p>
                </div>
            </div>

            {/* List */}
            {isLoading ? (
                <LoadingSpinner text="Chargement des transactions..." />
            ) : transactions.length === 0 ? (
                <EmptyState
                    title="Aucune transaction"
                    description="Cet utilisateur n'a pas encore effectué de transaction."
                    icon={<FiCreditCard size={32} />}
                />
            ) : (
                <>
                    <TransactionTable
                        transactions={transactions}
                        onViewDetails={handleViewDetails}
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
        </div>
    );
};

export default UserTransactions;
