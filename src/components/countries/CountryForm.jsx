import React, { useState, useEffect } from 'react';
import { FiSave, FiX } from 'react-icons/fi';

const CountryForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        currency: 'XOF', // Default or from data
        phone_prefix: '',
        phone_length: 10,
        flag: '',
        is_active: true
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...formData,
                ...initialData,
                // Handle possible naming variations from different endpoints
                phone_prefix: initialData.phone_prefix || initialData.phoneCode || '',
                is_active: initialData.is_active ?? initialData.isActive ?? true,
                phone_length: initialData.phone_length || 10
            });
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const submitData = {
            ...formData,
            phone_length: Number(formData.phone_length),
            is_active: Boolean(formData.is_active)
        };
        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Pays</label>
                <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                    placeholder="Ex: Bénin"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code ISO (2 lett.)</label>
                    <input
                        type="text"
                        required
                        maxLength={2}
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50 uppercase"
                        placeholder="Ex: BJ"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Indicatif (+225)</label>
                    <input
                        type="text"
                        required
                        value={formData.phone_prefix}
                        onChange={(e) => setFormData({ ...formData, phone_prefix: e.target.value })}
                        className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                        placeholder="Ex: 229"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Long. Numéro</label>
                    <input
                        type="number"
                        required
                        value={formData.phone_length}
                        onChange={(e) => setFormData({ ...formData, phone_length: e.target.value })}
                        className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                        placeholder="Ex: 10"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Devise (XOF)</label>
                    <input
                        type="text"
                        required
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value.toUpperCase() })}
                        className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50 uppercase"
                        placeholder="Ex: XOF"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">Pays Actif</span>
                </label>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL du Drapeau (Optionnel)</label>
                <input
                    type="url"
                    value={formData.flag}
                    onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                    placeholder="https://flagcdn.com/w80/bj.png"
                />
            </div>

            {formData.flag && (
                <div className="mt-2 flex items-center justify-center p-4 border border-gray-200 rounded-xl bg-gray-50">
                    <img src={formData.flag} alt="Preview" className="h-16 object-contain" />
                </div>
            )}

            <div className="flex flex-wrap justify-end gap-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <FiX /> Annuler
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50 transition-all shadow-lg shadow-primary/30"
                >
                    <FiSave /> {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
            </div>
        </form>
    );
};

export default CountryForm;
