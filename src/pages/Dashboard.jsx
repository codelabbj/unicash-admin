import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    FiDollarSign, FiActivity, FiGlobe, FiSend, FiClock,
    FiCheckCircle, FiXCircle, FiList, FiTrendingUp, FiBarChart2, FiUsers
} from 'react-icons/fi';
import StatCard from '../components/dashboard/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { statsAPI } from '../api/stats.api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalVolume: 0,
        totalFees: 0,
        statusBreakdown: [],
        dailyVolume: [],
        kyc: {
            total: 0,
            pending: 0,
            approved: 0,
            rejected: 0
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, kycData] = await Promise.all([
                    statsAPI.getAdminStats(),
                    statsAPI.getKycStats()
                ]);

                setStats({
                    totalVolume: statsData.total_volume || 0,
                    totalFees: statsData.total_fees || 0,
                    statusBreakdown: statsData.status_breakdown || [],
                    dailyVolume: statsData.daily_volume || [],
                    kyc: {
                        total: kycData.total_requests || 0,
                        pending: kycData.pending || 0,
                        approved: kycData.approved || 0,
                        rejected: kycData.rejected || 0
                    }
                });
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

    const getStatusColor = (status) => {
        const colors = {
            'COMPLETED': 'bg-emerald-500',
            'SUCCESS': 'bg-emerald-500',
            'FAILED': 'bg-rose-500',
            'DEBIT_FAILED': 'bg-rose-400',
            'CREDIT_FAILED': 'bg-orange-400',
            'PENDING': 'bg-amber-400',
            'DEBIT_INITIATED': 'bg-blue-400'
        };
        return colors[status] || 'bg-slate-400';
    };

    const getStatusLabel = (status) => {
        const labels = {
            'COMPLETED': 'Réussi',
            'SUCCESS': 'Succès',
            'FAILED': 'Échec',
            'DEBIT_FAILED': 'Échec débit',
            'CREDIT_FAILED': 'Échec crédit',
            'PENDING': 'En attente',
            'DEBIT_INITIATED': 'Débit initié'
        };
        return labels[status] || status;
    };

    if (loading) {
        return <LoadingSpinner text="Chargement du tableau de bord..." />;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tableau de bord</h1>
                    <p className="text-slate-500 text-[13px] font-medium mt-1">Aperçu en temps réel des performances UniCash.</p>
                </div>

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

            {/* Principal KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Volume Total" value={formatCurrency(stats.totalVolume)} icon={FiDollarSign} color="blue" />
                <StatCard title="Frais Collectés" value={formatCurrency(stats.totalFees)} icon={FiActivity} color="red" />
                <StatCard title="Total Demandes KYC" value={stats.kyc.total.toString()} icon={FiList} color="slate" />
            </div>

            {/* KYC Details and Status Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* KYC Details Section */}
                {stats.kyc.total > 0 && (
                    <div className="glass-card rounded-[2rem] p-8 border-none ring-1 ring-black/5 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                                <FiCheckCircle size={20} />
                            </div>
                            <h2 className="text-[17px] font-black text-slate-900 tracking-tight">Détails KYC</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-grow">
                            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                                <p className="text-[11px] font-black text-emerald-600 uppercase tracking-wider mb-1">Approuvés</p>
                                <p className="text-2xl font-black text-emerald-700">{stats.kyc.approved}</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100/50">
                                <p className="text-[11px] font-black text-amber-600 uppercase tracking-wider mb-1">En attente</p>
                                <p className="text-2xl font-black text-amber-700">{stats.kyc.pending}</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100/50">
                                <p className="text-[11px] font-black text-rose-600 uppercase tracking-wider mb-1">Rejetés</p>
                                <p className="text-2xl font-black text-rose-700">{stats.kyc.rejected}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Status Breakdown Section */}
                {stats.statusBreakdown.length > 0 && (
                    <div className="glass-card rounded-[2rem] p-8 border-none ring-1 ring-black/5 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                                <FiBarChart2 size={20} />
                            </div>
                            <h2 className="text-[17px] font-black text-slate-900 tracking-tight">Répartition des Statuts</h2>
                        </div>

                        <div className="space-y-4">
                            {stats.statusBreakdown.map((item, index) => {
                                const total = stats.statusBreakdown.reduce((sum, i) => sum + i.count, 0);
                                const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
                                return (
                                    <div key={index}>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-[12.5px] font-bold text-slate-600">{getStatusLabel(item.status)}</span>
                                            <span className="text-[12.5px] font-black text-slate-900">{item.count} ({percentage}%)</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${getStatusColor(item.status)}`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Daily Volume Evolution */}
            {stats.dailyVolume.length > 0 && (
                <div className="glass-card rounded-[2rem] p-8 border-none ring-1 ring-black/5">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                            <FiTrendingUp size={20} />
                        </div>
                        <h2 className="text-[17px] font-black text-slate-900 tracking-tight">Évolution du Volume (7 derniers jours)</h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
                        {stats.dailyVolume.map((item, index) => {
                            const date = new Date(item.day);
                            const dayLabel = date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
                            const maxVol = Math.max(...stats.dailyVolume.map(v => v.volume), 1);
                            const heightPercentage = Math.max((item.volume / maxVol) * 100, 5);

                            return (
                                <div key={index} className="flex flex-col items-center gap-3 group">
                                    <div className="w-full bg-slate-50/50 rounded-xl h-32 flex items-end p-1 overflow-hidden transition-all group-hover:bg-slate-100/50">
                                        <div
                                            className="w-full bg-blue-500/80 rounded-lg transition-all duration-700 ease-out group-hover:bg-blue-600"
                                            style={{ height: `${heightPercentage}%` }}
                                        />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">{dayLabel}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">{item.volume} FCFA</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
