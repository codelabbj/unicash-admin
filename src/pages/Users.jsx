import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiUsers } from 'react-icons/fi';
import { toast } from 'react-toastify';
import UserTable from '../components/users/UserTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { usersAPI } from '../api/users.api';
import { formatErrorForDisplay } from '../utils/errorHandler';

const Users = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await usersAPI.getUsers({ search: searchTerm });
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(delaySearch);
    }, [searchTerm]);

    const handleViewDetails = (user) => {
        navigate(`/admin/users/${user.uid}`);
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Utilisateurs</h1>
                    <p className="text-[13px] text-slate-500 font-medium">Consultez et gérez les comptes utilisateurs.</p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-56 rounded-xl border border-gray-200 pl-9 pr-3 py-1.5 text-[13px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white shadow-sm transition-all"
                        />
                        <FiSearch className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* List */}
            {isLoading ? (
                <LoadingSpinner text="Chargement des utilisateurs..." />
            ) : users.length === 0 ? (
                <EmptyState
                    title="Aucun utilisateur trouvé"
                    description={searchTerm ? "Aucun utilisateur ne correspond à votre recherche." : "La base de données utilisateurs est vide."}
                    icon={<FiUsers size={32} />}
                />
            ) : (
                <UserTable
                    users={users}
                    onViewDetails={handleViewDetails}
                />
            )}
        </div>
    );
};

export default Users;
