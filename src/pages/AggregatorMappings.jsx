import React, { useState, useEffect } from 'react';
import { FiLink, FiPlus, FiEdit2, FiTrash2, FiMapPin, FiWifi, FiCreditCard, FiSearch, FiFilter, FiX } from 'react-icons/fi';
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

    // Search and filters
    const [searchTerm, setSearchTerm] = useState('');
    const [networkFilter, setNetworkFilter] = useState('');
    const [aggregatorFilter, setAggregatorFilter] = useState('');
    const [countryFilter, setCountryFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const params = { page: currentPage };
            if (searchTerm.trim()) params.search = searchTerm.trim();
            if (networkFilter) params.network = networkFilter;
            if (aggregatorFilter) params.aggregator = aggregatorFilter;
            if (countryFilter) params.country = countryFilter;

            const [mappingsRes, aggregatorsRes, networksRes] = await Promise.all([
                aggregatorMappingsAPI.getMappings(params),
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
        const delaySearch = setTimeout(() => {
            fetchData();
        }, 500);
        return () => clearTimeout(delaySearch);
    }, [searchTerm, networkFilter, aggregatorFilter, countryFilter, currentPage]);

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

    const clearFilters = () => {
        setNetworkFilter('');
        setAggregatorFilter('');
        setCountryFilter('');
    };

    const hasActiveFilters = [networkFilter, aggregatorFilter, countryFilter].some(Boolean);

    return (
        <div className="space-y-6">
            {/* Header with Search */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <FiLink className="text-primary" />
                        Mappings Réseau-Agrégateur
                    </h1>
                    <p className="text-[13px] text-slate-500 font-medium">Associez les réseaux aux agrégateurs par pays.</p>
                </div>
                <div className="flex flex-col gap-3 w-full md:w-auto">
                    {/* Search and Filter Toggle */}
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1 md:w-64">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Rechercher un mapping..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2 text-[13px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white shadow-sm transition-all"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[13px] font-medium transition-all ${hasActiveFilters
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-gray-200 bg-white text-slate-600 hover:border-gray-300'
                                }`}
                        >
                            <FiFilter className="w-4 h-4" />
                            <span className="hidden sm:inline">Filtres</span>
                            {hasActiveFilters && (
                                <span className="flex items-center justify-center w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full">
                                    {[networkFilter, aggregatorFilter, countryFilter].filter(Boolean).length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary-hover hover:scale-[1.02] transition-all whitespace-nowrap"
                        >
                            <FiPlus size={18} /> <span className="hidden sm:inline">Nouveau</span>
                        </button>
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                            <select
                                value={networkFilter}
                                onChange={(e) => setNetworkFilter(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-[13px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option value="">Tous les réseaux</option>
                                {networks.map(n => (
                                    <option key={n.uid} value={n.uid}>{n.name}</option>
                                ))}
                            </select>

                            <select
                                value={aggregatorFilter}
                                onChange={(e) => setAggregatorFilter(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-[13px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option value="">Tous les agrégateurs</option>
                                {aggregators.map(a => (
                                    <option key={a.uid} value={a.uid}>{a.name}</option>
                                ))}
                            </select>

                            <select
                                value={countryFilter}
                                onChange={(e) => setCountryFilter(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-[13px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option value="">Tous les pays</option>
                                <option value="CI">Côte d'Ivoire</option>
                                <option value="SN">Sénégal</option>
                                <option value="ML">Mali</option>
                                <option value="BF">Burkina Faso</option>
                                <option value="TG">Togo</option>
                                <option value="BJ">Bénin</option>
                            </select>

                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1 px-3 py-2 text-[13px] text-slate-500 hover:text-slate-700 transition-colors"
                                >
                                    <FiX className="w-4 h-4" />
                                    Réinitialiser
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* List */}
            {isLoading ? (
                <LoadingSpinner text="Chargement des mappings..." />
            ) : mappings.length === 0 ? (
                <EmptyState
                    title="Aucun mapping trouvé"
                    description={searchTerm || hasActiveFilters ? "Aucun mapping ne correspond à vos critères." : "Créez des mappings pour lier les réseaux aux agrégateurs."}
                    icon={<FiLink size={32} />}
                    action={!searchTerm && !hasActiveFilters ? (
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-hover transition-colors"
                        >
                            <FiPlus size={18} /> Nouveau Mapping
                        </button>
                    ) : null}
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
                                                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm flex items-center justify-center p-0.5">
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
        country: mapping?.country || '10841a39-3fc9-4f0a-82e9-a491b63e4daf', // Fixed Côte d'Ivoire UID
        priority: mapping?.priority || 1,
        aggregator_network_code: mapping?.aggregator_network_code || '',
        payin_url: mapping?.payin_url || '',
        payout_url: mapping?.payout_url || '',
        status_check_url: mapping?.status_check_url || '',
        min_amount: mapping?.min_amount || '500.00',
        max_amount: mapping?.max_amount || '2000000.00',
        fixed_fee: mapping?.fixed_fee || '',
        payin_percentage_fee: mapping?.payin_percentage_fee || '',
        payout_percentage_fee: mapping?.payout_percentage_fee || ''
    });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!formData.network || !formData.aggregator) {
            setError('Veuillez sélectionner un réseau et un agrégateur.');
            return;
        }

        if (!formData.aggregator_network_code || !formData.payin_url || !formData.payout_url) {
            setError('Veuillez remplir tous les champs obligatoires (Code, URLs).');
            return;
        }

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

        // Clean values before submit (e.g. empty strings to null for optional fee)
        const submissionData = {
            ...formData,
            fixed_fee: formData.fixed_fee === '' ? null : formData.fixed_fee,
            payin_percentage_fee: formData.payin_percentage_fee === '' ? 0 : formData.payin_percentage_fee,
            payout_percentage_fee: formData.payout_percentage_fee === '' ? 0 : formData.payout_percentage_fee,
            priority: parseInt(formData.priority) || 1
        };

        onSubmit(submissionData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto px-1 pr-3 custom-scrollbar">
            {/* Error Message */}
            {error && (
                <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 sticky top-0 z-10">
                    <p className="text-sm font-bold text-rose-600">{error}</p>
                </div>
            )}

            {/* Basic Info Section */}
            <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Configuration de Base</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomSelect
                        label="Réseau"
                        value={formData.network}
                        options={[
                            { value: "", label: "Choisir un réseau" },
                            ...networks.map((network) => ({
                                value: network.uid,
                                label: `${network.name} (${network.code})`
                            }))
                        ]}
                        onChange={(value) => setFormData({ ...formData, network: value })}
                        icon={FiWifi}
                    />

                    <CustomSelect
                        label="Agrégateur"
                        value={formData.aggregator}
                        options={[
                            { value: "", label: "Choisir un agrégateur" },
                            ...aggregators.map((agg) => ({
                                value: agg.uid,
                                label: `${agg.name} (${agg.code})`
                            }))
                        ]}
                        onChange={(value) => setFormData({ ...formData, aggregator: value })}
                        icon={FiCreditCard}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-2">Code Réseau Agrégateur *</label>
                        <input
                            type="text"
                            required
                            placeholder="ex: wave-ci, mtn-bj"
                            value={formData.aggregator_network_code}
                            onChange={(e) => setFormData({ ...formData, aggregator_network_code: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-2">Priorité</label>
                        <input
                            type="number"
                            min="1"
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* URLs Section */}
            <div className="space-y-4 pt-2">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Endpoints API</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-2">Payin URL *</label>
                        <input
                            type="url"
                            required
                            placeholder="https://api.aggregator.com/payin"
                            value={formData.payin_url}
                            onChange={(e) => setFormData({ ...formData, payin_url: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[13px] font-medium focus:border-primary outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-2">Payout URL *</label>
                        <input
                            type="url"
                            required
                            placeholder="https://api.aggregator.com/payout"
                            value={formData.payout_url}
                            onChange={(e) => setFormData({ ...formData, payout_url: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[13px] font-medium focus:border-primary outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-2">Status Check URL</label>
                        <input
                            type="url"
                            placeholder="https://api.aggregator.com/status"
                            value={formData.status_check_url}
                            onChange={(e) => setFormData({ ...formData, status_check_url: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[13px] font-medium focus:border-primary outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Financial Parameters Section */}
            <div className="space-y-4 pt-2">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Paramètres Financiers</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-2">Montant Min</label>
                        <input
                            type="text"
                            placeholder="500.00"
                            value={formData.min_amount}
                            onChange={(e) => setFormData({ ...formData, min_amount: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-primary outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-2">Montant Max</label>
                        <input
                            type="text"
                            placeholder="2000000.00"
                            value={formData.max_amount}
                            onChange={(e) => setFormData({ ...formData, max_amount: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-primary outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-2">Frais Fixe (Optionnel)</label>
                        <input
                            type="text"
                            placeholder="ex: 0"
                            value={formData.fixed_fee}
                            onChange={(e) => setFormData({ ...formData, fixed_fee: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-primary outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-2">Commission Payin (%)</label>
                        <input
                            type="text"
                            placeholder="1.9"
                            value={formData.payin_percentage_fee}
                            onChange={(e) => setFormData({ ...formData, payin_percentage_fee: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-primary outline-none transition-all text-blue-600"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-2">Commission Payout (%)</label>
                        <input
                            type="text"
                            placeholder="1.2"
                            value={formData.payout_percentage_fee}
                            onChange={(e) => setFormData({ ...formData, payout_percentage_fee: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-primary outline-none transition-all text-emerald-600"
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 sticky bottom-0 bg-white pb-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    className="px-8 py-3 bg-primary text-white text-sm font-black rounded-2xl hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/25 transition-all active:scale-[0.98]"
                >
                    {mapping ? 'Mettre à jour' : 'Créer le mapping'}
                </button>
            </div>
        </form>
    );
};

export default AggregatorMappings;
