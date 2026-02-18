import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiUsers, FiFilter, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import UserTable from '../components/users/UserTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import { usersAPI } from '../api/users.api';
import { formatErrorForDisplay } from '../utils/errorHandler';

const Users = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    const itemsPerPage = 10;
    const [showFilters, setShowFilters] = useState(false);

    // Filters
    const [statusFilter, setStatusFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [countryFilter, setCountryFilter] = useState('');

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const params = {
                search: searchTerm,
                page: currentPage,
                status: statusFilter,
                role: roleFilter,
                country: countryFilter
            };

            // Remove empty params
            Object.keys(params).forEach(key => {
                if (!params[key]) delete params[key];
            });

            const response = await usersAPI.getUsers(params);
            setUsers(response.data);
            setTotalCount(response.count ?? response.data.length);
            setHasNext(!!response.next);
            setHasPrevious(!!response.previous);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, roleFilter, countryFilter]);

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(delaySearch);
    }, [searchTerm, statusFilter, roleFilter, countryFilter, currentPage]);

    const hasActiveFilters = statusFilter || roleFilter || countryFilter;

    const clearFilters = () => {
        setStatusFilter('');
        setRoleFilter('');
        setCountryFilter('');
    };

    const handleViewDetails = (user) => {
        navigate(`/admin/users/${user.uid}`);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Utilisateurs</h1>
                    <p className="text-[14px] text-slate-500 font-medium mt-1.5 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Gérez les comptes clients et la sécurité de la plateforme.
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-[400px] group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FiSearch className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Nom, email, téléphone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-[14px] font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm hover:border-slate-300 group-hover:shadow-md"
                        />
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center justify-center w-[54px] h-[54px] rounded-2xl border transition-all active:scale-95 ${hasActiveFilters
                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                        title="Filtrer"
                    >
                        <FiFilter size={20} className={hasActiveFilters ? 'animate-pulse' : ''} />
                    </button>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="glass-panel p-6 rounded-[2rem] border-white/60 shadow-xl animate-in slide-in-from-top-4 duration-300">
                    <div className="flex items-baseline justify-between mb-4 border-b border-slate-100 pb-4">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Filtres Avancés</h3>
                        {hasActiveFilters && (
                            <button onClick={clearFilters} className="text-[11px] font-black text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-widest">Réinitialiser tout</button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Statut du compte</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full bg-white/50 border-slate-200 rounded-xl px-4 py-3 text-[13px] font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                            >
                                <option value="">Tous les statuts</option>
                                <option value="active">Actif</option>
                                <option value="inactive">Inactif</option>
                                <option value="suspended">Suspendu</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type de rôle</label>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full bg-white/50 border-slate-200 rounded-xl px-4 py-3 text-[13px] font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                            >
                                <option value="">Tous les rôles</option>
                                <option value="user">Utilisateur</option>
                                <option value="merchant">Marchand</option>
                                <option value="admin">Administrateur</option>
                                <option value="agent">Agent</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pays de résidence</label>
                            <select
                                value={countryFilter}
                                onChange={(e) => setCountryFilter(e.target.value)}
                                className="w-full bg-white/50 border-slate-200 rounded-xl px-4 py-3 text-[13px] font-bold text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                            >
                                <option value="">Tous les pays</option>
                                <option value="CI">Côte d'Ivoire</option>
                                <option value="SN">Sénégal</option>
                                <option value="ML">Mali</option>
                                <option value="BF">Burkina Faso</option>
                                <option value="TG">Togo</option>
                                <option value="BJ">Bénin</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* List */}
            {isLoading ? (
                <LoadingSpinner text="Chargement des utilisateurs..." />
            ) : users.length === 0 ? (
                <EmptyState
                    title="Aucun utilisateur trouvé"
                    description={searchTerm || hasActiveFilters ? "Aucun utilisateur ne correspond à vos critères." : "La base de données utilisateurs est vide."}
                    icon={<FiUsers size={32} />}
                />
            ) : (
                <>
                    <UserTable
                        users={users}
                        onViewDetails={handleViewDetails}
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(totalCount / itemsPerPage)}
                        totalItems={totalCount}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        hasNext={hasNext}
                        hasPrevious={hasPrevious}
                    />
                </>
            )}
        </div>
    );
};

export default Users;
