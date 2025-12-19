import React, { useState, useEffect } from 'react';
import { FiSearch, FiDownload } from 'react-icons/fi';
import UserTable from '../components/users/UserTable';
import { usersAPI } from '../api/users.api';

const Users = () => {
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
        const delayDebounceFn = setTimeout(() => {
            fetchUsers();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleUpdateStatus = async (id, status) => {
        const action = status === 'ACTIVE' ? 'activer' : 'bloquer';
        if (window.confirm(`Êtes-vous sûr de vouloir ${action} cet utilisateur ?`)) {
            try {
                await usersAPI.updateUserStatus(id, status);
                fetchUsers();
            } catch (error) {
                console.error("Error updating status:", error);
            }
        }
    };

    const handleViewDetails = (user) => {
        alert(`Détails pour ${user.fullName} (ID: ${user.id})\nFonctionnalité complète à venir (Modal/Page dédiée).`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
                    <p className="text-sm text-gray-500">Consultez et gérez les comptes utilisateurs.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-64 rounded-xl border border-gray-200 pl-10 pr-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                        />
                        <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="py-12 text-center text-gray-500">Chargement...</div>
            ) : (
                <UserTable
                    users={users}
                    onViewDetails={handleViewDetails}
                    onUpdateStatus={handleUpdateStatus}
                />
            )}
        </div>
    );
};

export default Users;
