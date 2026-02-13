import React, { useState, useEffect } from 'react';
import { FiSave, FiX, FiUpload } from 'react-icons/fi';

const BannerForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        action_url: '#',
        is_active: true
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Log to debug if needed (user can see console)
        console.log("Submitting form data:", formData);
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                    placeholder="Titre de la promotion (optionnel)"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                    placeholder="Détails de l'offre (optionnel)"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de Redirection</label>
                <input
                    type="text"
                    value={formData.action_url}
                    onChange={(e) => setFormData({ ...formData, action_url: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                    placeholder="https://test.com ou /promotion"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 whitespace-nowrap">Image de la bannière</label>
                <div className="mt-1 flex flex-col gap-4">
                    {/* Preview Area */}
                    {(formData.image || formData.imagePreview) && (
                        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-100 border-2 border-slate-200 group">
                            <img
                                src={formData.imagePreview || formData.image}
                                alt="Preview"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <p className="text-white text-xs font-bold px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                                    Changer l'image
                                </p>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setFormData({
                                                ...formData,
                                                imageFile: file,
                                                imagePreview: reader.result
                                            });
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    )}

                    {!formData.image && !formData.imagePreview && (
                        <div className="relative group">
                            <div className="flex flex-col items-center justify-center w-full aspect-video rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-primary/50 transition-all cursor-pointer group">
                                <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-primary transition-colors">
                                    <FiUpload size={32} />
                                    <span className="text-sm font-bold">Cliquez pour uploader image</span>
                                    <span className="text-[10px] uppercase tracking-widest font-black opacity-60 italic">Ratio 16:9 recommandé</span>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    required={!initialData && !formData.imagePreview}
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setFormData({
                                                    ...formData,
                                                    imageFile: file,
                                                    imagePreview: reader.result
                                                });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <FiX /> Annuler
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50 transition-colors shadow-sm"
                >
                    <FiSave /> {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </form>
    );
};

export default BannerForm;
