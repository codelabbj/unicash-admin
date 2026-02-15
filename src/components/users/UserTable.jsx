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
        <div className="glass-panel overflow-hidden border-none ring-1 ring-black/5">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Utilisateur</th>
                            <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Contact</th>
                            <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Statut</th>
                            <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Compte</th>
                            <th className="px-4 py-3 text-right text-[11px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white/50">
                        {users.map((user) => (
                            <tr key={user.uid} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-4 py-2.5 whitespace-nowrap">
                                    <div className="flex items-center gap-2.5">
                                        <div>
                                            <div className="text-[13px] font-bold text-slate-900 leading-none">
                                                {user.first_name || user.last_name ? `${user.first_name} ${user.last_name}` : 'Utilisateur'}
                                            </div>
                                            <div className="text-[11px] text-slate-400 font-medium mt-1">
                                                Inscrit le {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-2.5 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-[13px] text-slate-700 font-semibold leading-none">{user.email}</span>
                                        <span className="text-[11px] text-slate-400 font-medium mt-1">{user.phone_number || 'Non renseigné'}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-2.5 whitespace-nowrap">
                                    {getKycBadge(user.kycStatus || (user.is_email_verified ? 'VERIFIED' : 'PENDING'))}
                                </td>
                                <td className="px-4 py-2.5 whitespace-nowrap">
                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-black leading-none ${getStatusColor(user.is_active ? 'ACTIVE' : 'BLOCKED')}`}>
                                        {user.is_active ? 'Actif' : 'Bloqué'}
                                    </span>
                                </td>
                                <td className="px-4 py-2.5 text-right whitespace-nowrap">
                                    <div className="flex justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onViewDetails(user)}
                                            className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                            title="Voir Détails"
                                        >
                                            <FiEye size={16} />
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

export default UserTable;
