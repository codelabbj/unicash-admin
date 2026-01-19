import React from 'react';
import { FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiEye } from 'react-icons/fi';

const BannerTable = ({ banners, onEdit, onDelete, onToggleStatus }) => {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">Aperçu</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">Contenu</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">Statut</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {banners.map((banner) => (
                            <tr key={banner.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="h-16 w-24 overflow-hidden rounded-lg border border-gray-200">
                                        <img src={banner.image} alt="" className="h-full w-full object-cover" />
                                    </div>
                                </td>
                                <td className="px-6 py-4 min-w-[300px]">
                                    <div className="text-sm font-medium text-gray-900">{banner.title}</div>
                                    <div className="text-sm text-gray-500 line-clamp-1">{banner.description}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => onToggleStatus(banner.id)}
                                        className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${banner.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {banner.isActive ? (
                                            <>
                                                <span className="h-2 w-2 rounded-full bg-green-500"></span> Actif
                                            </>
                                        ) : (
                                            <>
                                                <span className="h-2 w-2 rounded-full bg-gray-500"></span> Inactif
                                            </>
                                        )}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(banner)}
                                            className="text-blue-600 hover:text-blue-900"
                                            title="Modifier"
                                        >
                                            <FiEdit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(banner.id)}
                                            className="text-red-600 hover:text-red-900"
                                            title="Supprimer"
                                        >
                                            <FiTrash2 size={18} />
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
