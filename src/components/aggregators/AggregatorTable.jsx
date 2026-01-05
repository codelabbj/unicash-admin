import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const AggregatorTable = ({ aggregators, onEdit, onDelete, onToggleStatus }) => {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Agrégateur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Statut</th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {aggregators.map((aggregator) => (
                        <tr key={aggregator.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-20 flex-shrink-0 overflow-hidden rounded border border-gray-100 bg-white p-1">
                                        <img src={aggregator.logo} alt="" className="h-full w-full object-contain" />
                                    </div>
                                    <div className="text-sm font-semibold text-gray-900">{aggregator.name}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <code className="rounded bg-gray-100 px-2 py-1 text-xs font-mono text-gray-600 uppercase">
                                    {aggregator.code}
                                </code>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                    onClick={() => onToggleStatus(aggregator.id)}
                                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${aggregator.isActive
                                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    <span className={`h-1.5 w-1.5 rounded-full ${aggregator.isActive ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                                    {aggregator.isActive ? 'Actif' : 'Inactif'}
                                </button>
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap text-sm font-medium">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => onEdit(aggregator)}
                                        className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                        title="Modifier"
                                    >
                                        <FiEdit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(aggregator.id)}
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

export default AggregatorTable;
