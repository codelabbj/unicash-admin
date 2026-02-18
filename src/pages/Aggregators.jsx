import React, { useState, useEffect } from 'react';
import { FiCreditCard, FiSearch, FiX } from 'react-icons/fi';
import Modal from '../components/common/Modal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import AggregatorCard from '../components/aggregators/AggregatorCard';
import AggregatorForm from '../components/aggregators/AggregatorForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { aggregatorsAPI } from '../api/aggregators.api';

const Aggregators = () => {
    const [aggregators, setAggregators] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAggregator, setCurrentAggregator] = useState(null);
    const [activeTab, setActiveTab] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [aggregatorToDelete, setAggregatorToDelete] = useState(null);

    const fetchAggregators = async () => {
        setIsLoading(true);
        try {
            const params = {};
            if (searchTerm.trim()) params.search = searchTerm.trim();
            const response = await aggregatorsAPI.getAggregators(params);
            setAggregators(response.data);
        } catch (error) {
            console.error("Error fetching aggregators:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            fetchAggregators();
        }, 500);
        return () => clearTimeout(delaySearch);
    }, [searchTerm]);

    const filteredAggregators = aggregators.filter(agg => {
        const matchesTab = activeTab === 'ALL' ? true :
            activeTab === 'ACTIVE' ? agg.is_active :
                !agg.is_active;
        return matchesTab;
    });

    const counts = {
        ALL: aggregators.length,
        ACTIVE: aggregators.filter(a => a.is_active).length,
        INACTIVE: aggregators.filter(a => !a.is_active).length
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
            await aggregatorsAPI.toggleStatus(aggregator.uid, aggregator.is_active);
            fetchAggregators();
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };

    const handleSubmit = async (data) => {
        try {
            if (currentAggregator) {
                await aggregatorsAPI.updateAggregator(currentAggregator.uid, data);
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
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header with Search */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Passerelles de Paiement</h1>
                    <p className="text-[14px] text-slate-500 font-medium mt-1.5 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Gérez les intégrations avec vos partenaires agrégateurs.
                    </p>
                </div>

                <div className="relative w-full lg:w-[400px] group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Rechercher partenaires..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-2xl text-[14px] font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm hover:border-slate-300 group-hover:shadow-md"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-rose-500 transition-colors"
                        >
                            <FiXCircle size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-[1.5rem] w-fit shadow-inner">
                {[
                    { id: 'ALL', label: 'Toutes', count: counts.ALL },
                    { id: 'ACTIVE', label: 'Actives', count: counts.ACTIVE },
                    { id: 'INACTIVE', label: 'Inactives', count: counts.INACTIVE }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-2.5 rounded-xl text-[12px] font-black tracking-widest transition-all duration-300 flex items-center gap-2.5 ${activeTab === tab.id
                                ? 'bg-white text-primary shadow-lg shadow-black/5 scale-[1.02]'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                            }`}
                    >
                        {tab.label.toUpperCase()}
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-600'}`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Grid Content */}
            {isLoading ? (
                <div className="py-20 flex justify-center">
                    <LoadingSpinner text="Chargement des agrégateurs..." />
                </div>
            ) : filteredAggregators.length === 0 ? (
                <EmptyState
                    title="Aucun agrégateur trouvé"
                    description={searchTerm ? "Aucun agrégateur ne correspond à votre recherche." : "Aucun agrégateur configuré."}
                    icon={<FiCreditCard size={48} className="text-gray-300" />}
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredAggregators.map((aggregator) => (
                        <AggregatorCard
                            key={aggregator.uid}
                            aggregator={aggregator}
                            onEdit={handleEdit}
                            onToggleStatus={handleToggleStatus}
                        />
                    ))}
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

