import React, { useState, useEffect } from 'react';
import { FiPlus, FiWifi, FiSearch, FiFilter, FiX } from 'react-icons/fi';
import Modal from '../components/common/Modal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import NetworkTable from '../components/networks/NetworkTable';
import NetworkForm from '../components/networks/NetworkForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { networksAPI } from '../api/networks.api';
import { countriesAPI } from '../api/countries.api';

import NetworkStats from '../components/networks/NetworkStats';

const Networks = () => {
    const [networks, setNetworks] = useState([]);
    const [countries, setCountries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNetwork, setCurrentNetwork] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [networkToDelete, setNetworkToDelete] = useState(null);
    
    // Search and filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [countryFilter, setCountryFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const params = {};
            if (searchTerm.trim()) params.search = searchTerm.trim();
            if (statusFilter) params.is_active = statusFilter === 'active';
            if (countryFilter) params.country = countryFilter;
            
            const [networksRes, countriesRes] = await Promise.all([
                networksAPI.getNetworks(params),
                countriesAPI.getCountries()
            ]);
            setNetworks(networksRes.data);
            setCountries(countriesRes.data);
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
    }, [searchTerm, statusFilter, countryFilter]);

    const fetchNetworks = async () => {
        try {
            const params = {};
            if (searchTerm.trim()) params.search = searchTerm.trim();
            if (statusFilter) params.is_active = statusFilter === 'active';
            if (countryFilter) params.country = countryFilter;
            
            const response = await networksAPI.getNetworks(params);
            setNetworks(response.data);
        } catch (error) {
            console.error("Error fetching networks:", error);
        }
    };

    const handleCreate = () => {
        setCurrentNetwork(null);
        setIsModalOpen(true);
    };

    const handleEdit = (network) => {
        setCurrentNetwork(network);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        setNetworkToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (networkToDelete) {
            try {
                await networksAPI.deleteNetwork(networkToDelete);
                fetchNetworks();
                setIsDeleteModalOpen(false);
                setNetworkToDelete(null);
            } catch (error) {
                console.error("Error deleting network:", error);
            }
        }
    };

    const hasActiveFilters = statusFilter || countryFilter;

    const clearFilters = () => {
        setStatusFilter('');
        setCountryFilter('');
        setSearchTerm('');
    };

    const handleToggleStatus = async (id) => {
        const network = networks.find(n => n.uid === id);
        if (network) {
            await networksAPI.toggleStatus(id, network.is_active);
            fetchNetworks();
        }
    };

    const handleSubmit = async (data) => {
        try {
            if (currentNetwork) {
                await networksAPI.updateNetwork(currentNetwork.uid, data);
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
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gestion des Réseaux</h1>
                    <p className="text-sm text-slate-500 font-medium">Configurez et supervisez les opérateurs mobiles et leurs services.</p>
                </div>
                <div className="flex flex-col gap-3 w-full md:w-auto">
                    {/* Search and Filter Toggle */}
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1 md:w-64">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Rechercher un réseau..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2 text-[13px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white shadow-sm transition-all"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[13px] font-medium transition-all ${
                                hasActiveFilters 
                                    ? 'border-primary bg-primary/10 text-primary' 
                                    : 'border-gray-200 bg-white text-slate-600 hover:border-gray-300'
                            }`}
                        >
                            <FiFilter className="w-4 h-4" />
                            <span className="hidden sm:inline">Filtres</span>
                            {hasActiveFilters && (
                                <span className="flex items-center justify-center w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full">
                                    {[statusFilter, countryFilter].filter(Boolean).length}
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
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-[13px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option value="">Tous les statuts</option>
                                <option value="active">Actif</option>
                                <option value="inactive">Inactif</option>
                            </select>

                            <select
                                value={countryFilter}
                                onChange={(e) => setCountryFilter(e.target.value)}
                                className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-[13px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                                <option value="">Tous les pays</option>
                                {countries.map(country => (
                                    <option key={country.code} value={country.code}>
                                        {country.name}
                                    </option>
                                ))}
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

            <NetworkStats networks={networks} />

            {/* List */}
            {isLoading ? (
                <LoadingSpinner text="Chargement des réseaux..." />
            ) : networks.length === 0 ? (
                <EmptyState
                    title="Aucun réseau trouvé"
                    description={searchTerm || hasActiveFilters ? "Aucun réseau ne correspond à vos critères." : "Ajoutez les réseaux mobiles pris en charge par la plateforme."}
                    icon={<FiWifi size={32} />}
                    action={!searchTerm && !hasActiveFilters ? (
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-hover transition-colors"
                        >
                            <FiPlus size={18} /> Nouveau Réseau
                        </button>
                    ) : null}
                />
            ) : (
                <NetworkTable
                    networks={networks}
                    countries={countries}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                />
            )}

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentNetwork ? 'Modifier le réseau' : 'Nouveau réseau'}
                icon={<FiWifi />}
            >
                <NetworkForm
                    initialData={currentNetwork}
                    countries={countries}
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
                title="Supprimer le réseau"
                message="Êtes-vous sûr de vouloir supprimer ce réseau ? Cette action est irréversible et pourrait affecter les transactions associées."
                confirmText="Supprimer"
                variant="danger"
            />
        </div >
    );
};

export default Networks;
