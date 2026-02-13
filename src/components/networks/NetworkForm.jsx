import React, { useState, useEffect } from 'react';
import { FiSave, FiX } from 'react-icons/fi';
import GlassSelect from '../common/GlassSelect';

const NetworkForm = ({ initialData, countries = [], onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        country: '',
        logo_url: '',
        description: '',
        min_transfer_amount: 500,
        max_transfer_amount: 500000,
        daily_limit: 1000000,
        can_send_money: true,
        can_receive_money: true,
        is_active: true
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...formData,
                ...initialData,
                // Ensure field naming continuity if backend uses logo instead of logo_url etc.
                logo_url: initialData.logo_url || initialData.logo || ''
            });
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Ensure numeric fields are numbers
        const submitData = {
            ...formData,
            min_transfer_amount: Number(formData.min_transfer_amount),
            max_transfer_amount: Number(formData.max_transfer_amount),
            daily_limit: Number(formData.daily_limit)
        };
        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                <GlassSelect
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    options={[
                        { value: "", label: "Sélectionner un pays" },
                        ...countries.map(c => ({ value: c.uid, label: `${c.name} (${c.code})` }))
                    ]}
                    placeholder="Sélectionner un pays"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                    placeholder="Description du réseau..."
                    rows={2}
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min (FCFA)</label>
                    <input
                        type="number"
                        value={formData.min_transfer_amount}
                        onChange={(e) => setFormData({ ...formData, min_transfer_amount: e.target.value })}
                        className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max (FCFA)</label>
                    <input
                        type="number"
                        value={formData.max_transfer_amount}
                        onChange={(e) => setFormData({ ...formData, max_transfer_amount: e.target.value })}
                        className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Limite Jour</label>
                    <input
                        type="number"
                        value={formData.daily_limit}
                        onChange={(e) => setFormData({ ...formData, daily_limit: e.target.value })}
                        className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                    />
                </div>
            </div>

            <div className="flex gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.can_send_money}
                        onChange={(e) => setFormData({ ...formData, can_send_money: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-600">Envoi</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.can_receive_money}
                        onChange={(e) => setFormData({ ...formData, can_receive_money: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-600">Réception</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-600">Actif</span>
                </label>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL du Logo</label>
                <input
                    type="url"
                    required
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                    placeholder="https://..."
                />
            </div>

            {formData.logo_url && (
                <div className="mt-2 flex items-center justify-center p-4 border border-gray-200 rounded-xl bg-gray-50">
                    <img src={formData.logo_url} alt="Preview" className="h-16 object-contain" />
                </div>
            )}

            <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white pb-2 mt-4 border-t">
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
