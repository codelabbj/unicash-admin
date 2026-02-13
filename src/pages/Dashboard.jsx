import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    FiDollarSign, FiUsers, FiCreditCard, FiActivity,
    FiArrowUpRight, FiArrowDownRight, FiPlus, FiGlobe, FiSend, FiMoreVertical
} from 'react-icons/fi';
// No charts used currently
import StatCard from '../components/dashboard/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { transactionsAPI } from '../api/transactions.api';
import { usersAPI } from '../api/users.api';
import { statsAPI } from '../api/stats.api';

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
    const [charts, setCharts] = useState({
        volumeEvolution: [],
        statusDistribution: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [txData, usersData, statsData] = await Promise.all([
                    transactionsAPI.getTransactions(),
                    usersAPI.getUsers(),
                    statsAPI.getAdminStats()
                ]);

                const transactions = txData.data || [];
                const users = usersData.data || [];

                // 1. Calculate Status Distribution
                const statusCounts = {};
                const statusNames = {
                    'SUCCESS': 'Succès',
                    'COMPLETED': 'Succès',
                    'PENDING': 'En attente',
                    'FAILED': 'Échec',
                    'UNKNOWN': 'Inconnu'
                };

                transactions.forEach(tx => {
                    const status = tx.status || 'UNKNOWN';
                    const name = statusNames[status] || 'Inconnu';
                    statusCounts[name] = (statusCounts[name] || 0) + 1;
                });

                const totalForDist = transactions.length || 1;
                const statusDistribution = Object.entries(statusCounts).map(([name, value]) => ({
                    name,
                    value: Math.round((value / totalForDist) * 100),
                    count: value
                })).sort((a, b) => b.value - a.value).slice(0, 4);

                setStats({
                    totalVolume: statsData.total_volume || transactions.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0),
                    totalUsers: statsData.total_users || users.length,
                    totalTransactions: statsData.total_transactions || transactions.length,
                    feesCollected: statsData.total_fees || 0
                });

                setCharts({
                    statusDistribution
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
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tableau de bord</h1>
                    <p className="text-slate-500 text-[13px] font-medium mt-1">Aperçu en temps réel de votre activité UniCash.</p>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => navigate('/admin/transactions')}
                        className="glass-card px-4 py-2.5 rounded-xl text-[12.5px] font-bold text-blue-600 flex items-center gap-2 hover:bg-blue-50 hover:border-blue-100 transition-all active:scale-95 shadow-sm"
                    >
                        <FiSend className="w-3.5 h-3.5" />
                        <span>Transactions</span>
                    </button>
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="glass-card px-4 py-2.5 rounded-xl text-[12.5px] font-bold text-emerald-600 flex items-center gap-2 hover:bg-emerald-50 hover:border-emerald-100 transition-all active:scale-95 shadow-sm"
                    >
                        <FiUsers className="w-3.5 h-3.5" />
                        <span>Utilisateurs</span>
                    </button>
                    <button
                        onClick={() => navigate('/admin/networks')}
                        className="glass-card px-4 py-2.5 rounded-xl text-[12.5px] font-bold text-purple-600 flex items-center gap-2 hover:bg-purple-50 hover:border-purple-100 transition-all active:scale-95 shadow-sm"
                    >
                        <FiGlobe className="w-3.5 h-3.5" />
                        <span>Réseaux</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard title="Volume Total" value={formatCurrency(stats.totalVolume)} icon={FiDollarSign} color="blue" />
                <StatCard title="Utilisateurs" value={stats.totalUsers.toString()} icon={FiUsers} color="green" />
                <StatCard title="Transactions" value={stats.totalTransactions.toString()} icon={FiCreditCard} color="yellow" />
                <StatCard title="Frais Collectés" value={formatCurrency(stats.feesCollected)} icon={FiActivity} color="red" />
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Status distribution section (matching "Répartition par Pays" style) */}
                <div className="glass-card rounded-[2rem] p-8 border-none ring-1 ring-black/5">
                    <h2 className="text-[17px] font-black text-slate-900 tracking-tight mb-8">Répartition des Opérations</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {charts.statusDistribution.length === 0 ? (
                            <div className="lg:col-span-4 py-12 text-center text-slate-400 text-sm italic font-medium">Capture des données en cours...</div>
                        ) : (
                            charts.statusDistribution.map((item, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[13px] font-bold text-slate-700">{item.name}</span>
                                        <span className="text-[13px] font-black text-slate-900">{item.value}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${item.name === 'Succès' ? 'bg-[#2534C1]' :
                                                item.name === 'En attente' ? 'bg-amber-400' :
                                                    item.name === 'Échec' ? 'bg-rose-500' : 'bg-slate-400'
                                                }`}
                                            style={{ width: `${item.value}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Transaction and Activity columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-4">
                <div className="glass-card rounded-[2rem] p-8 border-none ring-1 ring-black/5">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-[17px] font-black text-slate-900 tracking-tight">Transactions Récentes</h2>
                            <p className="text-[13px] text-slate-400 font-medium">Les 5 dernières opérations</p>
                        </div>
                        <button onClick={() => navigate('/admin/transactions')} className="text-[13px] font-black text-primary hover:text-primary-hover transition-colors">
                            Voir tout
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentTransactions.length === 0 ? (
                            <EmptyState
                                title="Aucune transaction"
                                description="Les transactions récentes apparaîtront ici."
                                icon={<FiCreditCard size={28} />}
                            />
                        ) : (
                            recentTransactions.map((txn, index) => (
                                <div key={txn.uid || index} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50/50 transition-all cursor-pointer group border border-transparent hover:border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-black text-primary group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                            {txn.user_full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-black text-slate-900 tracking-tight">#UC-{txn.reference?.slice(-6) || txn.uid?.slice(0, 6)}</p>
                                            <p className="text-[11px] text-slate-400 font-semibold">{txn.source_network_name || 'Réseau'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[14px] font-black text-slate-900">{formatCurrency(txn.amount)}</p>
                                        <span className={`inline-block px-2 py-0.5 text-[9px] font-black rounded-full mt-1 uppercase tracking-tight
                                            ${txn.status === 'SUCCESS' || txn.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                                                txn.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                                            {txn.status === 'SUCCESS' || txn.status === 'COMPLETED' ? 'SUCCÈS' :
                                                txn.status === 'PENDING' ? 'EN ATTENTE' :
                                                    txn.status === 'FAILED' ? 'ÉCHEC' : 'INCONNU'}
                                        </span>
                                    </div>
                                    <div className="hidden group-hover:block ml-2 self-center">
                                        <FiMoreVertical className="text-slate-300" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="glass-card rounded-[2rem] p-8 border-none ring-1 ring-black/5">
                    <h2 className="text-[17px] font-black text-slate-900 mb-8">Flux d'Activité</h2>
                    <EmptyState
                        title="Pas d'activité"
                        description="Le flux d'activité est vide pour le moment."
                        icon={<FiActivity size={28} />}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

