import React, { useState, useEffect } from 'react';
import { FiSave, FiX } from 'react-icons/fi';
import CustomSelect from '../common/CustomSelect';

const AggregatorForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        default_callback_url: '',
        is_active: true,
        config: {}
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                // Ensure config is an object
                config: initialData.config || {}
            });
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // For update, we only want to send name and is_active, but the API might accept the whole object.
        // It's safer to send the whole object with modified values, or just the modified values if the API supports PATCH properly.
        // The instruction says "only name and is_active can be modified".
        // Use spread to send everything but user can only change name and is_active.
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Show UID only in Edit mode */}
            {initialData && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID (UID)</label>
                    <input
                        type="text"
                        value={formData.uid || ''}
                        disabled
                        className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm bg-gray-100 text-gray-500 cursor-not-allowed font-mono"
                    />
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'Agrégateur</label>
                <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50 transition-all font-body"
                    placeholder="Ex: Fedapay"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code Unique</label>
                    <input
                        type="text"
                        required
                        value={formData.code || ''}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        disabled={!!initialData}
                        className={`mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all uppercase font-mono ${initialData ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-gray-50'}`}
                        placeholder="Ex: FEDAPAY"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <CustomSelect
                        value={formData.is_active ? 'active' : 'inactive'}
                        onChange={(value) => setFormData({ ...formData, is_active: value === 'active' })}
                        options={[
                            { value: 'active', label: 'Actif' },
                            { value: 'inactive', label: 'Inactif' }
                        ]}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    rows="2"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={!!initialData}
                    className={`mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all ${initialData ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-gray-50'}`}
                    placeholder="Description de l'agrégateur..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de Callback par défaut</label>
                <input
                    type="url"
                    value={formData.default_callback_url || ''}
                    onChange={(e) => setFormData({ ...formData, default_callback_url: e.target.value })}
                    disabled={!!initialData}
                    className={`mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all font-mono text-xs ${initialData ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-gray-50'}`}
                    placeholder="https://api.example.com/callback"
                />
            </div>

            {/* Config Section - Read Only for Edit */}
            {initialData && formData.config && Object.keys(formData.config).length > 0 && (
                <div className="border-t border-gray-100 pt-4 mt-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Configuration Technique</label>
                    <div className="grid grid-cols-1 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                        {Object.entries(formData.config).map(([key, value]) => (
                            <div key={key}>
                                <label className="block text-xs font-mono font-medium text-gray-500 mb-1 uppercase">{key}</label>
                                <input
                                    type="text"
                                    value={value || ''}
                                    disabled
                                    className="block w-full rounded-lg border border-gray-200 px-3 py-2 text-xs bg-white text-gray-600 font-mono cursor-not-allowed"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* JSON Config View for Debug/Admin if needed (optional, keeping minimal for now based on screenshot) */}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
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

export default AggregatorForm;
