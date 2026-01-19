import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const FeeTable = ({ configs, onEdit, onDelete, onToggleStatus }) => {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">Réseau / Cible</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">Tranche (Min - Max)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">Frais</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">Statut</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {configs.map((config) => {
                            // Helper to get property regardless of case
                            const getProp = (k1, k2) => config[k1] !== undefined ? config[k1] : config[k2];

                            const id = getProp('id', 'uid');
                            const netName = config.networkName || config.network_name || (typeof config.network === 'object' ? config.network?.name : config.network) || 'Tous Réseaux';
                            const minAmt = getProp('minAmount', 'min_amount') || 0;
                            const maxAmt = getProp('maxAmount', 'max_amount');
                            const fixed = getProp('fixedFee', 'fixed_fee') || 0;
                            const pct = getProp('percentageFee', 'percentage_rate') || 0;
                            const active = getProp('isActive', 'is_active');
                            const isAllNetworks = netName === 'Tous Réseaux' || !config.network;

                            return (
                                <tr key={id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${isAllNetworks ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-blue-700'}`}>
                                            {netName}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {minAmt.toLocaleString()} - {maxAmt ? maxAmt.toLocaleString() : '∞'} FCFA
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {fixed > 0 && `${fixed} F`}
                                            {fixed > 0 && pct > 0 && ' + '}
                                            {pct > 0 && `${pct}%`}
                                            {fixed === 0 && pct === 0 && 'Gratuit'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => onToggleStatus(id)}
                                            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${active
                                                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                                            {active ? 'Actif' : 'Inactif'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(config)}
                                                className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                title="Modifier"
                                            >
                                                <FiEdit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(id)}
                                                className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                title="Supprimer"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FeeTable;
