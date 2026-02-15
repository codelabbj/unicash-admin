import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiCalendar, FiShield, FiCreditCard, FiExternalLink, FiList, FiSlash, FiCheckCircle } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import TransactionTable from '../components/transactions/TransactionTable';
import ConfirmationModal from '../components/common/ConfirmationModal';
import CustomSelect from '../components/common/CustomSelect';
import { toast } from 'react-toastify';
import { usersAPI } from '../api/users.api';
import { transactionsAPI } from '../api/transactions.api';

const UserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('info'); // 'info' or 'transactions'
    const [confirmModalState, setConfirmModalState] = useState({
        isOpen: false,
        action: '' // 'block' or 'unblock'
    });

    useEffect(() => {
        if (userId) {
            fetchUserDetails();
        }
    }, [userId]);

    const fetchUserDetails = async () => {
        setIsLoading(true);
        try {
            const [userRes, transRes] = await Promise.all([
                usersAPI.getUserById(userId),
                transactionsAPI.getUserTransactions(userId)
            ]);
            setUser(userRes.data);
            setTransactions(transRes.data);
        } catch (error) {
            console.error("Error fetching user details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleChange = async (newRole) => {
        try {
            await usersAPI.updateUserRole(userId, newRole);
            fetchUserDetails();
        } catch (error) {
            console.error("Error updating role:", error);
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
            } else {
                await usersAPI.unblockUser(userId);
            }
            fetchUserDetails();
            setConfirmModalState({ ...confirmModalState, isOpen: false });
        } catch (error) {
            console.error(`Error ${confirmModalState.action}ing user:`, error);
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary hover:border-primary transition-all active:scale-90"
                    >
                        <FiArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Profil Utilisateur</h1>
                        <p className="text-[13px] text-slate-500 font-medium">Consultez et gérez les informations de {user.first_name} {user.last_name || ''}.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {user.is_active ? (
                        <button
                            onClick={handleToggleBlockStatus}
                            className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl font-bold hover:bg-rose-100 transition-colors"
                        >
                            <FiSlash size={18} />
                            Bloquer l'utilisateur
                        </button>
                    ) : (
                        <button
                            onClick={handleToggleBlockStatus}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold hover:bg-emerald-100 transition-colors"
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
                        className={`px-6 py-4 text-[14px] font-black border-b-2 transition-all ${activeTab === 'info' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        <div className="flex items-center gap-2">
                            <FiUser size={18} /> Profil
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('transactions')}
                        className={`px-6 py-4 text-[14px] font-black border-b-2 transition-all ${activeTab === 'transactions' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        <div className="flex items-center gap-2">
                            <FiCreditCard size={18} /> Transactions ({transactions.length})
                        </div>
                    </button>
                </div>

                <div className="p-8">
                    {activeTab === 'info' ? (
                        <div className="space-y-8">
                            <section>
                                <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><FiUser size={14} /></div>
                                    Informations & Paramètres
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Informations Personnelles */}
                                    <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 group hover:border-primary/20 transition-all">
                                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-1">Prénom</div>
                                        <div className="text-sm font-black text-slate-800">{user.first_name}</div>
                                    </div>
                                    <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 group hover:border-primary/20 transition-all">
                                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-1">Nom</div>
                                        <div className="text-sm font-black text-slate-800">{user.last_name || 'N/A'}</div>
                                    </div>
                                    <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 group hover:border-primary/20 transition-all">
                                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-1">Email</div>
                                        <div className="flex items-center gap-2">
                                            <FiMail className="text-slate-400" size={14} />
                                            <div className="text-sm font-black text-slate-800 truncate" title={user.email}>{user.email}</div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 group hover:border-primary/20 transition-all">
                                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-1">Téléphone</div>
                                        <div className="flex items-center gap-2">
                                            <FiPhone className="text-slate-400" size={14} />
                                            <div className="text-sm font-black text-slate-800">{user.phone_number || 'N/A'}</div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 group hover:border-primary/20 transition-all">
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
                                    <div className="bg-slate-50/30 p-5 rounded-2xl border border-slate-100">
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
                                                className="w-full rounded-xl border border-slate-200 py-2 px-3 text-[14px] font-black focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 bg-white transition-all shadow-sm"
                                            />
                                            <button
                                                type="submit"
                                                className="px-3 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors text-xs"
                                            >
                                                OK
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </section>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><FiList size={14} /></div>
                                    Historique des Transactions
                                </h3>
                            </div>

                            {transactions.length > 0 ? (
                                <div className="rounded-2xl border border-slate-100 overflow-hidden">
                                    <TransactionTable
                                        transactions={transactions}
                                        onViewDetails={(txn) => navigate(`/admin/transactions/${txn.uid || txn.id}`)}
                                        onRetryCredit={() => { }}
                                    />
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                                    <div className="flex justify-center mb-4">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 shadow-sm border border-slate-100">
                                            <FiCreditCard size={32} />
                                        </div>
                                    </div>
                                    <p className="text-slate-400 font-bold">Aucune transaction trouvée.</p>
                                    <p className="text-[11px] text-slate-400 font-medium">Cet utilisateur n'a pas encore effectué de transactions.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModalState.isOpen}
                onClose={() => setConfirmModalState({ ...confirmModalState, isOpen: false })}
                onConfirm={confirmBlockStatusChange}
                title={confirmModalState.action === 'block' ? 'Bloquer l\'utilisateur' : 'Débloquer l\'utilisateur'}
                message={`Êtes-vous sûr de vouloir ${confirmModalState.action === 'block' ? 'bloquer' : 'débloquer'} cet utilisateur ?`}
                confirmText={confirmModalState.action === 'block' ? 'Bloquer' : 'Débloquer'}
                variant={confirmModalState.action === 'block' ? 'danger' : 'success'}
            />
        </div>
    );
};

export default UserDetails;
