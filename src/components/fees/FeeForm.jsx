import React, { useState, useEffect } from 'react';
import { FiSave, FiX } from 'react-icons/fi';
import GlassSelect from '../common/GlassSelect';
import { networksAPI } from '../../api/networks.api'; // To populate network dropdown

const FeeForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState({
        network: '',
        min_amount: 0,
        max_amount: '',
        fixed_fee: 0,
        percentage_rate: 0,
        is_active: true
    });
    const [networks, setNetworks] = useState([]);

    useEffect(() => {
        // Fetch networks for dropdown
        networksAPI.getNetworks().then(res => setNetworks(res.data));
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...formData,
                ...initialData,
                // Handle mapping from camelCase if necessary
                network: initialData.network || initialData.networkId || '',
                max_amount: initialData.max_amount || initialData.maxAmount || '',
                min_amount: initialData.min_amount || initialData.minAmount || 0,
                fixed_fee: initialData.fixed_fee || initialData.fixedFee || 0,
                percentage_rate: initialData.percentage_rate || initialData.percentageFee || 0,
                is_active: initialData.is_active ?? initialData.isActive ?? true
            });
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Convert to numbers for API
        const submitData = {
            ...formData,
            network: formData.network || null,
            min_amount: Number(formData.min_amount),
            max_amount: formData.max_amount ? Number(formData.max_amount) : null,
            fixed_fee: Number(formData.fixed_fee),
            percentage_rate: Number(formData.percentage_rate)
        };
        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Réseau concerné</label>
                <GlassSelect
                    value={formData.network}
                    onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                    options={[
                        { value: "", label: "Tous les réseaux (Défaut)" },
                        ...networks.map(n => ({ value: n.uid, label: `${n.name} (${n.country_name || n.country})` }))
                    ]}
                    placeholder="Tous les réseaux (Défaut)"
                />
                <p className="mt-1 text-xs text-gray-500">Laissez vide pour appliquer à tous les réseaux par défaut.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Montant Min.</label>
                    <input
                        type="number"
                        min="0"
                        required
                        value={formData.min_amount}
                        onChange={(e) => setFormData({ ...formData, min_amount: e.target.value })}
                        className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Montant Max.</label>
                    <input
                        type="number"
                        min="0"
                        value={formData.max_amount}
                        onChange={(e) => setFormData({ ...formData, max_amount: e.target.value })}
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
                        value={formData.fixed_fee}
                        onChange={(e) => setFormData({ ...formData, fixed_fee: e.target.value })}
                        className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Taux (%)</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={formData.percentage_rate}
                        onChange={(e) => setFormData({ ...formData, percentage_rate: e.target.value })}
                        className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
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
                    <span className="text-sm font-medium text-gray-700">Config Active</span>
                </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
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
