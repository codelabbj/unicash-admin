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
        <div className="space-y-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Utilisateurs</h1>
                    <p className="text-[13px] text-slate-500 font-medium">Consultez et gérez les comptes utilisateurs.</p>
                </div>
                <div className="flex flex-col gap-3 w-full md:w-auto">
                    {/* Search and Filter Toggle */}
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1 md:w-64">
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2 text-[13px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white shadow-sm transition-all"
                            />
                            <FiSearch className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[13px] font-medium transition-all ${
                                hasActiveFilters 
                                    ? 'border-primary bg-primary/10 text-primary' 
                                    : 'border-gray-200 bg-white text-slate-600 hover:border-gray-300'
                            }`}
                        >
                            <FiFilter className="w-4 h-4" />
                            <span className="hidden sm:inline">Filtres</span>
                            {hasActiveFilters && (
                                <span className="flex items-center justify-center w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full">
                                    {[statusFilter, roleFilter, countryFilter].filter(Boolean).length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-[13px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option value="">Tous les statuts</option>
                                <option value="active">Actif</option>
                                <option value="inactive">Inactif</option>
                                <option value="suspended">Suspendu</option>
                            </select>

                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-[13px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option value="">Tous les rôles</option>
                                <option value="user">Utilisateur</option>
                                <option value="merchant">Marchand</option>
                                <option value="admin">Administrateur</option>
                                <option value="agent">Agent</option>
                            </select>

                            <select
                                value={countryFilter}
                                onChange={(e) => setCountryFilter(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-[13px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option value="">Tous les pays</option>
                                <option value="CI">Côte d'Ivoire</option>
                                <option value="SN">Sénégal</option>
                                <option value="ML">Mali</option>
                                <option value="BF">Burkina Faso</option>
                                <option value="TG">Togo</option>
                                <option value="BJ">Bénin</option>
                            </select>

                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1 px-3 py-2 text-[13px] text-slate-500 hover:text-slate-700 transition-colors"
                                >
                                    <FiX className="w-4 h-4" />
                                    Réinitialiser
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

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
