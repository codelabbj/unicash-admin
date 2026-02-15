import React, { useState, useEffect } from 'react';
import { FiLink, FiPlus, FiEdit2, FiTrash2, FiMapPin, FiWifi, FiCreditCard } from 'react-icons/fi';
import Modal from '../components/common/Modal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import CustomSelect from '../components/common/CustomSelect';
import { aggregatorMappingsAPI } from '../api/aggregatorMappings.api';
import { aggregatorsAPI } from '../api/aggregators.api';
import { networksAPI } from '../api/networks.api';

const AggregatorMappings = () => {
    const [mappings, setMappings] = useState([]);
    const [aggregators, setAggregators] = useState([]);
    const [networks, setNetworks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMapping, setCurrentMapping] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [mappingToDelete, setMappingToDelete] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    const itemsPerPage = 10;

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [mappingsRes, aggregatorsRes, networksRes] = await Promise.all([
                aggregatorMappingsAPI.getMappings({ page: currentPage }),
                aggregatorsAPI.getAggregators(),
                networksAPI.getNetworks()
            ]);
            setMappings(mappingsRes.data);
            setTotalCount(mappingsRes.count ?? mappingsRes.data.length);
            setHasNext(!!mappingsRes.next);
            setHasPrevious(!!mappingsRes.previous);
            setAggregators(aggregatorsRes.data);
            setNetworks(networksRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    const handleCreate = () => {
        setCurrentMapping(null);
        setIsModalOpen(true);
    };

    const handleEdit = (mapping) => {
        setCurrentMapping(mapping);
        setIsModalOpen(true);
    };

    const handleDelete = (uid) => {
        setMappingToDelete(uid);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (mappingToDelete) {
            try {
                await aggregatorMappingsAPI.deleteMapping(mappingToDelete);
                fetchData();
                setIsDeleteModalOpen(false);
                setMappingToDelete(null);
            } catch (error) {
                console.error("Error deleting mapping:", error);
            }
        }
    };

    const handleSubmit = async (data) => {
        try {
            if (currentMapping) {
                await aggregatorMappingsAPI.updateMapping(currentMapping.uid, data);
            } else {
                await aggregatorMappingsAPI.createMapping(data);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            console.error("Error saving mapping:", error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Mappings Agrégateurs</h1>
                    <p className="text-sm text-slate-500 font-medium">Associez les réseaux aux agrégateurs de paiement.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary-hover hover:scale-[1.02] transition-all"
                >
                    <FiPlus size={20} /> Nouveau Mapping
                </button>
            </div>

            {/* List */}
            {isLoading ? (
                <LoadingSpinner text="Chargement des mappings..." />
            ) : mappings.length === 0 ? (
                <EmptyState
                    title="Aucun mapping configuré"
                    description="Créez un nouveau mapping pour associer un réseau à un agrégateur."
                    icon={<FiLink size={32} />}
                    action={
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-hover transition-colors"
                        >
                            <FiPlus size={18} /> Nouveau Mapping
                        </button>
                    }
                />
            ) : (
                <>
                    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">RÉSEAU</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">AGRÉGATEUR</th>
                                        <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">PAYS</th>
                                        <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-wider text-slate-400">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {mappings.map((mapping) => (
                                        <tr key={mapping.uid} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    {mapping.network_logo && (
                                                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm flex items-center justify-center p-1">
                                                            <img src={mapping.network_logo} alt="" className="h-full w-full object-contain" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">{mapping.network_name}</p>
                                                        <p className="text-xs text-slate-400">{mapping.network_code}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-sm font-bold text-slate-900">{mapping.aggregator_name}</p>
                                                <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary mt-1">
                                                    {mapping.aggregator_code}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <FiMapPin size={14} className="text-slate-400" />
                                                    <span className="text-sm font-medium text-slate-700">{mapping.country_name || 'Côte d\'Ivoire'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <div className="flex justify-end gap-2 opacity-100">
                                                    <button
                                                        onClick={() => handleEdit(mapping)}
                                                        className="p-2 text-slate-400 hover:text-primary transition-colors"
                                                        title="Modifier"
                                                    >
                                                        <FiEdit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(mapping.uid)}
                                                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                                                        title="Supprimer"
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(totalCount / itemsPerPage)}
                        totalItems={totalCount}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        hasNext={hasNext}
                        hasPrevious={hasPrevious}
                    />
                </>
            )}

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentMapping ? 'Modifier le mapping' : 'Nouveau mapping'}
                icon={<FiLink />}
            >
                <MappingForm
                    mapping={currentMapping}
                    aggregators={aggregators}
                    networks={networks}
                    allMappings={mappings}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Supprimer le mapping"
                message="Êtes-vous sûr de vouloir supprimer ce mapping ? Cette action est irréversible et pourrait affecter les transactions associées."
                confirmText="Supprimer"
                variant="danger"
            />
        </div>
    );
};

// Mapping Form Component
const MappingForm = ({ mapping, aggregators, networks, onSubmit, onCancel, allMappings = [] }) => {
    const [formData, setFormData] = useState({
        network: mapping?.network || '',
        aggregator: mapping?.aggregator || '',
        country: '10841a39-3fc9-4f0a-82e9-a491b63e4daf' // Fixed Côte d'Ivoire UID
    });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Check for duplicate combination (excluding current mapping)
        const isDuplicate = allMappings.some(m => 
            m.uid !== mapping?.uid &&
            m.network === formData.network &&
            m.aggregator === formData.aggregator &&
            m.country === formData.country
        );

        if (isDuplicate) {
            setError('Cette combinaison réseau + agrégateur + pays existe déjà.');
            return;
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-4">
                    <p className="text-sm font-bold text-rose-600">{error}</p>
                </div>
            )}

            {/* Network Selection */}
            <CustomSelect
                label="Réseau"
                value={formData.network}
                options={networks.map((network) => ({
                    value: network.uid,
                    label: `${network.name} (${network.code})`
                }))}
                onChange={(value) => setFormData({ ...formData, network: value })}
                icon={FiWifi}
            />

            {/* Aggregator Selection */}
            <CustomSelect
                label="Agrégateur"
                value={formData.aggregator}
                options={aggregators.map((agg) => ({
                    value: agg.uid,
                    label: `${agg.name} (${agg.code})`
                }))}
                onChange={(value) => setFormData({ ...formData, aggregator: value })}
                icon={FiCreditCard}
            />

            {/* Country - Disabled, Fixed to Côte d'Ivoire */}
            <div>
                <label className="block text-sm font-bold text-slate-500 mb-2">Pays</label>
                <div className="relative">
                    <input
                        type="text"
                        value="Côte d'Ivoire"
                        disabled
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-slate-500 cursor-not-allowed"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <span className="text-xs font-bold text-slate-400 bg-gray-200 px-2 py-1 rounded">Fixé</span>
                    </div>
                </div>
                <p className="mt-1.5 text-xs text-slate-400">Le pays est fixé à la Côte d'Ivoire et ne peut pas être modifié.</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25 transition-all active:scale-95"
                >
                    {mapping ? 'Mettre à jour' : 'Créer'}
                </button>
            </div>
        </form>
    );
};

export default AggregatorMappings;
