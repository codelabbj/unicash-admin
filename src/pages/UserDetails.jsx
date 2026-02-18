import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiCalendar, FiShield, FiCreditCard, FiExternalLink, FiList, FiSlash, FiCheckCircle, FiSearch, FiXCircle, FiRefreshCw } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import TransactionTable from '../components/transactions/TransactionTable';
import ConfirmationModal from '../components/common/ConfirmationModal';
import CustomSelect from '../components/common/CustomSelect';
import Pagination from '../components/common/Pagination';
import { toast } from 'react-toastify';
import { usersAPI } from '../api/users.api';
import { transactionsAPI } from '../api/transactions.api';

const UserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isTransLoading, setIsTransLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('info'); // 'info' or 'transactions'

    // Transactions pagination & search state
    const [transSearchTerm, setTransSearchTerm] = useState('');
    const [transCurrentPage, setTransCurrentPage] = useState(1);
    const [transTotalCount, setTransTotalCount] = useState(0);
    const [transHasNext, setTransHasNext] = useState(false);
    const [transHasPrevious, setTransHasPrevious] = useState(false);
    const itemsPerPage = 10;

    const [confirmModalState, setConfirmModalState] = useState({
        isOpen: false,
        action: '' // 'block' or 'unblock'
    });

    const [confirmRetryModal, setConfirmRetryModal] = useState({
        isOpen: false,
        txn: null
    });

    const fetchUserDetails = async () => {
        setIsLoading(true);
        try {
            const userRes = await usersAPI.getUserById(userId);
            setUser(userRes.data);
        } catch (error) {
            console.error("Error fetching user details:", error);
            toast.error("Impossible de récupérer les détails de l'utilisateur.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserTransactions = useCallback(async () => {
        setIsTransLoading(true);
        try {
            const transRes = await transactionsAPI.getUserTransactions(userId, {
                search: transSearchTerm,
                page: transCurrentPage
            });
            setTransactions(transRes.data);
            setTransTotalCount(transRes.count || 0);
            setTransHasNext(!!transRes.next);
            setTransHasPrevious(!!transRes.previous);
        } catch (error) {
            console.error("Error fetching user transactions:", error);
        } finally {
            setIsTransLoading(false);
        }
    }, [userId, transSearchTerm, transCurrentPage]);

    useEffect(() => {
        if (userId) {
            fetchUserDetails();
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            const delaySearch = setTimeout(() => {
                fetchUserTransactions();
            }, 500);
            return () => clearTimeout(delaySearch);
        }
    }, [userId, transSearchTerm, transCurrentPage, fetchUserTransactions]);

    useEffect(() => {
        setTransCurrentPage(1);
    }, [transSearchTerm]);

    const handleRoleChange = async (newRole) => {
        try {
            await usersAPI.updateUserRole(userId, newRole);
            toast.success("Rôle mis à jour");
            fetchUserDetails();
        } catch (error) {
            console.error("Error updating role:", error);
            toast.error("Erreur lors de la mise à jour du rôle");
        }
    };

    const handleToggleBlockStatus = () => {
        setConfirmModalState({
            isOpen: true,
            action: user.is_active ? 'block' : 'unblock'
        });
    };

    const confirmBlockStatusChange = async () => {
        try {
            if (confirmModalState.action === 'block') {
                await usersAPI.blockUser(userId);
                toast.warning("Utilisateur bloqué");
            } else {
                await usersAPI.unblockUser(userId);
                toast.success("Utilisateur débloqué");
            }
            fetchUserDetails();
            setConfirmModalState({ ...confirmModalState, isOpen: false });
        } catch (error) {
            console.error(`Error ${confirmModalState.action}ing user:`, error);
            toast.error(`Erreur lors du ${confirmModalState.action === 'block' ? 'blocage' : 'déblocage'} de l'utilisateur.`);
        }
    };

    const handleUpdateFee = async (e) => {
        e.preventDefault();
        const feeRate = parseFloat(e.target.feeRate.value);
        if (isNaN(feeRate)) return;

        try {
            await usersAPI.updateUserFee(userId, feeRate);
            toast.success("Frais mis à jour avec succès");
            fetchUserDetails();
        } catch (error) {
            console.error("Error updating fee:", error);
            toast.error("Erreur lors de la mise à jour des frais");
        }
    };

    const handleRetryCredit = (txn) => {
        setConfirmRetryModal({
            isOpen: true,
            txn
        });
    };

    const confirmRetryCredit = async () => {
        const { txn } = confirmRetryModal;
        if (!txn) return;

        try {
            await transactionsAPI.retryCredit(txn.uid);
            toast.success("Crédit relancé avec succès");
            setConfirmRetryModal({ isOpen: false, txn: null });
            fetchUserTransactions();
        } catch (error) {
            console.error("Error retrying credit:", error);
            toast.error("Erreur lors de la relance du crédit");
        }
    };

    if (isLoading) {
        return <LoadingSpinner text="Récupération des données utilisateur..." />;
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-slate-500 font-bold">Utilisateur non trouvé.</p>
                <button
                    onClick={() => navigate('/admin/users')}
                    className="mt-4 text-primary font-black hover:underline flex items-center gap-2"
                >
                    <FiArrowLeft /> Retour à la liste
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-90"
                    >
                        <FiArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Profil Utilisateur</h1>
                        <p className="text-[13px] text-slate-500 font-medium tracking-tight">Consultez et gérez les informations de <span className="text-blue-600 font-black">{user.first_name} {user.last_name || ''}</span>.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {user.is_active ? (
                        <button
                            onClick={handleToggleBlockStatus}
                            className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl font-bold hover:bg-rose-100 transition-colors shadow-sm"
                        >
                            <FiSlash size={18} />
                            Bloquer l'utilisateur
                        </button>
                    ) : (
                        <button
                            onClick={handleToggleBlockStatus}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold hover:bg-emerald-100 transition-colors shadow-sm"
                        >
                            <FiCheckCircle size={18} />
                            Débloquer l'utilisateur
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col min-h-[600px]">
                {/* Tabs */}
                <div className="flex px-8 border-b border-slate-50 bg-slate-50/30">
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`px-6 py-4 text-[14px] font-black border-b-2 transition-all ${activeTab === 'info' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        <div className="flex items-center gap-2">
                            <FiUser size={18} /> Profil
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('transactions')}
                        className={`px-6 py-4 text-[14px] font-black border-b-2 transition-all ${activeTab === 'transactions' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        <div className="flex items-center gap-2">
                            <FiCreditCard size={18} /> Transactions (<span className="text-blue-600">{transTotalCount}</span>)
                        </div>
                    </button>
                </div>

                <div className="p-8">
                    {activeTab === 'info' ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <section>
                                <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><FiUser size={14} /></div>
                                    Informations & Paramètres
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Informations Personnelles */}
                                    <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 group hover:border-blue-500/20 transition-all">
                                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-1">Prénom</div>
                                        <div className="text-sm font-black text-slate-800">{user.first_name}</div>
                                    </div>
                                    <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 group hover:border-blue-500/20 transition-all">
                                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-1">Nom</div>
                                        <div className="text-sm font-black text-slate-800">{user.last_name || 'N/A'}</div>
                                    </div>
                                    <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 group hover:border-blue-500/20 transition-all">
                                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-1">Email</div>
                                        <div className="flex items-center gap-2">
                                            <FiMail className="text-slate-400" size={14} />
                                            <div className="text-sm font-black text-slate-800 truncate" title={user.email}>{user.email}</div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 group hover:border-blue-500/20 transition-all">
                                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-1">Téléphone</div>
                                        <div className="flex items-center gap-2">
                                            <FiPhone className="text-slate-400" size={14} />
                                            <div className="text-sm font-black text-slate-800">{user.phone_number || 'N/A'}</div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 group hover:border-blue-500/20 transition-all">
                                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-1">ID Utilisateur</div>
                                        <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-tighter truncate">{user.uid}</div>
                                    </div>

                                    {/* Status */}
                                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center">
                                        <div className="flex items-center justify-between">
                                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Statut</div>
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black shadow-sm ${user.is_active ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full bg-white ${!user.is_active && 'animate-pulse'}`}></span>
                                                {user.is_active ? 'ACTIF' : 'BLOQUÉ'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Role */}
                                    <div className="bg-slate-50/30 p-5 rounded-2xl border border-slate-100 shadow-inner">
                                        <CustomSelect
                                            label="Rôle Utilisateur"
                                            value={user.is_staff || user.role === 'ADMIN' ? 'ADMIN' : 'USER'}
                                            onChange={handleRoleChange}
                                            options={[
                                                { value: 'USER', label: 'Utilisateur Standard' },
                                                { value: 'ADMIN', label: 'Administrateur' }
                                            ]}
                                        />
                                    </div>

                                    {/* Created At */}
                                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-2">Inscrit depuis le</div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><FiCalendar size={18} /></div>
                                            <div className="text-sm font-black text-slate-800">{new Date(user.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                                        </div>
                                    </div>

                                    {/* Specific Fee */}
                                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-2">Frais Spécifiques (%)</div>
                                        <form onSubmit={handleUpdateFee} className="flex gap-2">
                                            <input
                                                type="number"
                                                name="feeRate"
                                                step="0.01"
                                                min="0"
                                                placeholder="0.00"
                                                defaultValue={user.fee_rate || ''}
                                                className="w-full rounded-xl border border-slate-200 py-2 px-3 text-[14px] font-black focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10 bg-white transition-all shadow-sm"
                                            />
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors text-xs shadow-md"
                                            >
                                                OK
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </section>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><FiList size={14} /></div>
                                    Historique des Transactions
                                </h3>

                                <div className="relative w-full sm:w-[350px] group">
                                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Référence ou UID..."
                                        value={transSearchTerm}
                                        onChange={(e) => setTransSearchTerm(e.target.value)}
                                        className="w-full pl-11 pr-10 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                                    />
                                    {transSearchTerm && (
                                        <button
                                            onClick={() => setTransSearchTerm('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-500 transition-colors"
                                        >
                                            <FiXCircle size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {isTransLoading ? (
                                <div className="py-20 flex justify-center bg-slate-50/30 rounded-3xl border border-slate-50">
                                    <LoadingSpinner text="Mise à jour de la liste..." />
                                </div>
                            ) : transactions.length > 0 ? (
                                <>
                                    <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                                        <TransactionTable
                                            transactions={transactions}
                                            onViewDetails={(txn) => navigate(`/admin/transactions/${txn.uid || txn.id}`)}
                                            onRetryCredit={handleRetryCredit}
                                        />
                                    </div>
                                    <div className="pt-4">
                                        <Pagination
                                            currentPage={transCurrentPage}
                                            totalPages={Math.ceil(transTotalCount / itemsPerPage)}
                                            totalItems={transTotalCount}
                                            itemsPerPage={itemsPerPage}
                                            onPageChange={setTransCurrentPage}
                                            hasNext={transHasNext}
                                            hasPrevious={transHasPrevious}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                                    <div className="flex justify-center mb-4">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 shadow-sm border border-slate-100">
                                            <FiCreditCard size={32} />
                                        </div>
                                    </div>
                                    <p className="text-slate-400 font-bold">Aucune transaction trouvée.</p>
                                    <p className="text-[11px] text-slate-400 font-medium">
                                        {transSearchTerm ? "Aucun résultat pour cette recherche." : "Cet utilisateur n'a pas encore effectué de transactions."}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Block/Unblock Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModalState.isOpen}
                onClose={() => setConfirmModalState({ ...confirmModalState, isOpen: false })}
                onConfirm={confirmBlockStatusChange}
                title={confirmModalState.action === 'block' ? 'Bloquer l\'utilisateur' : 'Débloquer l\'utilisateur'}
                message={`Êtes-vous sûr de vouloir ${confirmModalState.action === 'block' ? 'bloquer' : 'débloquer'} cet utilisateur ?`}
                confirmText={confirmModalState.action === 'block' ? 'Bloquer' : 'Débloquer'}
                variant={confirmModalState.action === 'block' ? 'danger' : 'success'}
            />

            {/* Retry Credit Modal */}
            <ConfirmationModal
                isOpen={confirmRetryModal.isOpen}
                onClose={() => setConfirmRetryModal({ isOpen: false, txn: null })}
                onConfirm={confirmRetryCredit}
                title="Relancer le crédit"
                message={`Voulez-vous vraiment relancer le crédit pour la transaction ${confirmRetryModal.txn?.reference} ?`}
                confirmText="Relancer maintenant"
                variant="warning"
            />
        </div>
    );
};

export default UserDetails;
