import React, { useState, useEffect } from 'react';
import { FiPlus, FiImage, FiToggleRight, FiMove } from 'react-icons/fi';
import { toast } from 'react-toastify';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy
} from '@dnd-kit/sortable';
import Modal from '../components/common/Modal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import BannerCard from '../components/banners/BannerCard';
import BannerForm from '../components/banners/BannerForm';
import EmptyState from '../components/common/EmptyState';
import { bannersAPI } from '../api/banners.api';
import { formatErrorForDisplay } from '../utils/errorHandler';

const Banners = () => {
    const [banners, setBanners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBanner, setCurrentBanner] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px movement required before drag starts
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const fetchBanners = async () => {
        setIsLoading(true);
        try {
            const response = await bannersAPI.getBanners();
            // Sort by order initially if present
            const sortedBanners = response.data.sort((a, b) => (a.order || 0) - (b.order || 0));
            setBanners(sortedBanners);
        } catch (error) {
            toast.error(formatErrorForDisplay(error));
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
                toast.success('Bannière supprimée avec succès');
                fetchBanners();
                setIsDeleteModalOpen(false);
                setBannerToDelete(null);
            } catch (error) {
                toast.error(formatErrorForDisplay(error));
            }
        }
    };

    const handleToggleStatus = async (banner) => {
        try {
            await bannersAPI.toggleStatus(banner.id, banner.is_active);
            toast.success('Statut mis à jour');
            fetchBanners();
        } catch (error) {
            toast.error(formatErrorForDisplay(error));
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = banners.findIndex((item) => item.id === active.id);
            const newIndex = banners.findIndex((item) => item.id === over.id);

            const newBanners = arrayMove(banners, oldIndex, newIndex);
            setBanners(newBanners);

            // Update order in backend
            try {
                // We only need to update the order for the moved item and potentially others.
                // For simplicity and to ensure sync, we can update affected items or just the moved one if backend handles ripples.
                // Here we'll update the orders of ALL banners to match their new positions.
                const updates = newBanners.map((banner, index) => {
                    if (banner.order !== index) {
                        return bannersAPI.updateBanner(banner.id, { order: index });
                    }
                    return null;
                }).filter(Boolean);

                if (updates.length > 0) {
                    await Promise.all(updates);
                    toast.success('Ordre mis à jour');
                }
            } catch (error) {
                console.error("Error updating banner order:", error);
                toast.error("Erreur lors de la mise à jour de l'ordre");
                // Optional: revert local state on failure
                fetchBanners();
            }
        }
    };

    const handleSubmit = async (data) => {
        try {
            let payload;

            if (data.imageFile) {
                payload = new FormData();
                payload.append('title', data.title || '');
                payload.append('description', data.description || '');
                payload.append('action_url', data.action_url || '');
                payload.append('is_active', String(data.is_active));
                payload.append('image', data.imageFile);
                // If creating, set order to last
                if (!currentBanner) {
                    payload.append('order', String(banners.length));
                }
            } else {
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
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-primary rounded-[2rem] text-white shadow-xl shadow-primary/20">
                        <FiImage size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bannières Mobiles</h1>
                        <p className="text-[14px] text-slate-500 font-medium mt-1.5">Gérez le contenu promotionnel visible par vos utilisateurs.</p>
                    </div>
                </div>

                <button
                    onClick={handleCreate}
                    className="flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl hover:bg-primary hover:scale-[1.02] transition-all active:scale-95 group"
                >
                    <FiPlus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    NOUVELLE BANNIÈRE
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
                <div className="glass-card rounded-[2.5rem] p-8 relative overflow-hidden group border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/90">
                    <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 bg-primary"></div>
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Total Bannières</p>
                            <p className="text-4xl font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">{banners.length}</p>
                            <div className="mt-5 flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                <FiMove className="text-primary animate-pulse" /> Réorganisation active
                            </div>
                        </div>
                        <div className="p-5 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500 group-hover:scale-110">
                            <FiImage size={28} />
                        </div>
                    </div>
                </div>

                <div className="glass-card rounded-[2.5rem] p-8 relative overflow-hidden group border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/90">
                    <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 bg-emerald-500"></div>
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Visibles en ligne</p>
                            <p className="text-4xl font-black text-emerald-600 tracking-tight">{activeBanners}</p>
                            <div className="mt-5 flex items-center gap-2 text-[11px] font-black text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div> Flux de production actif
                            </div>
                        </div>
                        <div className="p-5 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform duration-500">
                            <FiToggleRight size={28} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Layout with Drag and Drop */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-white">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-slate-400 font-bold">Chargement des bannières...</p>
                </div>
            ) : banners.length === 0 ? (
                <EmptyState
                    title="Aucune bannière active"
                    description="Commencez par ajouter du contenu visuel pour vos utilisateurs en créant votre première bannière."
                    icon={<FiImage size={48} />}
                    action={
                        <button
                            onClick={handleCreate}
                            className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:scale-[1.05] transition-all"
                        >
                            <FiPlus size={18} /> Créer ma première bannière
                        </button>
                    }
                />
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={banners.map(b => b.id)}
                        strategy={rectSortingStrategy}
                    >
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
                                className="group flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 p-8 transition-all hover:border-blue-500/50 hover:bg-white hover:shadow-xl min-h-[320px]"
                            >
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400 shadow-inner transition-all group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:scale-110 duration-300">
                                    <FiPlus size={32} />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Nouvelle Bannière</h3>
                                    <p className="mt-2 text-sm text-slate-500 font-bold">Ajouter un visuel promotionnel</p>
                                </div>
                            </button>
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentBanner ? 'Modifier la bannière' : 'Nouvelle bannière'}
            >
                <div className="p-1">
                    <BannerForm
                        initialData={currentBanner}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsModalOpen(false)}
                        isLoading={isLoading}
                    />
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Supprimer la bannière"
                message="Êtes-vous sûr de vouloir supprimer cette bannière ? Elle ne sera plus visible sur l'application."
                confirmText="Supprimer définitivement"
                variant="danger"
            />
        </div>
    );
};

export default Banners;
