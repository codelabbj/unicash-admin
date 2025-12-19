import React, { useState, useEffect } from 'react';
import { FiPlus, FiGlobe } from 'react-icons/fi';
import CountryTable from '../components/countries/CountryTable';
import CountryForm from '../components/countries/CountryForm';
import { countriesAPI } from '../api/countries.api';

const Countries = () => {
    const [countries, setCountries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCountry, setCurrentCountry] = useState(null);

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

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce pays ?')) {
            await countriesAPI.deleteCountry(id);
            fetchCountries();
        }
    };

    const handleToggleStatus = async (id) => {
        await countriesAPI.toggleStatus(id);
        fetchCountries();
    };

    const handleSubmit = async (data) => {
        try {
            if (currentCountry) {
                await countriesAPI.updateCountry(currentCountry.id, data);
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
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Pays Supportés</h1>
                    <p className="text-sm text-gray-500">Gérez les pays dans lesquels UniCash opère.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-hover transition-colors"
                >
                    <FiPlus size={18} /> Ajouter un Pays
                </button>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="py-12 text-center text-gray-500">Chargement...</div>
            ) : (
                <CountryTable
                    countries={countries}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                />
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-blue-50 text-primary">
                                    <FiGlobe />
                                </div>
                                {currentCountry ? 'Modifier le pays' : 'Nouveau pays'}
                            </h2>
                        </div>
                        <CountryForm
                            initialData={currentCountry}
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

export default Countries;
