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
        <div className="glass-panel rounded-[2.5rem] overflow-hidden border-none shadow-2xl relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[80px] pointer-events-none"></div>

            <div className="overflow-x-auto relative z-10">
                <table className="min-w-full border-separate border-spacing-0">
                    <thead className="bg-[#2534C1]">
                        <tr>
                            {[
                                'Utilisateur', 'Contact', 'Statut KYC', 'Compte', 'Actions'
                            ].map((header) => (
                                <th
                                    key={header}
                                    className={`px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-white/50 border-b border-white/10 ${header === 'Actions' ? 'text-right' : ''}`}
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white/40">
                        {users.map((user) => (
                            <tr key={user.uid} className="hover:bg-primary/[0.03] transition-all group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-inner">
                                            {user.email?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="text-[13px] font-black text-slate-900 leading-none">
                                                {user.first_name || user.last_name ? `${user.first_name} ${user.last_name}` : 'Utilisateur'}
                                            </div>
                                            <div className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">
                                                Inscrit le {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-[13px] text-slate-800 font-black leading-none">{user.email}</span>
                                        <span className="text-[11px] text-slate-400 font-bold mt-1 italic">{user.phone_number || 'Numéro non renseigné'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getKycBadge(user.kycStatus || (user.is_email_verified ? 'VERIFIED' : 'PENDING'))}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex rounded-xl px-3 py-1.5 text-[10px] font-black leading-none border shadow-sm ${getStatusColor(user.is_active ? 'ACTIVE' : 'BLOCKED')}`}>
                                        {user.is_active ? 'ACTIF' : 'BLOQUÉ'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                    <button
                                        onClick={() => onViewDetails(user)}
                                        className="w-9 h-9 inline-flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-900 hover:text-white transition-all active:scale-90 shadow-sm border border-slate-200"
                                        title="Voir Détails"
                                    >
                                        <FiEye size={16} />
                                    </button>
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
