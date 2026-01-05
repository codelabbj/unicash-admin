import React, { useState, useEffect } from 'react';
import { FiPlus, FiCreditCard } from 'react-icons/fi';
import AggregatorTable from '../components/aggregators/AggregatorTable';
import AggregatorForm from '../components/aggregators/AggregatorForm';
import { aggregatorsAPI } from '../api/aggregators.api';

const Aggregators = () => {
    const [aggregators, setAggregators] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAggregator, setCurrentAggregator] = useState(null);

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

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet agrégateur ?')) {
            await aggregatorsAPI.deleteAggregator(id);
            fetchAggregators();
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
                <div className="py-12 text-center text-gray-500">Chargement...</div>
            ) : (
                <AggregatorTable
                    aggregators={aggregators}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                />
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-blue-50 text-primary">
                                    <FiCreditCard />
                                </div>
                                {currentAggregator ? "Modifier l'agrégateur" : "Nouvel agrégateur"}
                            </h2>
                        </div>
                        <AggregatorForm
                            initialData={currentAggregator}
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

export default Aggregators;

