import React, { useState, useEffect } from 'react';
import { FiPlus, FiWifi } from 'react-icons/fi';
import Modal from '../components/common/Modal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import NetworkTable from '../components/networks/NetworkTable';
import NetworkForm from '../components/networks/NetworkForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { networksAPI } from '../api/networks.api';
import { countriesAPI } from '../api/countries.api';

import NetworkStats from '../components/networks/NetworkStats';

const Networks = () => {
    const [networks, setNetworks] = useState([]);
    const [countries, setCountries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNetwork, setCurrentNetwork] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [networkToDelete, setNetworkToDelete] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [networksRes, countriesRes] = await Promise.all([
                networksAPI.getNetworks(),
                countriesAPI.getCountries()
            ]);
            setNetworks(networksRes.data);
            setCountries(countriesRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchNetworks = async () => {
        // Keep this for updates after create/edit/delete
        try {
            const response = await networksAPI.getNetworks();
            setNetworks(response.data);
        } catch (error) {
            console.error("Error fetching networks:", error);
        }
    };

    const handleCreate = () => {
        setCurrentNetwork(null);
        setIsModalOpen(true);
    };

    const handleEdit = (network) => {
        setCurrentNetwork(network);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        setNetworkToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (networkToDelete) {
            try {
                await networksAPI.deleteNetwork(networkToDelete);
                fetchNetworks();
                setIsDeleteModalOpen(false);
                setNetworkToDelete(null);
            } catch (error) {
                console.error("Error deleting network:", error);
            }
        }
    };

    const handleToggleStatus = async (id) => {
        const network = networks.find(n => n.uid === id);
        if (network) {
            await networksAPI.toggleStatus(id, network.is_active);
            fetchNetworks();
        }
    };

    const handleSubmit = async (data) => {
        try {
            if (currentNetwork) {
                await networksAPI.updateNetwork(currentNetwork.uid, data);
            } else {
                await networksAPI.createNetwork(data);
            }
            setIsModalOpen(false);
            fetchNetworks();
        } catch (error) {
            console.error("Error saving network:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gestion des Réseaux</h1>
                    <p className="text-sm text-slate-500 font-medium">Configurez et supervisez les opérateurs mobiles et leurs services.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary-hover hover:scale-[1.02] transition-all"
                >
                    <FiPlus size={20} /> Nouveau Réseau
                </button>
            </div>

            <NetworkStats networks={networks} />

            {/* List */}
            {isLoading ? (
                <LoadingSpinner text="Chargement des réseaux..." />
            ) : networks.length === 0 ? (
                <EmptyState
                    title="Aucun réseau configuré"
                    description="Ajoutez les réseaux mobiles pris en charge par la plateforme."
                    icon={<FiWifi size={32} />}
                    action={
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-hover transition-colors"
                        >
                            <FiPlus size={18} /> Nouveau Réseau
                        </button>
                    }
                />
            ) : (
                <NetworkTable
                    networks={networks}
                    countries={countries}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                />
            )}

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentNetwork ? 'Modifier le réseau' : 'Nouveau réseau'}
                icon={<FiWifi />}
            >
                <NetworkForm
                    initialData={currentNetwork}
                    countries={countries}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                    isLoading={isLoading}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Supprimer le réseau"
                message="Êtes-vous sûr de vouloir supprimer ce réseau ? Cette action est irréversible et pourrait affecter les transactions associées."
                confirmText="Supprimer"
                variant="danger"
            />
        </div >
    );
};

export default Networks;
