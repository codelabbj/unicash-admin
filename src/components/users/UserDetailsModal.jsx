import React, { useState, useEffect } from 'react';
import { FiX, FiUser, FiMail, FiPhone, FiCalendar, FiShield, FiClock, FiCreditCard } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';
import TransactionTable from '../transactions/TransactionTable';
import { usersAPI } from '../../api/users.api';
import { transactionsAPI } from '../../api/transactions.api';

const UserDetailsModal = ({ isOpen, onClose, userId }) => {
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('info'); // 'info' or 'transactions'

    useEffect(() => {
        if (isOpen && userId) {
            fetchUserDetails();
        }
    }, [isOpen, userId]);

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-white/20 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white/50">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Détails de l'utilisateur</h2>
                        <p className="text-[13px] text-slate-500 font-medium">Informations complètes et historique.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-600"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {isLoading ? (
                    <div className="p-20">
                        <LoadingSpinner text="Récupération des données..." />
                    </div>
                ) : user ? (
                    <>
                        {/* Tabs */}
                        <div className="flex px-6 border-b border-gray-100 bg-slate-50/50">
                            <button
                                onClick={() => setActiveTab('info')}
                                className={`px-4 py-3 text-[13px] font-bold border-b-2 transition-all ${activeTab === 'info' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <FiUser size={16} /> Profil
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('transactions')}
                                className={`px-4 py-3 text-[13px] font-bold border-b-2 transition-all ${activeTab === 'transactions' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <FiCreditCard size={16} /> Transactions ({transactions.length})
                                </div>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            {activeTab === 'info' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left: General Info */}
                                    <div className="space-y-6">
                                        <section>
                                            <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                                <FiUser className="text-primary" /> Informations Personnelles
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group hover:border-primary/20 transition-all">
                                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-1">Nom Complet</div>
                                                    <div className="text-sm font-black text-slate-800">{user.first_name} {user.last_name || 'N/A'}</div>
                                                </div>
                                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group hover:border-primary/20 transition-all">
                                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-1">Email</div>
                                                    <div className="flex items-center gap-2">
                                                        <FiMail className="text-slate-400" size={14} />
                                                        <div className="text-sm font-black text-slate-800">{user.email}</div>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group hover:border-primary/20 transition-all">
                                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-1">Téléphone</div>
                                                    <div className="flex items-center gap-2">
                                                        <FiPhone className="text-slate-400" size={14} />
                                                        <div className="text-sm font-black text-slate-800">{user.phone_number || 'N/A'}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>

                                    {/* Right: Account & Role */}
                                    <div className="space-y-6">
                                        <section>
                                            <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                                <FiShield className="text-primary" /> Paramètres du compte
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-1">Status</div>
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black shadow-sm ${user.is_active ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-rose-100 text-rose-700 border border-rose-200'}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></span>
                                                        {user.is_active ? 'ACTIF' : 'BLOQUÉ'}
                                                    </span>
                                                </div>

                                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-1">Rôle Utilisateur</div>
                                                    <select
                                                        value={user.is_staff || user.role === 'ADMIN' ? 'ADMIN' : 'USER'}
                                                        onChange={(e) => handleRoleChange(e.target.value)}
                                                        className="w-full mt-2 rounded-xl border border-slate-200 py-2 px-3 text-[13px] font-bold focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white transition-all shadow-sm"
                                                    >
                                                        <option value="USER">Utilisateur Standard</option>
                                                        <option value="ADMIN">Administrateur</option>
                                                    </select>
                                                </div>

                                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-1">Inscrit le</div>
                                                    <div className="flex items-center gap-2">
                                                        <FiCalendar className="text-slate-400" size={14} />
                                                        <div className="text-sm font-black text-slate-800">{new Date(user.created_at).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {transactions.length > 0 ? (
                                        <TransactionTable
                                            transactions={transactions}
                                            onViewDetails={(txn) => console.log(txn)}
                                            onRetryCredit={() => { }} // Pass dummy or implement
                                        />
                                    ) : (
                                        <div className="text-center py-10 text-slate-400">
                                            Aucune transaction pour cet utilisateur.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="p-10 text-center text-slate-500">
                        Impossible de charger les données de l'utilisateur.
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDetailsModal;
