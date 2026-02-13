import React, { useState, useEffect } from 'react';
import { FiPlus, FiGlobe, FiMap } from 'react-icons/fi';
import Modal from '../components/common/Modal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import CountryTable from '../components/countries/CountryTable';
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
        <div className="space-y-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Pays Supportés</h1>
                    <p className="text-[13px] text-slate-500 font-medium">Gérez les pays dans lesquels UniCash opère.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-[13px] font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-hover hover:scale-[1.02] transition-all"
                >
                    <FiPlus size={16} /> Ajouter un Pays
                </button>
            </div>

            {/* List */}
            {isLoading ? (
                <LoadingSpinner text="Chargement des pays..." />
            ) : countries.length === 0 ? (
                <EmptyState
                    title="Aucun pays configuré"
                    description="Ajoutez les pays pris en charge par UniCash."
                    icon={<FiMap size={32} />}
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
                <CountryTable
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
