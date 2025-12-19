import React from 'react';
import { FiEye, FiCheckCircle, FiXCircle, FiMoreVertical } from 'react-icons/fi';

const UserTable = ({ users, onViewDetails, onUpdateStatus }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-50 text-green-700';
            case 'BLOCKED': return 'bg-red-50 text-red-700';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getKycBadge = (status) => {
        switch (status) {
            case 'VERIFIED':
                return <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700"><FiCheckCircle /> Vérifié</span>;
            case 'PENDING':
                return <span className="inline-flex items-center gap-1 rounded bg-yellow-50 px-2 py-0.5 text-xs font-semibold text-yellow-700">En attente</span>;
            case 'REJECTED':
                return <span className="inline-flex items-center gap-1 rounded bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">Rejeté</span>;
            default:
                return <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">Non vérifié</span>;
        }
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Utilisateur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Compte</th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-gray-100">
                                        <img src={user.avatar} alt="" className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900">{user.fullName}</div>
                                        <div className="text-xs text-gray-500">Inscrit le {new Date(user.joinedAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-900">{user.email}</span>
                                    <span className="text-xs text-gray-500">{user.phone}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {getKycBadge(user.kycStatus)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(user.status)}`}>
                                    {user.status === 'ACTIVE' ? 'Actif' : 'Bloqué'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap text-sm font-medium">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => onViewDetails(user)}
                                        className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                        title="Voir Détails"
                                    >
                                        <FiEye size={16} />
                                    </button>
                                    {user.status === 'ACTIVE' ? (
                                        <button
                                            onClick={() => onUpdateStatus(user.id, 'BLOCKED')}
                                            className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                            title="Bloquer"
                                        >
                                            <FiXCircle size={16} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onUpdateStatus(user.id, 'ACTIVE')}
                                            className="rounded-lg p-2 text-gray-400 hover:bg-green-50 hover:text-green-600 transition-colors"
                                            title="Activer"
                                        >
                                            <FiCheckCircle size={16} />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
