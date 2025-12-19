import React, { useState, useEffect } from 'react';
import { FiSave, FiX } from 'react-icons/fi';

const NetworkForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        country: '',
        logo: '',
        isActive: true
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du réseau</label>
                <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                    placeholder="Ex: MTN Bénin"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code Technique</label>
                    <input
                        type="text"
                        required
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50 uppercase"
                        placeholder="Ex: MTN_BJ"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pays (Code ISO)</label>
                    <input
                        type="text"
                        required
                        maxLength={2}
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value.toUpperCase() })}
                        className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50 uppercase"
                        placeholder="Ex: BJ"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL du Logo</label>
                <input
                    type="url"
                    required
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                    placeholder="https://..."
                />
            </div>

            {formData.logo && (
                <div className="mt-2 flex items-center justify-center p-4 border border-gray-200 rounded-xl bg-gray-50">
                    <img src={formData.logo} alt="Preview" className="h-16 object-contain" />
                </div>
            )}

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

export default NetworkForm;
