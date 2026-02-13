import React, { useEffect } from 'react';
import { FiX, FiDownload } from 'react-icons/fi';

const ImagePreviewModal = ({ isOpen, onClose, imageUrl, title }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
            {/* Backdrop with Blur */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-max max-w-full max-h-full flex flex-col items-center animate-in zoom-in-95 duration-300">
                {/* Header/Controls */}
                <div className="absolute -top-12 left-0 right-0 flex items-center justify-between px-2">
                    <h3 className="text-white font-black text-sm tracking-widest uppercase">{title}</h3>
                    <div className="flex items-center gap-3">
                        <a
                            href={imageUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all active:scale-90"
                            title="Télécharger l'image"
                        >
                            <FiDownload size={20} />
                        </a>
                        <button
                            onClick={onClose}
                            className="p-2.5 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all active:scale-90"
                        >
                            <FiX size={20} />
                        </button>
                    </div>
                </div>

                {/* Image Container */}
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/20 bg-white/5 p-2">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="max-w-[95vw] max-h-[85vh] object-contain rounded-[1.5rem]"
                        style={{ boxShadow: '0 0 50px rgba(0,0,0,0.3)' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ImagePreviewModal;
