import React, { useState, useEffect } from 'react';
import { FiPlus, FiCreditCard, FiServer } from 'react-icons/fi';
import Modal from '../components/common/Modal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import AggregatorTable from '../components/aggregators/AggregatorTable';
import AggregatorForm from '../components/aggregators/AggregatorForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { aggregatorsAPI } from '../api/aggregators.api';

const Aggregators = () => {
    const [aggregators, setAggregators] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAggregator, setCurrentAggregator] = useState(null);

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

    const handleToggleStatus = async (id) => {
        await aggregatorsAPI.toggleStatus(id);
        fetchAggregators();
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
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Agrégateurs de Paiement</h1>
                    <p className="text-sm text-gray-500">Gérez les partenaires d'agrégation de paiement.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-hover transition-colors"
                >
                    <FiPlus size={18} /> Ajouter un Agrégateur
                </button>
            </div>

            {/* List */}
            {isLoading ? (
                <LoadingSpinner text="Chargement des agrégateurs..." />
            ) : aggregators.length === 0 ? (
                <EmptyState
                    title="Aucun agrégateur configuré"
                    description="Ajoutez les partenaires d'agrégation de paiement."
                    icon={<FiServer size={32} />}
                    action={
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-hover transition-colors"
                        >
                            <FiPlus size={18} /> Ajouter un Agrégateur
                        </button>
                    }
                />
            ) : (
                <AggregatorTable
                    aggregators={aggregators}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                />
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

