import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const CountryTable = ({ countries, onEdit, onDelete, onToggleStatus }) => {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Pays</th>
                            <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Code / Indicatif</th>
                            <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Devise</th>
                            <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Statut</th>
                            <th className="px-4 py-3 text-right text-[11px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white/50">
                        {countries.map((country) => (
                            <tr key={country.uid} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-4 py-2.5 whitespace-nowrap">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-6 w-10 flex-shrink-0 overflow-hidden rounded shadow-sm border border-gray-100 bg-gray-50 flex items-center justify-center">
                                            {country.flag ? (
                                                <img src={country.flag} alt={country.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <img
                                                    src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                                                    alt={country.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="text-[13px] font-bold text-slate-900 leading-none">{country.name}</div>
                                    </div>
                                </td>
                                <td className="px-4 py-2.5 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-semibold text-slate-700 leading-none">{country.code}</span>
                                        <span className="text-[11px] text-slate-400 font-medium mt-1">{country.phoneCode}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-2.5 whitespace-nowrap text-[13px] font-medium text-slate-600">
                                    {country.currency}
                                </td>
                                <td className="px-4 py-2.5 whitespace-nowrap">
                                    <button
                                        onClick={() => onToggleStatus(country.uid)}
                                        className={`flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-black transition-colors ${country.is_active
                                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        <span className={`h-1.5 w-1.5 rounded-full ${country.is_active ? 'bg-emerald-600' : 'bg-gray-400'}`}></span>
                                        {country.is_active ? 'Actif' : 'Inactif'}
                                    </button>
                                </td>
                                <td className="px-4 py-2.5 text-right whitespace-nowrap">
                                    <div className="flex justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEdit(country)}
                                            className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                            title="Modifier"
                                        >
                                            <FiEdit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(country.uid)}
                                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
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
