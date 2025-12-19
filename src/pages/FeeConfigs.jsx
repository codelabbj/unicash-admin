import React, { useState, useEffect } from 'react';
import { FiPlus, FiDollarSign } from 'react-icons/fi';
import FeeTable from '../components/fees/FeeTable';
import FeeForm from '../components/fees/FeeForm';
import { feesAPI } from '../api/fees.api';

const FeeConfigs = () => {
    const [configs, setConfigs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentConfig, setCurrentConfig] = useState(null);

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

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette configuration de frais ?')) {
            await feesAPI.deleteFeeConfig(id);
            fetchConfigs();
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
                <div className="py-12 text-center text-gray-500">Chargement...</div>
            ) : (
                <FeeTable
                    configs={configs}
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
                                    <FiDollarSign />
                                </div>
                                {currentConfig ? 'Modifier les frais' : 'Ajouter des frais'}
                            </h2>
                        </div>
                        <FeeForm
                            initialData={currentConfig}
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

export default FeeConfigs;
