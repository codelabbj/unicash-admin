import React, { useState } from 'react';
import { FiMoreVertical, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiExternalLink } from 'react-icons/fi';

const BannerCard = ({ banner, onEdit, onDelete, onToggleStatus }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md hover:border-blue-100 overflow-hidden">
            {/* Image Preview - Aspect Ratio 16:9 */}
            <div className="relative aspect-video w-full bg-gray-100 overflow-hidden">
                <img
                    src={banner.image}
                    alt={banner.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Status Badge Over Image */}
                <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold shadow-sm backdrop-blur-md ${banner.is_active
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-gray-800/80 text-white'
                        }`}>
                        {banner.is_active ? 'ACTIF' : 'INACTIF'}
                    </span>
                </div>

                {/* Menu Button Over Image */}
                <div className="absolute top-3 right-3">
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                        onBlur={() => setTimeout(() => setShowMenu(false), 200)}
                        className="rounded-full bg-white/90 p-1.5 text-gray-600 shadow-sm hover:bg-white hover:text-blue-600 transition-all backdrop-blur-sm"
                    >
                        <FiMoreVertical size={18} />
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <div className="absolute right-0 top-8 z-10 w-40 rounded-xl border border-gray-100 bg-white shadow-lg p-1.5 flex flex-col gap-0.5">
                            <button
                                onClick={() => onEdit(banner)}
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
                            >
                                <FiEdit2 size={16} /> Modifier
                            </button>
                            <button
                                onClick={() => onToggleStatus(banner)}
                                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors text-left ${banner.is_active ? 'text-orange-600 hover:bg-orange-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                            >
                                {banner.is_active ? <FiToggleLeft size={16} /> : <FiToggleRight size={16} />}
                                {banner.is_active ? 'Désactiver' : 'Activer'}
                            </button>
                            <div className="h-px bg-gray-100 my-1"></div>
                            <button
                                onClick={() => onDelete(banner.id)}
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                            >
                                <FiTrash2 size={16} /> Supprimer
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-5">
                <h3 className="text-lg font-bold text-slate-900 leading-tight line-clamp-1" title={banner.title}>{banner.title}</h3>
                <p className="text-sm text-slate-500 font-medium mt-1 line-clamp-2 min-h-[40px]" title={banner.description}>{banner.description}</p>

                {/* Footer Info */}
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium overflow-hidden">
                        <FiExternalLink size={14} />
                        <span className="truncate max-w-[150px]">{banner.action_url}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BannerCard;
