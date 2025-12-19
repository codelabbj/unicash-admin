import React from 'react';
import { FiClock, FiCheckCircle, FiXCircle, FiInfo } from 'react-icons/fi';

const TransactionTable = ({ transactions, onViewDetails }) => {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'COMPLETED':
                return <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700"><FiCheckCircle /> Succès</span>;
            case 'PENDING':
                return <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-700"><FiClock /> En attente</span>;
            case 'FAILED':
                return <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700"><FiXCircle /> Échec</span>;
            default:
                return <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-700">Inconnu</span>;
        }
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date & Référence</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Utilisateur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Montant</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Réseaux</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Statut</th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {transactions.map((txn) => (
                        <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-gray-900">{txn.reference}</div>
                                <div className="text-xs text-gray-500">{new Date(txn.createdAt).toLocaleString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {txn.userName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-gray-900">{txn.amount.toLocaleString()} F</div>
                                <div className="text-xs text-gray-500">Frais: {txn.fee} F</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                    <span className="font-semibold">{txn.senderNetwork}</span>
                                    <span>→</span>
                                    <span className="font-semibold">{txn.receiverNetwork}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(txn.status)}
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() => onViewDetails(txn)}
                                    className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                >
                                    <FiInfo size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;
