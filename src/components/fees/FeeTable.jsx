import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const FeeTable = ({ configs, onEdit, onDelete, onToggleStatus }) => {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Réseau / Cible</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tranche (Min - Max)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Frais</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Statut</th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {configs.map((config) => (
                        <tr key={config.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${config.networkName === 'Tous Réseaux' ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-blue-700'}`}>
                                    {config.networkName}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {config.minAmount.toLocaleString()} - {config.maxAmount ? config.maxAmount.toLocaleString() : '∞'} FCFA
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                    {config.fixedFee > 0 && `${config.fixedFee} F`}
                                    {config.fixedFee > 0 && config.percentageFee > 0 && ' + '}
                                    {config.percentageFee > 0 && `${config.percentageFee}%`}
                                    {config.fixedFee === 0 && config.percentageFee === 0 && 'Gratuit'}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                    onClick={() => onToggleStatus(config.id)}
                                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${config.isActive
                                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    <span className={`h-1.5 w-1.5 rounded-full ${config.isActive ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                                    {config.isActive ? 'Actif' : 'Inactif'}
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
                                        onClick={() => onDelete(config.id)}
                                        className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                        title="Supprimer"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FeeTable;
