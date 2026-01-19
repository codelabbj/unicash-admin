import React, { useState, useEffect } from 'react';
import { FiSearch, FiDownload, FiUsers } from 'react-icons/fi';
import ConfirmationModal from '../components/common/ConfirmationModal';
import UserTable from '../components/users/UserTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { usersAPI } from '../api/users.api';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');


    const [confirmModalState, setConfirmModalState] = useState({
        isOpen: false,
        id: null,
        status: null,
        action: ''
    });

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

    const handleUpdateStatus = (id, status) => {
        const action = status === 'ACTIVE' ? 'activer' : 'bloquer';
        setConfirmModalState({
            isOpen: true,
            id,
            status,
            action
        });
    };

    const confirmStatusUpdate = async () => {
        try {
            await usersAPI.updateUserStatus(confirmModalState.id, confirmModalState.status);
            fetchUsers();
            setConfirmModalState({ ...confirmModalState, isOpen: false });
        } catch (error) {
            console.error("Error updating status:", error);
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
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-64 rounded-xl border border-gray-200 pl-10 pr-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white shadow-sm transition-all"
                        />
                        <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
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
                    onUpdateStatus={handleUpdateStatus}
                />
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModalState.isOpen}
                onClose={() => setConfirmModalState({ ...confirmModalState, isOpen: false })}
                onConfirm={confirmStatusUpdate}
                title={confirmModalState.action === 'activer' ? 'Activer le compte' : 'Bloquer le compte'}
                message={`Êtes-vous sûr de vouloir ${confirmModalState.action} cet utilisateur ?`}
                confirmText={confirmModalState.action === 'activer' ? 'Activer' : 'Bloquer'}
                variant={confirmModalState.action === 'activer' ? 'success' : 'danger'}
            />
        </div>
    );
};

export default Users;
