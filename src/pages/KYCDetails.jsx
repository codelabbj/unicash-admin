import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FiArrowLeft, FiCheck, FiX, FiClock, FiCheckCircle,
    FiXCircle, FiUser, FiCalendar, FiImage, FiFileText, FiAlertTriangle, FiEye
} from 'react-icons/fi';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-toastify';
import { kycAPI } from '../api/kyc.api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import ImagePreviewModal from '../components/common/ImagePreviewModal';

const KYCDetails = () => {
    const { kycUid } = useParams();
    const navigate = useNavigate();
    const [kyc, setKyc] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [previewImage, setPreviewImage] = useState({ isOpen: false, url: '', title: '' });

    const fetchDetails = async () => {
        setIsLoading(true);
        try {
            const response = await kycAPI.getKYCDetails(kycUid);
            setKyc(response.data);
        } catch (error) {
            console.error("Error fetching KYC details:", error);
            toast.error("Impossible de charger les détails de la demande.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [kycUid]);

    const handleApprove = async () => {
        if (!window.confirm("Êtes-vous sûr de vouloir approuver ce KYC ?")) return;

        setIsActionLoading(true);
        try {
            await kycAPI.approveKYC(kycUid);
            toast.success("Demande KYC approuvée avec succès !");
            fetchDetails();
        } catch (error) {
            console.error("Error approving KYC:", error);
            toast.error("Échec de l'approbation.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            toast.warning("Veuillez fournir un motif de rejet.");
            return;
        }

        setIsActionLoading(true);
        try {
            await kycAPI.rejectKYC(kycUid, rejectionReason);
            toast.success("Demande KYC rejetée.");
            setIsRejectModalOpen(false);
            fetchDetails();
        } catch (error) {
            console.error("Error rejecting KYC:", error);
            toast.error("Échec du rejet.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'bg-emerald-500 text-white shadow-lg shadow-emerald-200';
            case 'pending': return 'bg-amber-500 text-white shadow-lg shadow-amber-200';
            case 'rejected': return 'bg-rose-500 text-white shadow-lg shadow-rose-200';
            default: return 'bg-slate-500 text-white';
        }
    };

    if (isLoading) return <div className="py-32 flex justify-center"><LoadingSpinner /></div>;
    if (!kyc) return <div className="py-20 text-center"><p className="text-slate-500">Demande introuvable.</p></div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header / Navigation Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <button
                    onClick={() => navigate('/admin/kyc')}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-all group w-fit"
                >
                    <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm group-hover:border-slate-300 group-hover:bg-slate-50 transition-all">
                        <FiArrowLeft size={18} />
                    </div>
                    <span className="text-sm">Retour à la liste</span>
                </button>

                <div className={`px-6 py-2.5 rounded-2xl text-[12px] font-black uppercase tracking-widest flex items-center gap-2 ${getStatusStyles(kyc.status)}`}>
                    {kyc.status === 'pending' && <FiClock />}
                    {kyc.status === 'approved' && <FiCheckCircle />}
                    {kyc.status === 'rejected' && <FiXCircle />}
                    Statut: {kyc.status}
                </div>
            </div>

            {/* User Profile Info - Horizontal Layout */}
            <div className="glass-card rounded-[2.5rem] p-6 md:p-8 border border-white/60 shadow-xl overflow-hidden bg-white/40 backdrop-blur-md">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                    {/* ID Badge + Core Info */}
                    <div className="flex items-center gap-6 w-full lg:w-auto">
                        <div className="w-14 h-14 md:w-20 md:h-20 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-200/50">
                            <FiUser size={32} strokeWidth={2.5} />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">{kyc.user_name || 'Utilisateur UniCash'}</h2>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <span className="text-[13px] font-mono font-bold text-slate-400">{kyc.user_id}</span>
                                <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200/50">
                                    <FiCalendar className="text-slate-400" size={12} />
                                    <span className="text-[11px] font-black text-slate-600">
                                        Soumis le {format(new Date(kyc.submitted_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Meta Info & Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                        {/* Secondary status info */}
                        {(kyc.rejection_reason || kyc.reviewed_at) && (
                            <div className="flex items-center gap-3 pr-6 border-r border-slate-200 hidden xl:flex">
                                {kyc.reviewed_at && (
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Dernière révision</p>
                                        <p className="text-[12px] font-bold text-slate-700">{format(new Date(kyc.reviewed_at), 'dd/MM/yyyy HH:mm')}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action Buttons if Pending */}
                        {kyc.status === 'pending' ? (
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <button
                                    onClick={handleApprove}
                                    disabled={isActionLoading}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-[13px] transition-all active:scale-95 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                                >
                                    <FiCheck size={18} strokeWidth={3} />
                                    Approuver
                                </button>
                                <button
                                    onClick={() => setIsRejectModalOpen(true)}
                                    disabled={isActionLoading}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black text-[13px] transition-all active:scale-95 shadow-lg shadow-rose-500/20 disabled:opacity-50"
                                >
                                    <FiX size={18} strokeWidth={3} />
                                    Rejeter
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center xl:items-end">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 items-center gap-1.5 flex transition-opacity duration-300">
                                    <FiCheckCircle className={kyc.status === 'approved' ? 'text-emerald-500' : 'text-slate-300'} />
                                    Demande traitée
                                </span>
                                {kyc.rejection_reason && (
                                    <span className="text-xs font-bold text-rose-500 italic max-w-[200px] truncate" title={kyc.rejection_reason}>
                                        {kyc.rejection_reason}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Documents Section - Grid Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Piece Identité */}
                <div className="glass-card rounded-[2.5rem] border border-white/60 shadow-xl overflow-hidden group bg-white/20 backdrop-blur-sm">
                    <div className="p-5 border-b border-slate-100 bg-white/40 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shadow-sm">
                                <FiFileText size={18} />
                            </div>
                            <div>
                                <h4 className="text-[13px] font-black text-slate-900 tracking-tight">Pièce d'Identité</h4>
                                <p className="text-[10px] font-bold text-slate-400">Passeport / CNI</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setPreviewImage({ isOpen: true, url: kyc.id_document_url, title: "Pièce d'Identité" })}
                            className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        >
                            <FiEye size={20} />
                        </button>
                    </div>
                    <div className="p-4 bg-slate-50/30 flex items-center justify-center min-h-[300px]">
                        <div
                            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-white group-hover:shadow-2xl transition-all duration-500 cursor-pointer"
                            onClick={() => setPreviewImage({ isOpen: true, url: kyc.id_document_url, title: "Pièce d'Identité" })}
                        >
                            <img
                                src={kyc.id_document_url}
                                alt="ID"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                                <div className="p-3 bg-white rounded-full text-slate-900 shadow-xl">
                                    <FiEye size={24} strokeWidth={2.5} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Selfie */}
                <div className="glass-card rounded-[2.5rem] border border-white/60 shadow-xl overflow-hidden group bg-white/20 backdrop-blur-sm">
                    <div className="p-5 border-b border-slate-100 bg-white/40 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl shadow-sm">
                                <FiImage size={18} />
                            </div>
                            <div>
                                <h4 className="text-[13px] font-black text-slate-900 tracking-tight">Selfie avec Pièce</h4>
                                <p className="text-[10px] font-bold text-slate-400">Photo de vérification</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setPreviewImage({ isOpen: true, url: kyc.selfie_with_id_url, title: "Selfie" })}
                            className="p-2 text-slate-300 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
                        >
                            <FiEye size={20} />
                        </button>
                    </div>
                    <div className="p-4 bg-slate-50/30 flex items-center justify-center min-h-[300px]">
                        <div
                            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-white group-hover:shadow-2xl transition-all duration-500 cursor-pointer"
                            onClick={() => setPreviewImage({ isOpen: true, url: kyc.selfie_with_id_url, title: "Selfie" })}
                        >
                            <img
                                src={kyc.selfie_with_id_url}
                                alt="Selfie"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                                <div className="p-3 bg-white rounded-full text-slate-900 shadow-xl">
                                    <FiEye size={24} strokeWidth={2.5} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rejection Modal */}
            <Modal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                title="Motif du Rejet"
                icon={<FiXCircle className="text-rose-500" />}
            >
                <div className="space-y-4">
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        Veuillez indiquer la raison pour laquelle cette demande est rejetée. L'utilisateur recevra une notification avec ce message.
                    </p>
                    <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Ex: La photo est floue, le document est expiré..."
                        className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[14px] font-medium focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all"
                    />
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            onClick={() => setIsRejectModalOpen(false)}
                            className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-[13px] font-black hover:bg-slate-50 transition-all"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleReject}
                            disabled={isActionLoading || !rejectionReason.trim()}
                            className="px-8 py-2.5 rounded-xl bg-slate-900 text-white text-[13px] font-black hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                        >
                            Confirmer le rejet
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Image Preview Modal */}
            <ImagePreviewModal
                isOpen={previewImage.isOpen}
                onClose={() => setPreviewImage({ ...previewImage, isOpen: false })}
                imageUrl={previewImage.url}
                title={previewImage.title}
            />
        </div>
    );
};

export default KYCDetails;
