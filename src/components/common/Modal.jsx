import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import clsx from 'clsx';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, title, children, icon, size = 'md' }) => {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full m-4',
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur effect */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-md transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Content */}
            <div className={clsx(
                "relative z-10 w-full transform rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl transition-all border border-white/60 flex flex-col max-h-[90vh]",
                "animate-in fade-in zoom-in-95 duration-200",
                sizeClasses[size]
            )}>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100/50 p-6 pb-4 shrink-0">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3 tracking-tight">
                        {icon && (
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm">
                                {React.cloneElement(icon, { size: 22 })}
                            </div>
                        )}
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-xl p-2.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 pt-2 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
