import React from 'react';
import { FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiEye } from 'react-icons/fi';

const BannerTable = ({ banners, onEdit, onDelete, onToggleStatus }) => {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Aperçu</th>
                            <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Contenu</th>
                            <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Statut</th>
                            <th className="px-4 py-3 text-right text-[11px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white/50">
                        {banners.map((banner) => (
                            <tr key={banner.id} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-4 py-2.5 whitespace-nowrap">
                                    <div className="h-10 w-16 overflow-hidden rounded-lg border border-gray-200">
                                        <img src={banner.image} alt="" className="h-full w-full object-cover" />
                                    </div>
                                </td>
                                <td className="px-4 py-2.5 min-w-[300px]">
                                    <div className="text-[13px] font-bold text-slate-900 leading-none">{banner.title}</div>
                                    <div className="text-[11px] text-slate-400 font-medium mt-1 line-clamp-1">{banner.description}</div>
                                </td>
                                <td className="px-4 py-2.5 whitespace-nowrap">
                                    <button
                                        onClick={() => onToggleStatus(banner.id)}
                                        className={`flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-black transition-colors ${banner.is_active
                                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                            }`}
                                    >
                                        <span className={`h-1.5 w-1.5 rounded-full ${banner.is_active ? 'bg-emerald-600' : 'bg-gray-400'}`}></span>
                                        {banner.is_active ? 'Actif' : 'Inactif'}
                                    </button>
                                </td>
                                <td className="px-4 py-2.5 text-right whitespace-nowrap">
                                    <div className="flex justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEdit(banner)}
                                            className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                            title="Modifier"
                                        >
                                            <FiEdit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(banner.id)}
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

export default BannerTable;
