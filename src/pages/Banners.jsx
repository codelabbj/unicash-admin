import React, { useState, useEffect } from 'react';
import { FiPlus, FiImage, FiToggleRight } from 'react-icons/fi';
import Modal from '../components/common/Modal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import BannerTable from '../components/banners/BannerTable';
import BannerForm from '../components/banners/BannerForm';
import EmptyState from '../components/common/EmptyState';
import PhoneMockup from '../components/common/PhoneMockup';
import { bannersAPI } from '../api/banners.api';

const Banners = () => {
    const [banners, setBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBanner, setCurrentBanner] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState(null);

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

    const handleDelete = (id) => {
        setBannerToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (bannerToDelete) {
            try {
                await bannersAPI.deleteBanner(bannerToDelete);
                fetchBanners();
                setIsDeleteModalOpen(false);
                setBannerToDelete(null);
            } catch (error) {
                console.error("Error deleting banner:", error);
            }
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

            {/* List & Preview */}
            {isLoading ? (
                <div className="py-12 text-center text-gray-500">Chargement...</div>
            ) : banners.length === 0 ? (
                <EmptyState
                    title="Aucune bannière active"
                    description="Commencez par ajouter une bannière pour animer l'accueil de l'application."
                    icon={<FiImage size={32} />}
                    action={
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-800 transition-colors"
                        >
                            <FiPlus size={18} /> Créer ma première bannière
                        </button>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Table List */}
                    <div className="lg:col-span-2 space-y-4">
                        <BannerTable
                            banners={banners}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onToggleStatus={handleToggleStatus}
                        />
                    </div>

                    {/* Live Mobile Preview */}
                    <div className="hidden lg:block">
                        <div className="sticky top-6">
                            <h3 className="text-sm font-medium text-gray-500 mb-4 text-center">Aperçu Live App</h3>
                            <PhoneMockup>
                                {/* Simulated App Header */}
                                <div className="bg-blue-900 h-16 p-4 flex items-center justify-between text-white">
                                    <div className="w-8 h-8 rounded-full bg-blue-800"></div>
                                    <div className="font-bold">UniCash</div>
                                    <div className="w-6 h-6"></div>
                                </div>
                                <div className="p-4 space-y-4">
                                    {/* Carousel Simulation */}
                                    <div className="aspect-video w-full rounded-xl bg-gray-200 overflow-hidden relative shadow-sm group">
                                        {banners.filter(b => b.isActive).length > 0 ? (
                                            <>
                                                <img
                                                    src={banners.filter(b => b.isActive)[0].image}
                                                    className="w-full h-full object-cover"
                                                    alt="Preview"
                                                />
                                                <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-1">
                                                    {banners.filter(b => b.isActive).map((_, i) => (
                                                        <div key={i} className={`h-1.5 rounded-full ${i === 0 ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`} />
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                Aucune bannière active
                                            </div>
                                        )}
                                    </div>

                                    {/* Dummy App Content */}
                                    <div className="grid grid-cols-4 gap-2">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="aspect-square rounded-xl bg-gray-100 flex flex-col items-center justify-center gap-1">
                                                <div className="w-8 h-8 rounded-full bg-white"></div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="h-24 rounded-xl bg-gray-100"></div>
                                </div>
                            </PhoneMockup>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentBanner ? 'Modifier la bannière' : 'Nouvelle bannière'}
            >
                <BannerForm
                    initialData={currentBanner}
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
                title="Supprimer la bannière"
                message="Êtes-vous sûr de vouloir supprimer cette bannière ? Elle ne sera plus visible sur l'application."
                confirmText="Supprimer"
                variant="danger"
            />
        </div>
    );
};

export default Banners;
