import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiShield, FiRefreshCw, FiXCircle } from 'react-icons/fi';
import GlassSelect from '../components/common/GlassSelect';
import KYCTable from '../components/kyc/KYCTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { kycAPI } from '../api/kyc.api';

const KYC = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({
        total_requests: 0,
        pending: 0,
        approved: 0,
        rejected: 0
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const params = { status: statusFilter };
            if (searchTerm.trim()) {
                params.search = searchTerm.trim();
            }

            const [requestsRes, statsRes] = await Promise.all([
                kycAPI.getKYCRequests(params),
                kycAPI.getKYCStatistics()
            ]);
            setRequests(requestsRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error("Error fetching KYC data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchData();
        }, 500);
        return () => clearTimeout(delaySearch);
    }, [statusFilter, searchTerm]);

    const handleViewDetails = (req) => {
        navigate(`/admin/kyc/${req.uid}`);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-primary rounded-[2rem] text-white shadow-xl shadow-primary/20">
                        <FiShield size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Vérifications KYC</h1>
                        <p className="text-[14px] text-slate-500 font-medium mt-1.5 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            Garantissez la conformité et la sécurité des comptes utilisateurs.
                        </p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-4">
                    <div className="glass-card bg-white/60 p-4 rounded-[1.5rem] shadow-sm flex flex-col items-center min-w-[100px] border-none group hover:bg-white transition-all">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">En attente</span>
                        <span className="text-2xl font-black text-amber-500">{stats.pending}</span>
                    </div>
                    <div className="glass-card bg-white/60 p-4 rounded-[1.5rem] shadow-sm flex flex-col items-center min-w-[100px] border-none group hover:bg-white transition-all">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Traitées</span>
                        <span className="text-2xl font-black text-emerald-500">{stats.approved + stats.rejected}</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="relative z-40 glass-card rounded-[1.5rem] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/60 bg-white/40 backdrop-blur-md shadow-lg shadow-slate-200/50">
                <div className="flex flex-wrap items-center gap-4 flex-grow">
                    {/* Search */}
                    <div className="w-full sm:w-[240px] relative group">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none group-hover:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-9 py-2.5 rounded-xl bg-white/60 border border-slate-100 text-[13px] font-semibold text-slate-600 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <FiXCircle size={16} />
                            </button>
                        )}
                    </div>

                    <div className="w-full sm:w-[200px] relative group">
                        <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none group-hover:text-blue-500 transition-colors" />
                        <GlassSelect
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            options={[
                                { value: "", label: "Tous les statuts" },
                                { value: "pending", label: "En attente" },
                                { value: "approved", label: "Approuvé" },
                                { value: "rejected", label: "Rejeté" }
                            ]}
                            selectClassName="!pl-11 !py-2.5 !rounded-xl !bg-white/60 !border-slate-100 !text-[13px] !font-black !text-slate-600 hover:!border-slate-300 w-full"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                    {!isLoading && (
                        <div className="flex items-center gap-2 whitespace-nowrap">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Demandes</span>
                            <div className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[12px] font-black shadow-lg shadow-blue-500/20">
                                {requests.length}
                            </div>
                        </div>
                    )}

                    {(statusFilter || searchTerm) && (
                        <button
                            onClick={() => {
                                setStatusFilter('');
                                setSearchTerm('');
                            }}
                            className="flex items-center gap-2 text-rose-500 text-[12px] font-black hover:text-rose-600 hover:scale-105 active:scale-95 transition-all bg-rose-50 px-3 py-2 rounded-xl border border-rose-100 whitespace-nowrap"
                        >
                            <FiRefreshCw size={14} />
                            Réinitialiser
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="py-32 flex flex-col items-center justify-center bg-white/30 backdrop-blur-md rounded-[2.5rem] border border-white/60">
                    <LoadingSpinner />
                </div>
            ) : requests.length === 0 ? (
                <div className="py-20 bg-white/30 backdrop-blur-md rounded-[2.5rem] border border-white/60">
                    <EmptyState
                        title="Aucune demande KYC"
                        description={statusFilter || searchTerm ? "Aucune demande ne correspond à vos critères." : "Toutes les demandes ont été traitées !"}
                        icon={<FiShield size={48} className="text-slate-300" />}
                    />
                </div>
            ) : (
                <KYCTable
                    requests={requests}
                    onViewDetails={handleViewDetails}
                />
            )}
        </div>
    );
};

export default KYC;
