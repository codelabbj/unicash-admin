import React from 'react';
import { FiEye, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const KYCTable = ({ requests, onViewDetails }) => {
    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'bg-[#39D196]/10 text-[#39D196] border-[#39D196]/20';
            case 'pending':
                return 'bg-amber-100 text-amber-600 border-amber-200';
            case 'rejected':
                return 'bg-rose-100 text-rose-600 border-rose-200';
            default:
                return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return <FiCheckCircle />;
            case 'pending': return <FiClock />;
            case 'rejected': return <FiXCircle />;
            default: return null;
        }
    };

    const getStatusLabel = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'Approuvé';
            case 'pending': return 'En attente';
            case 'rejected': return 'Rejeté';
            default: return status;
        }
    };

    return (
        <div className="glass-panel overflow-hidden border-none shadow-2xl rounded-[2.5rem] relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[80px] pointer-events-none"></div>

            <div className="overflow-x-auto relative z-10">
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead className="bg-[#2534C1]">
                        <tr>
                            {[
                                'Date Soumission', 'Utilisateur', 'Statut', 'Actions'
                            ].map((header) => (
                                <th
                                    key={header}
                                    className={`px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/50 border-b border-white/10 ${header === 'Actions' ? 'text-right' : ''}`}
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white/40">
                        {requests.map((req) => (
                            <tr key={req.uid} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-black text-slate-700">
                                            {format(new Date(req.submitted_at), 'dd MMMM yyyy', { locale: fr })}
                                        </span>
                                        <span className="text-[11px] font-bold text-slate-400 mt-0.5">
                                            {format(new Date(req.submitted_at), 'HH:mm:ss')}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-black text-slate-700 truncate max-w-[200px]">
                                            {req.user_name || 'Utilisateur UniCash'}
                                        </span>
                                        <span className="text-[11px] font-mono font-bold text-slate-400 mt-0.5">
                                            {req.user_id}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-black tracking-tight ${getStatusStyles(req.status)}`}>
                                        {getStatusIcon(req.status)}
                                        {getStatusLabel(req.status)}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <button
                                        onClick={() => onViewDetails(req)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[12px] font-black hover:border-blue-500 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-500/10 transition-all active:scale-95"
                                    >
                                        <FiEye size={14} strokeWidth={3} />
                                        Examiner
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

export default KYCTable;
