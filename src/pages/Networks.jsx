import React, { useState, useEffect } from 'react';
import { FiPlus, FiWifi } from 'react-icons/fi';
import NetworkTable from '../components/networks/NetworkTable';
import NetworkForm from '../components/networks/NetworkForm';
import { networksAPI } from '../api/networks.api';

const Networks = () => {
    const [networks, setNetworks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNetwork, setCurrentNetwork] = useState(null);

    const fetchNetworks = async () => {
        setIsLoading(true);
        try {
            const response = await networksAPI.getNetworks();
            setNetworks(response.data);
        } catch (error) {
            console.error("Error fetching networks:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNetworks();
    }, []);

    const handleCreate = () => {
        setCurrentNetwork(null);
        setIsModalOpen(true);
    };

    const handleEdit = (network) => {
        setCurrentNetwork(network);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce réseau ?')) {
            await networksAPI.deleteNetwork(id);
            fetchNetworks();
        }
    };

    const handleToggleStatus = async (id) => {
        await networksAPI.toggleStatus(id);
        fetchNetworks();
    };

    const handleSubmit = async (data) => {
        try {
            if (currentNetwork) {
                await networksAPI.updateNetwork(currentNetwork.id, data);
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
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Réseaux Mobiles</h1>
                    <p className="text-sm text-gray-500">Gérez les opérateurs et leurs configurations.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-hover transition-colors"
                >
                    <FiPlus size={18} /> Nouveau Réseau
                </button>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="py-12 text-center text-gray-500">Chargement...</div>
            ) : (
                <NetworkTable
                    networks={networks}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                />
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-blue-50 text-primary">
                                    <FiWifi />
                                </div>
                                {currentNetwork ? 'Modifier le réseau' : 'Nouveau réseau'}
                            </h2>
                        </div>
                        <NetworkForm
                            initialData={currentNetwork}
                            onSubmit={handleSubmit}
                            onCancel={() => setIsModalOpen(false)}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Networks;
