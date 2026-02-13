import React, { useState, useEffect } from 'react';
import { FiPlus, FiGlobe, FiSearch } from 'react-icons/fi';
import Modal from '../components/common/Modal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import CountryCard from '../components/countries/CountryCard';
import CountryForm from '../components/countries/CountryForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { countriesAPI } from '../api/countries.api';

const Countries = () => {
    const [countries, setCountries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCountry, setCurrentCountry] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [countryToDelete, setCountryToDelete] = useState(null);

    const fetchCountries = async () => {
        setIsLoading(true);
        try {
            const response = await countriesAPI.getCountries();
            setCountries(response.data);
        } catch (error) {
            console.error("Error fetching countries:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    const handleCreate = () => {
        setCurrentCountry(null);
        setIsModalOpen(true);
    };

    const handleEdit = (country) => {
        setCurrentCountry(country);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        setCountryToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (countryToDelete) {
            try {
                await countriesAPI.deleteCountry(countryToDelete);
                fetchCountries();
                setIsDeleteModalOpen(false);
                setCountryToDelete(null);
            } catch (error) {
                console.error("Error deleting country:", error);
            }
        }
    };

    const handleToggleStatus = async (id) => {
        await countriesAPI.toggleStatus(id);
        fetchCountries();
    };

    const handleSubmit = async (data) => {
        try {
            if (currentCountry) {
                await countriesAPI.updateCountry(currentCountry.uid, data);
            } else {
                await countriesAPI.createCountry(data);
            }
            setIsModalOpen(false);
            fetchCountries();
        } catch (error) {
            console.error("Error saving country:", error);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pays Supportés</h1>
                    <p className="text-slate-500 font-medium mt-1">Gérez la présence internationale et les paramètres monétaires d'UniCash.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary-hover hover:scale-[1.02] transition-all"
                >
                    <FiPlus size={18} /> Ajouter un Pays
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Rechercher un pays ou un code..."
                    className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-3.5 pl-12 text-sm font-medium shadow-sm transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
                    // Add state binding here if needed, or keeping it visual for now as per image request
                    // For full functionality we would bind this to a state
                    onChange={(e) => {
                        // Simple filtering logic could go here
                    }}
                />
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <LoadingSpinner text="Chargement des pays..." />
                </div>
            ) : countries.length === 0 ? (
                <EmptyState
                    title="Aucun pays configuré"
                    description="Ajoutez les pays pris en charge par UniCash."
                    icon={<FiGlobe size={32} />}
                    action={
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-hover transition-colors"
                        >
                            <FiPlus size={18} /> Ajouter un Pays
                        </button>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {countries.map((country) => (
                        <CountryCard
                            key={country.uid}
                            country={country}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onToggleStatus={handleToggleStatus}
                        />
                    ))}

                    {/* Add New Card */}
                    <button
                        onClick={handleCreate}
                        className="group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 transition-all hover:border-primary/50 hover:bg-blue-50/50 min-h-[220px]"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm transition-colors group-hover:text-primary">
                            <FiPlus size={24} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-sm font-bold text-slate-900">Ajouter un nouveau marché</h3>
                            <p className="mt-1 text-xs text-slate-500 font-medium">Configurez les passerelles<br />de paiement locales.</p>
                        </div>
                    </button>
                </div>
            )}

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentCountry ? 'Modifier le pays' : 'Nouveau pays'}
                icon={<FiGlobe />}
            >
                <CountryForm
                    initialData={currentCountry}
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
                title="Supprimer le pays"
                message="Êtes-vous sûr de vouloir supprimer ce pays ? Cette action est irréversible."
                confirmText="Supprimer"
                variant="danger"
            />
        </div>
    );
};

export default Countries;
