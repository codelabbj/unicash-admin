import React, { useState, useRef, useEffect } from 'react';
import { FiMoreVertical, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiExternalLink, FiGrid } from 'react-icons/fi';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const BannerCard = ({ banner, onEdit, onDelete, onToggleStatus }) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: banner.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 60 : undefined,
        opacity: isDragging ? 0.5 : 1,
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group relative flex flex-col rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:border-blue-100 ${showMenu ? 'z-50 shadow-xl border-blue-100' : 'z-10 hover:z-20'}`}
        >
            {/* Image Preview - Aspect Ratio 16:9 */}
            <div className="relative aspect-video w-full rounded-t-2xl bg-gray-100 overflow-hidden">
                <img
                    src={banner.image}
                    alt={banner.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Drag Handle Overlay */}
                <div
                    {...attributes}
                    {...listeners}
                    className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing"
                >
                    <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-white shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                        <FiGrid size={32} />
                    </div>
                </div>

                {/* Status Badge Over Image */}
                <div className="absolute top-3 left-3 pointer-events-none">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-black shadow-sm backdrop-blur-md border border-white/20 ${banner.is_active
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-slate-900/80 text-white'
                        }`}>
                        {banner.is_active ? 'ACTIF' : 'INACTIF'}
                    </span>
                </div>
            </div>

            {/* Menu Button - Placed outside the overflow-hidden container to prevent clipping */}
            <div className="absolute top-3 right-3" ref={menuRef}>
                <button
                    onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                    className={`rounded-full p-2 shadow-lg transition-all backdrop-blur-md active:scale-90 ${showMenu
                        ? 'bg-blue-600 text-white animate-in zoom-in-75 duration-200'
                        : 'bg-white/90 text-slate-600 hover:bg-white hover:text-blue-600'}`}
                >
                    <FiMoreVertical size={18} strokeWidth={3} />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                    <div className="absolute right-0 top-11 z-[60] w-48 rounded-[1.25rem] border border-slate-100 bg-white shadow-2xl p-1.5 flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
                        <button
                            onClick={() => { setShowMenu(false); onEdit(banner); }}
                            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all text-left"
                        >
                            <FiEdit2 size={16} />
                            Modifier
                        </button>
                        <button
                            onClick={() => { setShowMenu(false); onToggleStatus(banner); }}
                            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all text-left ${banner.is_active ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                        >
                            {banner.is_active ? <FiToggleLeft size={16} /> : <FiToggleRight size={16} />}
                            {banner.is_active ? 'Désactiver' : 'Activer'}
                        </button>
                        <div className="h-px bg-slate-50 my-1 mx-2"></div>
                        <button
                            onClick={() => { setShowMenu(false); onDelete(banner.id); }}
                            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all text-left"
                        >
                            <FiTrash2 size={16} />
                            Supprimer
                        </button>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-6 bg-white rounded-b-2xl">
                <h3 className="text-lg font-black text-slate-900 leading-tight line-clamp-1 group-hover:text-blue-600 transition-colors" title={banner.title}>
                    {banner.title}
                </h3>
                <p className="text-[13px] text-slate-500 font-medium mt-2 line-clamp-2 min-h-[40px] leading-relaxed" title={banner.description}>
                    {banner.description}
                </p>

                {/* Footer Info */}
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-bold overflow-hidden bg-slate-50 px-3 py-1.5 rounded-lg w-full">
                        <FiExternalLink size={14} className="shrink-0" />
                        <span className="truncate" title={banner.action_url}>
                            {banner.action_url || 'Pas de lien'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BannerCard;
