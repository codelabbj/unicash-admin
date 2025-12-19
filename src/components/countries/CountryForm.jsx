import React, { useState, useEffect } from 'react';
import { FiSave, FiX } from 'react-icons/fi';

const CountryForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        currency: '',
        phoneCode: '',
        flag: '',
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code ISO</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Indicatif Tél.</label>
                    <input
                        type="text"
                        required
                        value={formData.phoneCode}
                        onChange={(e) => setFormData({ ...formData, phoneCode: e.target.value })}
                        className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                        placeholder="Ex: +229"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
                <input
                    type="text"
                    required
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value.toUpperCase() })}
                    className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50 uppercase"
                    placeholder="Ex: XOF"
                />
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
                <p className="mt-1 text-xs text-gray-500">Si laissé vide, le drapeau sera généré automatiquement à partir du code pays.</p>
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

export default CountryForm;
