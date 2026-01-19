import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const CountryTable = ({ countries, onEdit, onDelete, onToggleStatus }) => {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">Pays</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">Code / Indicatif</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">Devise</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">Statut</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {countries.map((country) => (
                            <tr key={country.uid} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-12 flex-shrink-0 overflow-hidden rounded shadow-sm border border-gray-100 bg-gray-50 flex items-center justify-center">
                                            {country.flag ? (
                                                <img src={country.flag} alt={country.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <img
                                                    src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                                                    alt={country.name}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.parentNode.textContent = country.code;
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div className="text-sm font-semibold text-gray-900">{country.name}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900">{country.code}</span>
                                        <span className="text-xs text-gray-500">{country.phoneCode}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {country.currency}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => onToggleStatus(country.uid)}
                                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${country.is_active
                                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        <span className={`h-1.5 w-1.5 rounded-full ${country.is_active ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                                        {country.is_active ? 'Actif' : 'Inactif'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(country)}
                                            className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                            title="Modifier"
                                        >
                                            <FiEdit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(country.uid)}
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
        </div>
    );
};

export default CountryTable;
