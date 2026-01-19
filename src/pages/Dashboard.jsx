import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    FiDollarSign, FiUsers, FiCreditCard, FiActivity,
    FiArrowUpRight, FiArrowDownRight, FiPlus, FiGlobe, FiSend
} from 'react-icons/fi';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import StatCard from '../components/dashboard/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { transactionsAPI } from '../api/transactions.api';
import { usersAPI } from '../api/users.api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalVolume: 0,
        totalUsers: 0,
        totalTransactions: 0,
        feesCollected: 0
    });
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [txData, usersData] = await Promise.all([
                    transactionsAPI.getTransactions(),
                    usersAPI.getUsers()
                ]);

                const transactions = txData.data || [];
                const users = usersData.data || [];

                // Calculate stats from real data
                const totalVolume = transactions.reduce((acc, tx) => acc + (parseFloat(tx.amount) || 0), 0);
                const successfulTx = transactions.filter(tx => tx.status === 'SUCCESS' || tx.status === 'COMPLETED');
                const fees = successfulTx.reduce((acc, tx) => acc + (parseFloat(tx.fee) || 0), 0);

                setStats({
                    totalVolume,
                    totalUsers: users.length,
                    totalTransactions: transactions.length,
                    feesCollected: fees
                });

                setRecentTransactions(transactions.slice(0, 5));
            } catch (error) {
                console.error("Dashboard data fetch failed:", error);
                toast.error("Impossible de charger les données du tableau de bord");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
    };

    if (loading) {
        return <LoadingSpinner text="Chargement du tableau de bord..." />;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 font-heading tracking-tight">Tableau de bord</h1>
                    <p className="text-slate-500 mt-1">Aperçu en temps réel de votre activité UniCash.</p>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={() => navigate('/admin/transactions')}
                        className="glass-card px-5 py-3 rounded-xl text-sm font-semibold text-blue-600 flex items-center gap-2.5 hover:bg-blue-50 hover:border-blue-100 transition-all active:scale-95 shadow-sm"
                    >
                        <FiSend className="w-4 h-4" />
                        <span>Transactions</span>
                    </button>
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="glass-card px-5 py-3 rounded-xl text-sm font-semibold text-emerald-600 flex items-center gap-2.5 hover:bg-emerald-50 hover:border-emerald-100 transition-all active:scale-95 shadow-sm"
                    >
                        <FiUsers className="w-4 h-4" />
                        <span>Utilisateurs</span>
                    </button>
                    <button
                        onClick={() => navigate('/admin/networks')}
                        className="glass-card px-5 py-3 rounded-xl text-sm font-semibold text-purple-600 flex items-center gap-2.5 hover:bg-purple-50 hover:border-purple-100 transition-all active:scale-95 shadow-sm"
                    >
                        <FiGlobe className="w-4 h-4" />
                        <span>Réseaux</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Volume Total" value={formatCurrency(stats.totalVolume)} icon={FiDollarSign} color="blue" />
                <StatCard title="Utilisateurs" value={stats.totalUsers.toString()} icon={FiUsers} color="green" />
                <StatCard title="Transactions" value={stats.totalTransactions.toString()} icon={FiCreditCard} color="yellow" />
                <StatCard title="Frais Collectés" value={formatCurrency(stats.feesCollected)} icon={FiActivity} color="red" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Volume Chart */}
                <div className="lg:col-span-2 glass-card rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
                    <EmptyState
                        title="Analyse des Volumes"
                        description="Le graphique détaillé des volumes s'affichera ici."
                        icon={<FiActivity />}
                    />
                </div>

                {/* Status */}
                <div className="glass-card rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
                    <EmptyState
                        title="Distribution"
                        description="Répartition des statuts de transactions."
                        icon={<FiActivity />}
                    />
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card rounded-2xl p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">Transactions Récentes</h2>
                        <button onClick={() => navigate('/admin/transactions')} className="text-sm font-medium text-primary hover:text-primary-hover transition-colors">
                            Voir tout
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentTransactions.length === 0 ? (
                            <EmptyState
                                title="Aucune transaction"
                                description="Les transactions récentes apparaîtront ici."
                                icon={<FiCreditCard />}
                            />
                        ) : (
                            recentTransactions.map((txn, index) => (
                                <div key={txn.id || index} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-100 transition-all shadow-sm">
                                            <FiCreditCard size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 tracking-tight">{txn.reference || txn.id}</p>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">{txn.network_name || 'Réseau inconnu'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-slate-900">{formatCurrency(txn.amount)}</p>
                                        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full mt-1 
                                            ${txn.status === 'SUCCESS' || txn.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                                                txn.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                            {txn.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Flux d'Activité</h2>
                    <EmptyState
                        title="Pas d'activité"
                        description="Le flux d'activité est vide pour le moment."
                        icon={<FiActivity />}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

