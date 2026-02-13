import React, { useState } from 'react';
import { FiMoreVertical, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const CountryCard = ({ country, onEdit, onDelete, onToggleStatus }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="group relative flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-blue-100">
            {/* Header: Flag & Menu */}
            <div className="flex items-start justify-between">
                <div className="h-10 w-16 overflow-hidden rounded-lg border border-gray-100 shadow-sm">
                    {country.flag ? (
                        <img src={country.flag} alt={country.name} className="h-full w-full object-cover" />
                    ) : (
                        <img
                            src={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png`}
                            alt={country.name}
                            className="h-full w-full object-cover"
                        />
                    )}
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        onBlur={() => setTimeout(() => setShowMenu(false), 200)}
                        className="rounded-full p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
                    >
                        <FiMoreVertical size={20} />
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <div className="absolute right-0 top-8 z-10 w-40 rounded-xl border border-gray-100 bg-white shadow-lg p-1.5 flex flex-col gap-0.5">
                            <button
                                onClick={() => onEdit(country)}
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
                            >
                                <FiEdit2 size={16} /> Modifier
                            </button>
                            <button
                                onClick={() => onToggleStatus(country.uid)}
                                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors text-left ${country.is_active ? 'text-orange-600 hover:bg-orange-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                            >
                                {country.is_active ? <FiToggleLeft size={16} /> : <FiToggleRight size={16} />}
                                {country.is_active ? 'Désactiver' : 'Activer'}
                            </button>
                            <div className="h-px bg-gray-100 my-1"></div>
                            <button
                                onClick={() => onDelete(country.uid)}
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                            >
                                <FiTrash2 size={16} /> Supprimer
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="mt-4">
                <h3 className="text-lg font-bold text-slate-900 leading-tight">{country.name}</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">Code: {country.phoneCode}</p>
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
                <div className="flex items-center gap-2 bg-indigo-50/50 px-2.5 py-1.5 rounded-lg">
                    <span className="text-xs font-bold text-indigo-900">{country.currency}</span>
                    <span className="text-[10px] font-medium text-indigo-400 uppercase">Devise</span>
                </div>

                <div className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${country.is_active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'}`}></span>
                    <span className={`text-xs font-bold ${country.is_active ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {country.is_active ? 'ACTIF' : 'INACTIF'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CountryCard;
