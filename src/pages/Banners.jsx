import React, { useState, useEffect } from 'react';
import { FiPlus, FiImage, FiToggleRight } from 'react-icons/fi';
import BannerTable from '../components/banners/BannerTable';
import BannerForm from '../components/banners/BannerForm';
import { bannersAPI } from '../api/banners.api';

const Banners = () => {
    const [banners, setBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBanner, setCurrentBanner] = useState(null);

    const fetchBanners = async () => {
        setIsLoading(true);
        try {
            const response = await bannersAPI.getBanners();
            setBanners(response.data);
        } catch (error) {
            console.error("Error fetching banners:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleCreate = () => {
        setCurrentBanner(null);
        setIsModalOpen(true);
    };

    const handleEdit = (banner) => {
        setCurrentBanner(banner);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette bannière ?')) {
            await bannersAPI.deleteBanner(id);
            fetchBanners();
        }
    };

    const handleToggleStatus = async (id) => {
        await bannersAPI.toggleStatus(id);
        fetchBanners();
    };

    const handleSubmit = async (data) => {
        try {
            if (currentBanner) {
                await bannersAPI.updateBanner(currentBanner.id, data);
            } else {
                await bannersAPI.createBanner(data);
            }
            setIsModalOpen(false);
            fetchBanners();
        } catch (error) {
            console.error("Error saving banner:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Gestion des Bannières</h1>
                    <p className="text-sm text-gray-500">Gérez les images du carrousel d'accueil de l'application utilisateur.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-800 transition-colors"
                >
                    <FiPlus size={18} /> Nouvelle Bannière
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <FiImage size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Bannières</p>
                            <p className="text-xl font-bold text-gray-800">{banners.length}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600">
                            <FiToggleRight size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Actives</p>
                            <p className="text-xl font-bold text-gray-800">
                                {banners.filter(b => b.isActive).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="py-12 text-center text-gray-500">Chargement...</div>
            ) : (
                <BannerTable
                    banners={banners}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                />
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800">
                                {currentBanner ? 'Modifier la bannière' : 'Nouvelle bannière'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <FiPlus className="rotate-45" size={24} />
                            </button>
                        </div>
                        <BannerForm
                            initialData={currentBanner}
                            onSubmit={handleSubmit}
                            onCancel={() => setIsModalOpen(false)}
                            isLoading={isLoading} // reusing loading state for simplicity or add separate state
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Banners;
