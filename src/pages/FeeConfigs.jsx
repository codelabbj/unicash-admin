import React, { useState, useEffect } from 'react';
import { FiPlus, FiDollarSign, FiSettings } from 'react-icons/fi';
import Modal from '../components/common/Modal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import FeeTable from '../components/fees/FeeTable';
import FeeForm from '../components/fees/FeeForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { feesAPI } from '../api/fees.api';

const FeeConfigs = () => {
    const [configs, setConfigs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentConfig, setCurrentConfig] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [configToDelete, setConfigToDelete] = useState(null);

    const fetchConfigs = async () => {
        setIsLoading(true);
        try {
            const response = await feesAPI.getFeeConfigs();
            setConfigs(response.data);
        } catch (error) {
            console.error("Error fetching fee configs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchConfigs();
    }, []);

    const handleCreate = () => {
        setCurrentConfig(null);
        setIsModalOpen(true);
    };

    const handleEdit = (config) => {
        setCurrentConfig(config);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        setConfigToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (configToDelete) {
            try {
                await feesAPI.deleteFeeConfig(configToDelete);
                fetchConfigs();
                setIsDeleteModalOpen(false);
                setConfigToDelete(null);
            } catch (error) {
                console.error("Error deleting fee config:", error);
            }
        }
    };

    const handleToggleStatus = async (id) => {
        await feesAPI.toggleStatus(id);
        fetchConfigs();
    };

    const handleSubmit = async (data) => {
        try {
            if (currentConfig) {
                await feesAPI.updateFeeConfig(currentConfig.id, data);
            } else {
                await feesAPI.createFeeConfig(data);
            }
            setIsModalOpen(false);
            fetchConfigs();
        } catch (error) {
            console.error("Error saving fee config:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Configuration des Frais</h1>
                    <p className="text-sm text-gray-500">Définissez les frais applicables par réseau et par tranche de montant.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-hover transition-colors"
                >
                    <FiPlus size={18} /> Nouvelle Configuration
                </button>
            </div>

            {/* List */}
            {isLoading ? (
                <LoadingSpinner text="Chargement des frais..." />
            ) : configs.length === 0 ? (
                <EmptyState
                    title="Aucune configuration de frais"
                    description="Définissez les frais pour les transactions."
                    icon={<FiSettings size={32} />}
                    action={
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-hover transition-colors"
                        >
                            <FiPlus size={18} /> Nouvelle Configuration
                        </button>
                    }
                />
            ) : (
                <FeeTable
                    configs={configs}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                />
            )}

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentConfig ? 'Modifier les frais' : 'Ajouter des frais'}
                icon={<FiDollarSign />}
            >
                <FeeForm
                    initialData={currentConfig}
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
                title="Supprimer la configuration"
                message="Êtes-vous sûr de vouloir supprimer cette configuration de frais ? Cette action est irréversible."
                confirmText="Supprimer"
                variant="danger"
            />
        </div>
    );
};

export default FeeConfigs;
