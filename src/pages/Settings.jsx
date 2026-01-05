import React, { useState } from 'react';
import { FiSave, FiSettings, FiBriefcase, FiGlobe, FiLock } from 'react-icons/fi';

const Settings = () => {
    const [settings, setSettings] = useState({
        companyName: 'UniCash',
        supportEmail: 'support@unicash.com',
        platformStatus: 'active',
        maintenanceMode: false,
        minTransferAmount: '100',
        maxTransferAmount: '1000000',
        defaultCurrency: 'XOF'
    });

    const handleSave = (e) => {
        e.preventDefault();
        alert("Paramètres enregistrés avec succès !");
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
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Nom de la Plateforme</label>
                            <input
                                type="text"
                                value={settings.companyName}
                                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Email de Support</label>
                            <input
                                type="email"
                                value={settings.supportEmail}
                                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                            />
                        </div>
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
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Devise Par Défaut</label>
                            <input
                                type="text"
                                value={settings.defaultCurrency}
                                onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50 uppercase"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Montant Minimum</label>
                            <input
                                type="number"
                                value={settings.minTransferAmount}
                                onChange={(e) => setSettings({ ...settings, minTransferAmount: e.target.value })}
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Montant Maximum</label>
                            <input
                                type="number"
                                value={settings.maxTransferAmount}
                                onChange={(e) => setSettings({ ...settings, maxTransferAmount: e.target.value })}
                                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
                            />
                        </div>
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
                                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings.maintenanceMode ? 'bg-primary' : 'bg-gray-200'}`}
                            >
                                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.maintenanceMode ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-medium text-white shadow-lg hover:bg-primary-hover transition-all transform active:scale-95"
                    >
                        <FiSave /> Enregistrer les Paramètres
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;

