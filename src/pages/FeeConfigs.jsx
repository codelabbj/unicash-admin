import React, { useState, useEffect } from 'react';
import { FiPlus, FiDollarSign, FiSettings, FiGrid, FiCheckCircle, FiTrendingUp, FiFilter, FiChevronDown } from 'react-icons/fi';
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
        const config = configs.find(c => (c.id || c.uid) === id);
        await feesAPI.toggleStatus(id, config.is_active);
        fetchConfigs();
    };

    const handleSubmit = async (data) => {
        try {
            if (currentConfig) {
                await feesAPI.updateFeeConfig(currentConfig.id || currentConfig.uid, data);
            } else {
                await feesAPI.createFeeConfig(data);
            }
            setIsModalOpen(false);
            fetchConfigs();
        } catch (error) {
            console.error("Error saving fee config:", error);
        }
    };

    const stats = {
        total: configs.length,
        active: configs.filter(c => c.is_active).length,
        averageFee: configs.length > 0
            ? (configs.reduce((acc, curr) => acc + (curr.percentage_rate || 0), 0) / configs.length).toFixed(2)
            : "0.00"
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-1">Configuration des Frais</h1>
                    <p className="text-slate-500 text-sm font-medium tracking-wide">Gérez les commissions et les frais de transaction par réseau de paiement.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-[13px] font-black text-white shadow-lg shadow-primary/25 hover:bg-primary-hover hover:scale-[1.02] active:scale-95 transition-all"
                >
                    <FiPlus size={18} strokeWidth={3} /> Nouvelle Configuration
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'TOTAL RÉSEAUX', value: stats.total, icon: FiGrid, color: 'bg-indigo-50 text-indigo-500' },
                    { label: 'ACTIFS', value: stats.active, icon: FiCheckCircle, color: 'bg-emerald-50 text-emerald-500' },
                    { label: 'FRAIS MOYENS', value: `${stats.averageFee}%`, icon: FiTrendingUp, color: 'bg-orange-50 text-orange-500' },
                ].map((stat, i) => (
                    <div key={i} className="glass-panel p-4 rounded-2xl flex items-center gap-4 border-none shadow-md shadow-slate-100/50 hover:shadow-lg transition-all group">
                        <div className={`w-11 h-11 rounded-xl ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                            <stat.icon size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 tracking-widest">{stat.label}</p>
                            <h4 className="text-xl font-black text-slate-800 tracking-tight">{stat.value}</h4>
                        </div>
                    </div>
                ))}

                {/* Quick Filter */}
                <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 border-none shadow-md shadow-slate-100/50 hover:shadow-lg transition-all cursor-pointer group">
                    <div className="w-11 h-11 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center transition-transform group-hover:scale-110">
                        <FiFilter size={18} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                        <p className="text-[9px] font-black text-slate-400 tracking-widest text-left">FILTRE RAPIDE</p>
                        <div className="flex items-center justify-between mt-0.5">
                            <span className="text-[13px] font-black text-slate-800">Tous les types</span>
                            <FiChevronDown className="text-slate-400" size={14} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Table */}
            {isLoading ? (
                <div className="py-20">
                    <LoadingSpinner text="Analyse des configurations..." />
                </div>
            ) : configs.length === 0 ? (
                <div className="py-12 px-6">
                    <EmptyState
                        title="Aucune configuration active"
                        description="Commencez par définir les frais pour vos réseaux partenaires."
                        icon={<FiDollarSign size={40} />}
                        action={
                            <button
                                onClick={handleCreate}
                                className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-black text-white shadow-lg shadow-primary/25 hover:bg-primary-hover transition-all"
                            >
                                <FiPlus size={20} strokeWidth={3} /> Créer maintenant
                            </button>
                        }
                    />
                </div>
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
                title={currentConfig ? 'Modifier la Configuration' : 'Nouvelle Configuration'}
                icon={<FiDollarSign />}
            >
                <div className="px-2">
                    <FeeForm
                        initialData={currentConfig}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsModalOpen(false)}
                        isLoading={isLoading}
                    />
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Supprimer la configuration"
                message="Êtes-vous sûr de vouloir supprimer cette règle de frais ? Cette action est irréversible."
                confirmText="Supprimer définitivement"
                variant="danger"
            />
        </div>
    );
};

export default FeeConfigs;
