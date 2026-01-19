import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiDownload, FiCreditCard } from 'react-icons/fi';
import GlassSelect from '../components/common/GlassSelect';
import TransactionTable from '../components/transactions/TransactionTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { transactionsAPI } from '../api/transactions.api';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

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
        fetchTransactions();
    }, [searchTerm, statusFilter]);

    const handleViewDetails = (txn) => {
        alert(`Détails Transaction: ${txn.reference}\nStatut: ${txn.status}\nDe: ${txn.senderNetwork} Vers: ${txn.receiverNetwork}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Historique des Transactions</h1>
                    <p className="text-sm text-gray-500">Suivez l'ensemble des flux d'argent sur la plateforme.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Référence, utilisateur..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-64 rounded-xl border border-gray-200 pl-10 pr-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white transition-all shadow-sm"
                        />
                        <FiSearch className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    </div>
                    <div className="w-full sm:w-48">
                        <GlassSelect
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            options={[
                                { value: "", label: "Tous les statuts" },
                                { value: "COMPLETED", label: "Succès" },
                                { value: "PENDING", label: "En attente" },
                                { value: "FAILED", label: "Échec" }
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
                />
            )}
        </div>
    );
};

export default Transactions;
