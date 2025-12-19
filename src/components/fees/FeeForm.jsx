import React, { useState, useEffect } from 'react';
import { FiSave, FiX } from 'react-icons/fi';
import { networksAPI } from '../../api/networks.api'; // To populate network dropdown

const FeeForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState({
        networkId: '',
        minAmount: 0,
        maxAmount: '',
        fixedFee: 0,
        percentageFee: 0,
        isActive: true
    });
    const [networks, setNetworks] = useState([]);

    useEffect(() => {
        // Fetch networks for dropdown
        networksAPI.getNetworks().then(res => setNetworks(res.data));
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                networkId: initialData.networkId || '',
                maxAmount: initialData.maxAmount || ''
            });
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Convert empty strings to null or numbers
        const submitData = {
            ...formData,
            networkId: formData.networkId ? Number(formData.networkId) : null,
            minAmount: Number(formData.minAmount),
            maxAmount: formData.maxAmount ? Number(formData.maxAmount) : null,
            fixedFee: Number(formData.fixedFee),
            percentageFee: Number(formData.percentageFee)
        };
        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Réseau concerné</label>
                <select
                    value={formData.networkId}
                    onChange={(e) => setFormData({ ...formData, networkId: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                >
                    <option value="">Tous les réseaux (Défaut)</option>
                    {networks.map(n => (
                        <option key={n.id} value={n.id}>{n.name} ({n.country})</option>
                    ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">Laissez vide pour appliquer à tous les réseaux par défaut.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Montant Min.</label>
                    <input
                        type="number"
                        min="0"
                        required
                        value={formData.minAmount}
                        onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                        className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Montant Max.</label>
                    <input
                        type="number"
                        min="0"
                        value={formData.maxAmount}
                        onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
                        placeholder="Pas de limite"
                        className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frais Fixes (FCFA)</label>
                    <input
                        type="number"
                        min="0"
                        required
                        value={formData.fixedFee}
                        onChange={(e) => setFormData({ ...formData, fixedFee: e.target.value })}
                        className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frais Variable (%)</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={formData.percentageFee}
                        onChange={(e) => setFormData({ ...formData, percentageFee: e.target.value })}
                        className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                    />
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

export default FeeForm;
