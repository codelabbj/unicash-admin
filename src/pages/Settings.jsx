import React, { useState, useEffect } from 'react';
import { FiSave, FiSettings, FiBriefcase, FiGlobe, FiLock } from 'react-icons/fi';
import SettingInput from '../components/settings/SettingInput';

const Settings = () => {
    // Initial data - normally fetched from API
    const initialData = {
        companyName: 'UniCash',
        supportEmail: 'support@unicash.com',
        platformStatus: 'active',
        maintenanceMode: false,
        minTransferAmount: '100',
        maxTransferAmount: '1000000',
        defaultCurrency: 'XOF'
    };

    const [settings, setSettings] = useState(initialData);
    const [initialSettings, setInitialSettings] = useState(initialData);
    const [editingFields, setEditingFields] = useState({});
    const [isDirty, setIsDirty] = useState(false);

    // Check for changes
    useEffect(() => {
        const hasChanges = JSON.stringify(settings) !== JSON.stringify(initialSettings);
        setIsDirty(hasChanges);
    }, [settings, initialSettings]);

    const handleEditClick = (field) => {
        setEditingFields(prev => ({ ...prev, [field]: true }));
    };

    const handleChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        setInitialSettings(settings);
        setEditingFields({});
        alert("Paramètres enregistrés avec succès !");
    };

    const handleCancel = () => {
        setSettings(initialSettings);
        setEditingFields({});
    };

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Paramètres Généraux</h1>
                <p className="text-sm text-gray-500">Configurez les réglages globaux de la plateforme UniCash.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Informations de l'Entreprise */}
                <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3 border-b border-gray-50 pb-4">
                        <div className="rounded-lg bg-blue-50 p-2 text-primary">
                            <FiBriefcase size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">Informations Plateforme</h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <SettingInput
                            label="Nom de la Plateforme"
                            name="companyName"
                            value={settings.companyName}
                            onChange={handleChange}
                            isEditing={editingFields.companyName}
                            onEditClick={handleEditClick}
                        />
                        <SettingInput
                            label="Email de Support"
                            name="supportEmail"
                            type="email"
                            value={settings.supportEmail}
                            onChange={handleChange}
                            isEditing={editingFields.supportEmail}
                            onEditClick={handleEditClick}
                        />
                    </div>
                </section>

                {/* Limites de Transactions */}
                <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3 border-b border-gray-50 pb-4">
                        <div className="rounded-lg bg-blue-50 p-2 text-primary">
                            <FiGlobe size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">Limites & Devise</h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <SettingInput
                            label="Devise Par Défaut"
                            name="defaultCurrency"
                            value={settings.defaultCurrency}
                            onChange={handleChange}
                            isEditing={editingFields.defaultCurrency}
                            onEditClick={handleEditClick}
                        />
                        <SettingInput
                            label="Montant Minimum"
                            name="minTransferAmount"
                            type="number"
                            value={settings.minTransferAmount}
                            onChange={handleChange}
                            isEditing={editingFields.minTransferAmount}
                            onEditClick={handleEditClick}
                        />
                        <SettingInput
                            label="Montant Maximum"
                            name="maxTransferAmount"
                            type="number"
                            value={settings.maxTransferAmount}
                            onChange={handleChange}
                            isEditing={editingFields.maxTransferAmount}
                            onEditClick={handleEditClick}
                        />
                    </div>
                </section>

                {/* Sécurité & Maintenance */}
                <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3 border-b border-gray-50 pb-4">
                        <div className="rounded-lg bg-red-50 p-2 text-red-600">
                            <FiLock size={20} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">Système & Maintenance</h2>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">Mode Maintenance</h3>
                                <p className="text-xs text-gray-500">Désactiver l'accès public à la plateforme pour maintenance.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    handleChange('maintenanceMode', !settings.maintenanceMode);
                                    // Normally toggle doesn't need "edit mode", it just changes value
                                }}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings.maintenanceMode ? 'bg-primary' : 'bg-gray-200'}`}
                            >
                                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.maintenanceMode ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Save Actions */}
                {isDirty && (
                    <div className="fixed bottom-6 right-6 flex items-center gap-4 rounded-xl bg-white p-4 shadow-2xl border border-gray-100 animate-in slide-in-from-bottom-5">
                        <span className="text-sm text-gray-500 hidden sm:inline">Des modifications non enregistrées</span>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2 text-sm font-bold text-white shadow-lg hover:bg-primary-hover transition-all transform active:scale-95"
                        >
                            <FiSave /> Enregistrer
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Settings;

