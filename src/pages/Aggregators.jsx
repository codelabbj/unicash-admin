import React, { useState, useEffect } from 'react';
import { FiPlus, FiCreditCard } from 'react-icons/fi';
import Modal from '../components/common/Modal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import AggregatorCard from '../components/aggregators/AggregatorCard';
import AddAggregatorCard from '../components/aggregators/AddAggregatorCard';
import AggregatorForm from '../components/aggregators/AggregatorForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { aggregatorsAPI } from '../api/aggregators.api';

const Aggregators = () => {
    const [aggregators, setAggregators] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAggregator, setCurrentAggregator] = useState(null);
    const [activeTab, setActiveTab] = useState('ALL');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [aggregatorToDelete, setAggregatorToDelete] = useState(null);

    const fetchAggregators = async () => {
        setIsLoading(true);
        try {
            const response = await aggregatorsAPI.getAggregators();
            setAggregators(response.data);
        } catch (error) {
            console.error("Error fetching aggregators:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAggregators();
    }, []);

    const filteredAggregators = aggregators.filter(agg => {
        if (activeTab === 'ACTIVE') return agg.is_active;
        if (activeTab === 'INACTIVE') return !agg.is_active;
        return true;
    });

    const counts = {
        ALL: aggregators.length,
        ACTIVE: aggregators.filter(a => a.is_active).length,
        INACTIVE: aggregators.filter(a => !a.is_active).length
    };

    const handleCreate = () => {
        setCurrentAggregator(null);
        setIsModalOpen(true);
    };

    const handleEdit = (aggregator) => {
        setCurrentAggregator(aggregator);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        setAggregatorToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (aggregatorToDelete) {
            try {
                await aggregatorsAPI.deleteAggregator(aggregatorToDelete);
                fetchAggregators();
                setIsDeleteModalOpen(false);
                setAggregatorToDelete(null);
            } catch (error) {
                console.error("Error deleting aggregator:", error);
            }
        }
    };

    const handleToggleStatus = async (aggregator) => {
        try {
            await aggregatorsAPI.toggleStatus(aggregator.id, aggregator.is_active);
            fetchAggregators();
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };

    const handleSubmit = async (data) => {
        try {
            if (currentAggregator) {
                await aggregatorsAPI.updateAggregator(currentAggregator.id, data);
            } else {
                await aggregatorsAPI.createAggregator(data);
            }
            setIsModalOpen(false);
            fetchAggregators();
        } catch (error) {
            console.error("Error saving aggregator:", error);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-1">Agrégateurs de Paiement</h1>
                    <p className="text-sm text-gray-500 font-medium">Configurez et gérez vos passerelles de paiement partenaires.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 rounded-xl bg-[#2534C1] px-5 py-3 text-[13px] font-bold text-white shadow-lg shadow-blue-100/50 hover:bg-[#1e2a9e] hover:scale-[1.02] transition-all"
                >
                    <FiPlus size={18} strokeWidth={3} /> Ajouter un Agrégateur
                </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-gray-100 pb-px">
                <button
                    onClick={() => setActiveTab('ALL')}
                    className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'ALL' ? 'text-[#2534C1]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Tous ({counts.ALL})
                    {activeTab === 'ALL' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2534C1] rounded-t-full" />}
                </button>
                <button
                    onClick={() => setActiveTab('ACTIVE')}
                    className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'ACTIVE' ? 'text-[#2534C1]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Actifs ({counts.ACTIVE})
                    {activeTab === 'ACTIVE' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2534C1] rounded-t-full" />}
                </button>
                <button
                    onClick={() => setActiveTab('INACTIVE')}
                    className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'INACTIVE' ? 'text-[#2534C1]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Inactifs ({counts.INACTIVE})
                    {activeTab === 'INACTIVE' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2534C1] rounded-t-full" />}
                </button>
            </div>

            {/* Grid Content */}
            {isLoading ? (
                <div className="py-20 flex justify-center">
                    <LoadingSpinner text="Chargement des agrégateurs..." />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredAggregators.map((aggregator) => (
                        <AggregatorCard
                            key={aggregator.id}
                            aggregator={aggregator}
                            onEdit={handleEdit}
                            onToggleStatus={handleToggleStatus}
                        />
                    ))}

                    {/* Add Card always at the end of the filtered list */}
                    <AddAggregatorCard onClick={handleCreate} />
                </div>
            )}

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentAggregator ? "Modifier l'agrégateur" : "Nouvel agrégateur"}
                icon={<FiCreditCard />}
            >
                <AggregatorForm
                    initialData={currentAggregator}
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
                title="Supprimer l'agrégateur"
                message="Êtes-vous sûr de vouloir supprimer cet agrégateur ? Cette action est irréversible."
                confirmText="Supprimer"
                variant="danger"
            />
        </div>
    );
};

export default Aggregators;

