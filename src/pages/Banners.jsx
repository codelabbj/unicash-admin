import React, { useState, useEffect } from 'react';
import { FiPlus, FiImage, FiToggleRight } from 'react-icons/fi';
import Modal from '../components/common/Modal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import BannerCard from '../components/banners/BannerCard';
import BannerForm from '../components/banners/BannerForm';
import EmptyState from '../components/common/EmptyState';
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

    const handleToggleStatus = async (banner) => {
        try {
            await bannersAPI.toggleStatus(banner.id, banner.is_active);
            fetchBanners();
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };

    const handleSubmit = async (data) => {
        try {
            let payload;

            if (data.imageFile) {
                // If a new file is provided, use FormData
                payload = new FormData();
                payload.append('title', data.title || '');
                payload.append('description', data.description || '');
                payload.append('action_url', data.action_url || '');
                payload.append('is_active', String(data.is_active));
                payload.append('image', data.imageFile);
            } else {
                // If no new file, send JSON but remove 'image' related experimental fields
                // Backends often reject string URLs in file fields during PATCH
                const { image, imagePreview, imageFile, ...rest } = data;
                payload = rest;
            }

            if (currentBanner) {
                await bannersAPI.updateBanner(currentBanner.id, payload);
            } else {
                await bannersAPI.createBanner(payload);
            }
            setIsModalOpen(false);
            fetchBanners();
        } catch (error) {
            console.error("Error saving banner:", error);
            toast.error("Erreur lors de l'enregistrement de la bannière");
        }
    };


    const activeBanners = banners.filter(b => b.is_active).length;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestion des Bannières</h1>
                    <p className="text-slate-500 font-medium mt-1">Configurez les visuels promotionnels de votre application mobile.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary-hover hover:scale-[1.02] transition-all"
                >
                    <FiPlus size={18} /> Nouvelle Bannière
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Bannières</p>
                        <p className="text-4xl font-black text-slate-900 tracking-tight">{banners.length}</p>
                        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400">
                            <FiImage /> Aucun contenu créé pour le moment
                        </div>
                    </div>
                    <div className="absolute right-6 top-6 h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                        <FiImage size={24} />
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bannières Actives</p>
                        <p className="text-4xl font-black text-slate-900 tracking-tight">{activeBanners}</p>
                        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400">
                            <div className={`h-2 w-2 rounded-full ${activeBanners > 0 ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                            Visibilité actuelle sur l'application
                        </div>
                    </div>
                    <div className="absolute right-6 top-6 h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-primary">
                        <FiToggleRight size={24} />
                    </div>
                </div>
            </div>

            {/* Grid Layout */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="text-slate-400 animate-pulse">Chargement...</div>
                </div>
            ) : banners.length === 0 ? (
                <EmptyState
                    title="Aucune bannière active"
                    description="Commencez par ajouter du contenu visuel pour vos utilisateurs en créant votre première bannière publicitaire ou d'information."
                    icon={<FiImage size={48} />}
                    action={
                        <button
                            onClick={handleCreate}
                            className="mt-4 flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary-hover hover:scale-[1.05] transition-all"
                        >
                            <FiPlus size={18} /> Créer ma première bannière
                        </button>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {banners.map((banner) => (
                        <BannerCard
                            key={banner.id}
                            banner={banner}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onToggleStatus={handleToggleStatus}
                        />
                    ))}

                    {/* Add New Card */}
                    <button
                        onClick={handleCreate}
                        className="group flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 transition-all hover:border-primary/50 hover:bg-blue-50/50 min-h-[320px]"
                    >
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm transition-colors group-hover:text-primary group-hover:scale-110 duration-300">
                            <FiPlus size={32} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-slate-900">Nouvelle Bannière</h3>
                            <p className="mt-2 text-sm text-slate-500 font-medium">Ajouter un visuel promotionnel</p>
                        </div>
                    </button>
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
